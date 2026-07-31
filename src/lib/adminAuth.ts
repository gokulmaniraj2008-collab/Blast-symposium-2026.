import { NextRequest } from "next/server";

export function isAdminRequest(req: NextRequest) {
  const password = req.headers.get("x-admin-password");
  const expected = process.env.ADMIN_PASSWORD;
  return Boolean(expected) && password === expected;
}
