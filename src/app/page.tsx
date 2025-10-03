import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getUser } from "@/lib/auth-utils";

export default async function Home() {
  const user = await getUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">Ecommerce App</h1>
              </div>
            </div>
            <div className="flex items-center">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">
                    Welcome, {user.name}
                  </span>
                  <Link href="/profile">
                    <Button variant="outline">Profile</Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link href="/login">
                    <Button variant="outline">Sign In</Button>
                  </Link>
                  <Link href="/register">
                    <Button>Register</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Welcome to the Ecommerce App</h2>
              <p className="text-gray-600 mb-6">
                This is a demo application with username and password authentication using Lucia Auth.
              </p>
              
              {user ? (
                <p className="text-green-600 font-medium">
                  You are logged in as {user.username} ({user.email})
                </p>
              ) : (
                <p className="text-blue-600 font-medium">
                  Please sign in or register to access your profile.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
