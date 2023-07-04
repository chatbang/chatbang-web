import { prettyObject } from "@/app/utils/format";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../auth";
import { requestBackend, requestOpenai } from "../../common";

async function handle(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  console.log("[OpenAI Route] params ", params);

  const authResult = auth(req);
  if (authResult.error) {
    return NextResponse.json(authResult, {
      status: 401,
    });
  }

  try {
    const reqBody = await req?.json();
    const messages = reqBody?.messages ?? [];
    const question = messages[messages.length - 1]?.content;
    const history = messages
      .slice(0, messages.length - 1)
      .map((m: any) => m.content);

    if (!question) {
      return NextResponse.json(
        { message: "No question in the request" },
        {
          status: 400,
        },
      );
    }
    return await requestBackend(question, history);
  } catch (e) {
    console.error("[OpenAI] ", e);
    return NextResponse.json(prettyObject(e));
  }
}

export const GET = handle;
export const POST = handle;

export const runtime = "edge";
