import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Dashboard | CyberShield",
  description:
    "Welcome to the CyberShield dashboard. Monitor and manage your cybersecurity with ease.",
  applicationName: "CyberShield",
  authors: [{ name: "CyberShield Team", url: "https://cybershield.club" }],
};

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return redirect("/");
  }
  return <>{children}</>;
}
