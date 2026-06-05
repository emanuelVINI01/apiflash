import { auth } from "@/auth";

export async function requireUserId() {
  const session = await auth();
  return session?.user?.id ?? null;
}
