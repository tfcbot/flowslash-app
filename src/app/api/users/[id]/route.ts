// src/app/api/users/[id]/route.ts
import { NextResponse } from 'next/server';

// Note: With InstantDB, most operations should be done client-side
// These API routes are kept for compatibility but are not recommended
// Consider using db.useQuery() and db.transact() directly in your components

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json(
    {
      message: `Use InstantDB client-side queries instead. See db.useQuery(queries.profileById('${id}')) in your components.`,
      deprecated: true,
    },
    { status: 200 }
  );
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json(
    {
      message: `Use InstantDB client-side transactions instead. See updateProfile('${id}', updates) utility function.`,
      deprecated: true,
    },
    { status: 200 }
  );
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json(
    {
      message: `Use InstantDB client-side transactions instead. See deleteProfile('${id}') utility function.`,
      deprecated: true,
    },
    { status: 200 }
  );
}
