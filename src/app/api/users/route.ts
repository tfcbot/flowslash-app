// src/app/api/users/route.ts
import { NextResponse } from 'next/server'
import { db } from '../../../db'
import { usersTable, type NewUser } from '../../../schema'
import { safeNeonOperation } from '../../../db/utils'

export async function GET() {
  try {
    const users = await safeNeonOperation(() => db().select().from(usersTable))

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    const newUser: NewUser = {
      name: body.name,
      email: body.email,
      role: body.role || 'user',
      metadata: body.metadata || null,
      isActive: body.isActive ?? true,
    }

    const [createdUser] = await safeNeonOperation(() =>
      db().insert(usersTable).values(newUser).returning()
    )

    return NextResponse.json(createdUser, { status: 201 })
  } catch (error: unknown) {
    console.error('Error creating user:', error)

    // Handle unique constraint violations
    const errorMessage = error instanceof Error ? error.message : String(error)
    if (errorMessage.includes('duplicate key value')) {
      return NextResponse.json({ error: 'A user with this email already exists' }, { status: 409 })
    }

    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}
