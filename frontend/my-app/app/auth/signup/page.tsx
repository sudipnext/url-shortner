"use client";
import Link from "next/link";
import { useState } from "react";
import { FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    re_password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    re_password: "",
  });

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const form = event.currentTarget as HTMLFormElement;
      const formData = new FormData(form);
      const response = await fetch("http://127.0.0.1:8000/api/auth/users/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        router.push("/login");
      } else {
        const data = await response.json();
        const formErrors = {
          username: data.username ? data.username.join(" ") : "",
          email: data.email ? data.email.join(" ") : "",
          password: data.password ? data.password.join(" ") : "",
          re_password: data.re_password ? data.re_password.join(" ") : "",
        };
        setErrors(formErrors);
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    } finally {
      setLoading(false);
    }
  }

  // Validation function to check errors as the user types
  function validateInput(name: string, value: string) {
    switch (name) {
      case "username":
        if (value.length < 3) {
          return "Username must be at least 3 characters long";
        }
        break;
      case "email":
        if (!/\S+@\S+\.\S+/.test(value)) {
          return "Email is not valid";
        }
        break;
      case "password":
        if (value.length < 6) {
          return "Password must be at least 6 characters long";
        }
        break;
      case "re_password":
        if (value !== formData.password) {
          return "Passwords do not match";
        }
        break;
      default:
        break;
    }
    return "";
  }

  return (
    <Card className="mx-auto max-w-sm mt-40">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          action="http://127.0.0.1:8000/api/auth/users/"
          method="post"
        >
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                name="username"
                id="username"
                placeholder="Max"
                value={formData.username}
                onChange={handleInputChange}
                onBlur={() => {
                  setErrors({
                    ...errors,
                    username: validateInput("username", formData.username),
                  });
                }}
                required
              />
              {errors.username && (
                <p className="text-red-500">{errors.username}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={() => {
                  setErrors({
                    ...errors,
                    email: validateInput("email", formData.email),
                  });
                }}
                required
              />
              {errors.email && <p className="text-red-500">{errors.email}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                name="password"
                id="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={() => {
                  setErrors({
                    ...errors,
                    password: validateInput("password", formData.password),
                  });
                }}
              />
              {errors.password && (
                <p className="text-red-500">{errors.password}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="re_password">Retype Password</Label>
              <Input
                name="re_password"
                id="re_password"
                type="password"
                value={formData.re_password}
                onChange={handleInputChange}
                onBlur={() => {
                  setErrors({
                    ...errors,
                    re_password: validateInput(
                      "re_password",
                      formData.re_password
                    ),
                  });
                }}
              />
              {errors.re_password && (
                <p className="text-red-500">{errors.re_password}</p>
              )}
            </div>
            {loading ? (
              <p className="text-center">Creating Your Account...</p>
            ) : (
              <>
                <Button type="submit" className="w-full">
                  Create an account
                </Button>
                <Button variant="outline" className="w-full">
                  Sign up with Google
                </Button>
              </>
            )}
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
