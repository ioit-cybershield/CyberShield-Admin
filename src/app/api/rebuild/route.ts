// src/app/api/rebuild/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  const ghToken = process.env.GITHUB_PAT;
  const owner = "ioit-cybershield";
  const repo = "ioit-cybershield.github.io";
  const workflowFileName = "deploy.yml";

  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflowFileName}/dispatches`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ghToken}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.github+json",
      },
      body: JSON.stringify({ ref: "main" }),
    },
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to trigger rebuild" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
