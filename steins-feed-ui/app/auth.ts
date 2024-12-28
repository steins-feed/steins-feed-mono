"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { client } from "@client"

client.setConfig({"baseUrl": process.env.API_BASE_URL});

export async function logout() {
  const cookie_store = await cookies();
  cookie_store.delete("api_token");
}

export async function authenticate() {
  const cookie_store = await cookies();
  const cookie = cookie_store.get("api_token");

  if (!cookie) {
    throw {"detail": "Not authenticated"};
  }

  client.interceptors.request.use(request => {
    request.headers.set("Authorization", `Bearer ${cookie.value}`);
    return request;
  });
}

export async function require_login(pathname: string) {
  redirect(`/login?pathname=${encodeURIComponent(pathname)}`);
}

export async function skip_login_if_unnecessary(pathname: string) {
  const cookie_store = await cookies();
  const cookie = cookie_store.get("api_token");

  if (!cookie) {
    return;
  }

  const payload = JSON.parse(Buffer.from(cookie.value.split('.')[1], 'base64').toString());
  const exp = new Date(1000 * payload.exp);
  const now = new Date();

  if (exp <= now) {
    return;
  }

  redirect(pathname);
}