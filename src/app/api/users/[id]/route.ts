// src/app/api/users/[id]/route.ts
import { NextResponse } from 'next/server'
import { db } from '../../../../db'
import { usersTable } from '../../../../schema'
import { eq } from 'drizzle-orm'
import { getUserSafely, safeNeonOperation } from '../../../../db/utils'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam)

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
    }

    const users = await getUserSafely(id)

    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(users[0])
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam)

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
    }

    const body = await request.json()

    const [updatedUser] = await safeNeonOperation(() =>
      db()
        .update(usersTable)
        .set({
          name: body.name,
          email: body.email,
          role: body.role,
          metadata: body.metadata,
          isActive: body.isActive,
          updatedAt: new Date(),
        })
        .where(eq(usersTable.id, id))
        .returning()
    )

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(updatedUser)
  } catch (error: unknown) {
    console.error('Error updating user:', error)

    const errorMessage = error instanceof Error ? error.message : String(error)
    if (errorMessage.includes('duplicate key value')) {
      return NextResponse.json({ error: 'A user with this email already exists' }, { status: 409 })
    }

    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam)

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
    }

    const [deletedUser] = await safeNeonOperation(() =>
      db().delete(usersTable).where(eq(usersTable.id, id)).returning()
    )

    if (!deletedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}
