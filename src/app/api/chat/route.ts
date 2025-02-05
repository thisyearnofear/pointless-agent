import type { NextRequest } from "next/server";

const { BITTE_API_KEY, BITTE_API_URL } = process.env;

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: NextRequest): Promise<Response> {
  const requestInit: RequestInit & { duplex: "half" } = {
    method: "POST",
    body: req.body,
    headers: {
      Authorization: `Bearer ${BITTE_API_KEY}`,
    },
    duplex: "half",
  };

  const upstreamResponse = await fetch(BITTE_API_URL!, requestInit);
  const headers = new Headers(upstreamResponse.headers);
  headers.delete("Content-Encoding");

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers,
  });
}
