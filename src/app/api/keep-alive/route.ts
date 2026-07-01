import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { Database } from "@/lib/databaseTypes";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { status: "error", message: "Supabase is not configured." },
      { status: 503 }
    );
  }

  const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  const { error } = await supabase
    .from("custom_fonts")
    .select("id", { count: "exact", head: true });

  if (error) {
    return NextResponse.json(
      { status: "error", message: "Supabase keep-alive query failed." },
      { status: 500 }
    );
  }

  return NextResponse.json({ status: "ok" });
}
