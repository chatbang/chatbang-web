import { NextRequest, NextResponse } from "next/server";

// auth相关
async function handle(req: NextRequest) {
  const { code } = await req.json();
  // 请求后端api验证

  return NextResponse.json({ status: "1", error: false });
}

export const GET = handle;
export const POST = handle;

export const runtime = "edge";
