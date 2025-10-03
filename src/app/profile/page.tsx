import { requireAuth } from "@/lib/auth-utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";

async function LogoutButton() {
  const handleLogout = async () => {
    "use server";
    
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/auth/logout", {
        method: "POST",
      });
      
      if (response.ok) {
        // Redirect to login page after successful logout
        redirect("/login");
      } else {
        // Handle error
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <form action={handleLogout}>
      <Button type="submit" variant="outline">
        Logout
      </Button>
    </form>
  );
}

export default async function ProfilePage() {
  const user = await requireAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
        
        <div className="space-y-4 mb-6">
          <div>
            <h2 className="text-sm font-medium text-gray-500">Username</h2>
            <p className="text-lg">{user.username}</p>
          </div>
          
          <div>
            <h2 className="text-sm font-medium text-gray-500">Full Name</h2>
            <p className="text-lg">{user.name}</p>
          </div>
          
          <div>
            <h2 className="text-sm font-medium text-gray-500">Email</h2>
            <p className="text-lg">{user.email}</p>
          </div>
          
          <div>
            <h2 className="text-sm font-medium text-gray-500">Role</h2>
            <p className="text-lg capitalize">{user.role}</p>
          </div>
        </div>
        
        <div className="flex justify-between">
          <LogoutButton />
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}