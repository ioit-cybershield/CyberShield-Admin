// src/app/page.tsx
"use client";

import React, { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login submitted");
  };

  return (
    <div className="flex min-h-screen w-full bg-white text-[#151515]">
      {/* Left Column: Login Form */}
      {/* Added 'relative' here so the absolute logo positions itself relative to this column */}
      <div className="relative flex w-full flex-col justify-center px-8 py-12 xl:w-1/2 xl:px-20">
        
        {/* Logo - Positioned absolutely in the upper left corner */}
        {/* Values match the container padding (px-8/py-12 and xl:px-20) for visual alignment */}
        <div className="absolute top-8 left-8 xl:top-12 xl:left-20">
          <svg
            width="32"
            height="36"
            viewBox="0 0 24 27"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-9"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M17.5996 2.39995H8.23021C8.10222 2.39995 7.99982 2.29755 7.99982 2.16955V0.230395C7.99982 0.102398 7.89742 0 7.76942 0H0.230395C0.102398 0 0 0.102398 0 0.230395V10.1694C0 10.2974 0.102398 10.3998 0.230395 10.3998H23.7691C23.8971 10.3998 23.9995 10.2974 23.9995 10.1694V8.7998C23.9995 5.26548 21.1339 2.39995 17.5996 2.39995ZM0.0303404 18.6303V26.1693C0.0303404 26.2973 0.132738 26.3997 0.260735 26.3997H17.5995C21.1339 26.3997 23.9994 23.5342 23.9994 19.9998V18.6303C23.9994 18.5023 23.897 18.3999 23.769 18.3999H0.260735C0.132738 18.3999 0.0303404 18.5023 0.0303404 18.6303ZM22.5859 15.8646C23.3666 15.8646 24 15.2695 24 14.4505C24 13.6315 23.3666 13.0364 22.5859 13.0364C21.8053 13.0364 21.1718 13.6315 21.1718 14.4505C21.1718 15.2695 21.8053 15.8646 22.5859 15.8646ZM22.5859 13.2988C23.2258 13.2988 23.7057 13.7979 23.7057 14.4505C23.7057 15.1032 23.2258 15.6023 22.5859 15.6023C21.9461 15.6023 21.4662 15.1032 21.4662 14.4505C21.4662 13.7979 21.9461 13.2988 22.5859 13.2988ZM22.3556 15.1864V14.5465H22.5027L22.9059 15.1864H23.2962L22.8803 14.5337C23.117 14.4825 23.2322 14.3034 23.2322 14.1178C23.2322 13.8683 23.0402 13.6955 22.7203 13.6955H22.0037V15.1864H22.3556ZM22.3556 13.945H22.6563C22.7971 13.945 22.8611 14.0218 22.8611 14.1242C22.8611 14.2202 22.7971 14.3034 22.6563 14.3034H22.3556V13.945Z"
              fill="#151515"
            />
          </svg>
        </div>

        {/* Form Container - Wider inputs with max-w-lg */}
        <div className="mx-auto w-full max-w-lg space-y-6">
          <h1 className="text-4xl font-semibold tracking-tighter text-[#151515] sm:text-5xl">
            Log in to CyberShield
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            {/* Input: Email */}
            <div className="group relative">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative flex h-12 w-full items-center border border-zinc-300 bg-transparent px-3 transition-colors focus-within:border-black hover:border-zinc-400">
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  placeholder="name@company.com"
                  className="h-full w-full bg-transparent text-lg text-[#151515] placeholder:text-zinc-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                />
              </div>
            </div>

            {/* Input: Password */}
            <div className="group relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative flex h-12 w-full items-center border border-zinc-300 bg-transparent px-3 transition-colors focus-within:border-black hover:border-zinc-400">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="Password"
                  className="h-full w-full bg-transparent text-lg text-[#151515] placeholder:text-zinc-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2 text-zinc-400 hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
                  aria-label={showPassword ? "Hide password" : "Show password"}
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

            {/* Action Buttons */}
            <button
              type="submit"
              className="mt-2 flex h-12 w-full items-center justify-center bg-[#151515] text-xl font-medium text-white transition-opacity hover:opacity-90 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            >
              Log in
            </button>
          </form>
        </div>
      </div>

      {/* Right Column: Visual Art - Hidden on small screens */}
      <div className="relative hidden h-screen w-1/2 flex-col justify-center overflow-hidden bg-white xl:flex">
        {/* Pixel Art Background */}
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 opacity-100">
          {/* Row 1 */}
          <div className="bg-white"></div>
          <div className="bg-white"></div>
          <div className="bg-amber-500"></div>
          <div className="bg-purple-800"></div>

          {/* Row 2 */}
          <div className="bg-white"></div>
          <div className="bg-red-600"></div>
          <div className="bg-white"></div>
          <div className="bg-red-600"></div>

          {/* Row 3 */}
          <div className="bg-purple-800"></div>
          <div className="bg-orange-500"></div>
          <div className="bg-red-600"></div>
          <div className="bg-blue-800"></div>

          {/* Row 4 */}
          <div className="bg-red-600"></div>
          <div className="bg-amber-400"></div>
          <div className="bg-green-600"></div>
          <div className="bg-blue-800"></div>

          {/* Extra absolute blocks for finer detail */}
          <div className="absolute top-0 right-0 h-1/4 w-1/4 bg-amber-400"></div>
          <div className="absolute bottom-0 right-0 h-1/4 w-1/4 bg-purple-800"></div>
          <div className="absolute bottom-0 left-0 h-1/4 w-1/4 bg-green-600"></div>
          <div className="absolute bottom-[25%] left-[25%] h-1/4 w-1/4 bg-blue-800"></div>
          <div className="absolute top-[25%] right-[25%] h-1/4 w-1/4 bg-green-600"></div>
        </div>

        {/* Text Content */}
        <div className="relative z-10 mx-auto flex w-full max-w-lg flex-col gap-6 px-12">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-[#151515] sm:text-4xl">
              Welcome back! You're building the future
            </h1>
            <p className="text-sm font-medium leading-relaxed text-[#151515]">
              Work with a dedicated CyberShield machine learning engineer to
              create a custom security agent and automate your organization's
              monitoring.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}