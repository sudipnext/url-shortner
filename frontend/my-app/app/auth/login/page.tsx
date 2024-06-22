"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthActions } from "@/app/auth/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { toast, Toaster } from "sonner";

type FormData = {
  email: string;
  password: string;
};

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    mode: "onBlur",
  });

  const router = useRouter();
  const { setIsLoggedIn } = useAuth();

  const { login, storeToken, storeUserObject } = AuthActions();

  const onSubmit = (data: FormData) => {
    login(data.email, data.password)
      .json((json) => {
        console.log(json.user);
        storeToken(json.access, "access");
        storeToken(json.refresh, "refresh");
        setIsLoggedIn(true);
        storeUserObject(json.user);
        toast.success("Logged in successfully");
        router.push("/");
      })
      .catch((err) => {
        setError("root", { type: "manual", message: err.detail });
        const errorData = JSON.parse(err.message);
        toast.error("Failed to login: " + Object.values(errorData).join(", "));
        setIsLoggedIn(false);
      });
  };

  return (
    <Card className="mx-auto max-w-sm mt-20 sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
      <Toaster richColors />
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <span className="text-xs text-red-600">Email is required</span>
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/api/auth/password/reset-password"
                className="ml-auto inline-block text-sm underline"
              >
                Forgot your password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="********"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <span className="text-xs text-red-600">Password is required</span>
            )}
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
          {errors.root && (
            <span className="text-xs text-red-600">{errors.root.message}</span>
          )}
        </form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default Login;
