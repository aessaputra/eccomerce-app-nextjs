"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormErrors {
  username?: string[];
  name?: string[];
  email?: string[];
  password?: string[];
  general?: string;
}

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Registration successful, redirect to profile page
        router.push("/profile");
        router.refresh();
      } else {
        // Handle errors
        if (data.details) {
          // Format validation errors
          const formattedErrors: FormErrors = {};
          data.details.forEach((detail: any) => {
            if (detail.path && detail.path.length > 0) {
              const field = detail.path[0];
              if (field === 'username' || field === 'name' || field === 'email' || field === 'password') {
                if (!formattedErrors[field as keyof FormErrors]) {
                  (formattedErrors as any)[field] = [];
                }
                ((formattedErrors as any)[field] as string[]).push(detail.message);
              }
            }
          });
          setErrors(formattedErrors);
        } else {
          // General error
          setErrors({ general: data.error || "Registration failed" });
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ general: "An unexpected error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Create an Account</h1>
      
      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {errors.general}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={errors.username ? "border-red-500" : ""}
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-500">{errors.username[0]}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name[0]}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email[0]}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={errors.password ? "border-red-500" : ""}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password[0]}</p>
          )}
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Register"}
        </Button>
      </form>
      
      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <a href="/login" className="text-blue-600 hover:underline">
          Sign in
        </a>
      </div>
    </div>
  );
}