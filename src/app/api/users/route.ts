// src/app/api/users/route.ts
import { NextResponse } from 'next/server';

// Note: With InstantDB, most operations should be done client-side
// These API routes are kept for compatibility but are not recommended
// Consider using db.useQuery() and db.transact() directly in your components

export async function GET() {
  return NextResponse.json(
    {
      message:
        'Use InstantDB client-side queries instead. See db.useQuery(queries.allProfiles()) in your components.',
      deprecated: true,
    },
    { status: 200 }
  );
}

export async function POST(_request: Request) {
  return NextResponse.json(
    {
      message:
        'Use InstantDB client-side transactions instead. See createProfile() utility function.',
      deprecated: true,
    },
    { status: 200 }
  );
}
