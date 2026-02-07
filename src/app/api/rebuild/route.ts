// src/app/api/rebuild/route.ts
import { NextResponse } from "next/server";

const GITHUB_API_URL = process.env.GITHUB_API_URL!;
const GITHUB_REPO_OWNER = process.env.GITHUB_REPO_OWNER!;
const GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME!;
const GITHUB_WORKFLOW_FILE = process.env.GITHUB_WORKFLOW_FILE!;

export async function POST() {
  const ghToken = process.env.GITHUB_PAT;

  if (!ghToken) {
    return NextResponse.json(
      { error: "Missing GitHub token" },
      { status: 500 },
    );
  }

  const url = `${GITHUB_API_URL}/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/actions/workflows/${GITHUB_WORKFLOW_FILE}/dispatches`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ghToken}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github+json",
    },
    body: JSON.stringify({ ref: "main" }),
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to trigger rebuild" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
