// src/components/UsersList.tsx
'use client';

import { db } from '../db';
import { queries } from '../db/utils';

export default function UsersList() {
  // Use InstantDB's useQuery hook to get profiles with their linked users
  const { isLoading, error, data } = db.useQuery(queries.allProfiles());

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-600">Error: {error.message}</div>
      </div>
    );
  }

  const profiles = data?.profiles || [];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Users</h1>

      {profiles.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No users found. Create your first user!
        </div>
      ) : (
        <div className="grid gap-4">
          {profiles.map((profile: any) => (
            <div
              key={profile.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {profile.name}
                  </h3>
                  <p className="text-gray-600">
                    {profile.$user &&
                    Array.isArray(profile.$user) &&
                    profile.$user[0]
                      ? profile.$user[0].email
                      : 'No email'}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      profile.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : profile.role === 'user'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {profile.role}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      profile.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {profile.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {profile.metadata && typeof profile.metadata === 'object' ? (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-600">
                    <strong>Metadata:</strong>
                  </p>
                  <pre className="text-xs text-gray-500 mt-1 overflow-x-auto">
                    {JSON.stringify(profile.metadata, null, 2)}
                  </pre>
                </div>
              ) : null}

              <div className="mt-4 flex justify-between text-sm text-gray-500">
                <span>
                  Created:{' '}
                  {profile.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString()
                    : 'N/A'}
                </span>
                <span>
                  Updated:{' '}
                  {profile.updatedAt
                    ? new Date(profile.updatedAt).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
