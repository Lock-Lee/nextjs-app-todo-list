"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { register as registerUser } from "@/lib/auth";

type RegisterForm = {
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>();

  const router = useRouter();
  const password = watch("password");

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser(data.email, data.password);
      alert("Registered successfully!");
      router.push("/login");
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert("Registration failed: " + error.message);
      } else {
        alert("Registration failed: Unknown error");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4 bg-gray-100">
      <div className="w-80">
        <Link
          href="/login"
          className="flex items-center text-sm text-gray-600 hover:text-blue-600 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Login
        </Link>
      </div>

      <h1 className="text-2xl font-bold">Register</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4 w-80"
      >
        <Input
          placeholder="Email"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && (
          <span className="text-red-500 text-sm">{errors.email.message}</span>
        )}

        <Input
          type="password"
          placeholder="Password"
          {...register("password", { required: "Password is required" })}
        />
        {errors.password && (
          <span className="text-red-500 text-sm">
            {errors.password.message}
          </span>
        )}

        <Input
          type="password"
          placeholder="Confirm Password"
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) => value === password || "Passwords do not match",
          })}
        />
        {errors.confirmPassword && (
          <span className="text-red-500 text-sm">
            {errors.confirmPassword.message}
          </span>
        )}

        <Button type="submit">Register</Button>
      </form>
    </div>
  );
}
