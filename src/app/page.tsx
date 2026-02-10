// src/app/page.tsx
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    // Already logged in → go straight to dashboard
    redirect("/dashboard");
  }

  // Not logged in → show the login UI
  return <LoginForm />;
}
