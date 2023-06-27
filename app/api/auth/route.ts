import { NextRequest, NextResponse } from "next/server";
import { auth } from "../auth";

// auth相关
async function handle(req: NextRequest) {
  const authResult = auth(req);

  if (authResult.error) {
    return NextResponse.json({
      ...authResult,
      status: 401,
    });
  }

  return NextResponse.json({
    status: 200,
    isAdmin: authResult.isAdmin,
    error: false,
  });
}

export const GET = handle;
export const POST = handle;

export const runtime = "edge";
