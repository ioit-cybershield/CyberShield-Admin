"use client";

import { authClient } from "@/lib/auth-client";
import React, { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import Logo from "@/assets/logo.svg";
import Image from "next/image";
import { redirect } from "next/navigation";

async function getUserSession() {
  const user = await authClient.getSession();

  if (user) {
    return redirect("/dashboard");
  }
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      await getUserSession();
    };
    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await authClient.signIn.email(
        {
          email: email,
          password: password,
          callbackURL: "/dashboard",
        },
        {
          onError: (context) => {
            toast.error("Login failed", {
              description:
                context.error?.message ||
                "Please check your credentials and try again.",
            });
            setIsLoading(false);
          },
          onRequest: () => {
            toast.info("Signing in...", { duration: 2000 });
          },
          onSuccess: () => {
            toast.success("Welcome back!", {
              description: "Redirecting to dashboard...",
            });
          },
        },
      );
    } catch (error) {
      toast.error("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster position="bottom-right" visibleToasts={3} />
      <div className="flex min-h-screen w-full bg-white text-[#151515]">
        {/* Left Column: Login Form */}
        <div className="relative flex w-full flex-col justify-center px-8 py-12 xl:w-1/2 xl:px-20">
          {/* Logo */}
          <div className="absolute top-8 left-8 xl:top-12 xl:left-20">
            <Image
              src={Logo}
              alt="CyberShield Logo"
              className="h-12 w-12 md:h-16 md:w-16"
            />
          </div>

          {/* Form Container */}
          <div className="mx-auto w-full max-w-lg space-y-6">
            <h1 className="text-4xl font-semibold tracking-tighter text-[#151515] sm:text-5xl">
              Log in to CyberShield
            </h1>

            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
              {/* Input: Email */}
              <div className="relative">
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  placeholder="name@company.com"
                  className="h-12 w-full border border-zinc-300 bg-transparent px-3 text-lg text-[#151515] placeholder:text-zinc-400 transition-all hover:border-zinc-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                />
              </div>

              {/* Input: Password */}
              <div className="relative">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <div className="flex">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    placeholder="Password"
                    className="h-12 w-full border-y border-l border-zinc-300 bg-transparent px-3 text-lg text-[#151515] placeholder:text-zinc-400 transition-all hover:border-zinc-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="flex h-12 w-12 items-center justify-center border-y border-r border-zinc-300 text-zinc-400 transition-colors hover:border-zinc-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                        <line x1="2" x2="22" y1="2" y2="22" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 flex h-12 w-full items-center justify-center bg-[#151515] text-xl font-medium text-white transition-all hover:opacity-90 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Log in"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Visual Art */}
        <div className="relative hidden h-screen w-1/2 flex-col justify-center overflow-hidden bg-white xl:flex">
          <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 opacity-100">
            <div className="bg-white"></div>
            <div className="bg-white"></div>
            <div className="bg-amber-500"></div>
            <div className="bg-purple-800"></div>
            <div className="bg-white"></div>
            <div className="bg-red-600"></div>
            <div className="bg-white"></div>
            <div className="bg-red-600"></div>
            <div className="bg-purple-800"></div>
            <div className="bg-orange-500"></div>
            <div className="bg-red-600"></div>
            <div className="bg-blue-800"></div>
            <div className="bg-red-600"></div>
            <div className="bg-amber-400"></div>
            <div className="bg-green-600"></div>
            <div className="bg-blue-800"></div>
            <div className="absolute top-0 right-0 h-1/4 w-1/4 bg-amber-400"></div>
            <div className="absolute bottom-0 right-0 h-1/4 w-1/4 bg-purple-800"></div>
            <div className="absolute bottom-0 left-0 h-1/4 w-1/4 bg-green-600"></div>
            <div className="absolute bottom-[25%] left-[25%] h-1/4 w-1/4 bg-blue-800"></div>
            <div className="absolute top-[25%] right-[25%] h-1/4 w-1/4 bg-green-600"></div>
          </div>
          <div className="relative z-10 mx-auto flex w-full max-w-lg flex-col gap-6 px-12">
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl font-semibold leading-tight tracking-tight text-[#151515] sm:text-4xl">
                Welcome back! You&apos;re building the future
              </h1>
              <p className="text-sm font-medium leading-relaxed text-[#151515]">
                This portal allows access to all the content that powers the
                CyberShield official website. Administrators can add and remove
                content according to their requirements and make changes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
