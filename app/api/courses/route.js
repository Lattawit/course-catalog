import { NextResponse, connection } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  await connection(); // อ่านข้อมูลล่าสุดเสมอ ไม่ prerender ตอน build
  const [rows] = await pool.query("SELECT * FROM courses ORDER BY id");
  return NextResponse.json(rows);
}

export async function POST(request) {
  const { code, title, credits, semester, seats, instructorId } = await request.json();
  if (!code || !title || !credits || !semester || !seats || !instructorId) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const [result] = await pool.query(
    "INSERT INTO courses (code, title, credits, semester, seats, instructorId) VALUES (?, ?, ?, ?, ?, ?)",
    [code, title, credits, semester, seats, instructorId]
  );
  return NextResponse.json({ id: result.insertId }, { status: 201 });
}