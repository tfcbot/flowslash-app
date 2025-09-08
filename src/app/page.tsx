import UsersList from '../components/UsersList';
import AddUserForm from '../components/AddUserForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            FlowSlash App
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Powered by InstantDB for real-time data synchronization
          </p>
          <p className="text-sm text-gray-500">
            Next.js + InstantDB + TypeScript
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add User Form */}
          <div className="lg:col-span-1">
            <AddUserForm />
          </div>

          {/* Users List */}
          <div className="lg:col-span-2">
            <UsersList />
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <a
              href="https://instantdb.com/docs"
              className="group rounded-lg border border-gray-200 p-6 transition-colors hover:border-blue-300 hover:bg-blue-50"
              target="_blank"
              rel="noopener noreferrer"
            >
              <h2 className="mb-3 font-semibold text-xl text-gray-900">
                InstantDB Docs{' '}
                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                  →
                </span>
              </h2>
              <p className="text-sm text-gray-600">
                Learn about real-time database features and live queries.
              </p>
            </a>

            <a
              href="https://nextjs.org/docs"
              className="group rounded-lg border border-gray-200 p-6 transition-colors hover:border-blue-300 hover:bg-blue-50"
              target="_blank"
              rel="noopener noreferrer"
            >
              <h2 className="mb-3 font-semibold text-xl text-gray-900">
                Next.js Docs{' '}
                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                  →
                </span>
              </h2>
              <p className="text-sm text-gray-600">
                Find in-depth information about Next.js features and API.
              </p>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
