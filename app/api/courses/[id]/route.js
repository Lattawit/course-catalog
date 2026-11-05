import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(request, { params }) {
  const { id } = await params;
  const [rows] = await pool.query("SELECT * FROM courses WHERE id = ?", [id]);
  if (rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(rows[0]);
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const { code, title, credits, semester, seats, instructorId } = await request.json();
  const [result] = await pool.query(
    "UPDATE courses SET code=?, title=?, credits=?, semester=?, seats=?, instructorId=? WHERE id=?",
    [code, title, credits, semester, seats, instructorId, id]
  );
  if (result.affectedRows === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ status: "ok" });
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const [result] = await pool.query("DELETE FROM courses WHERE id = ?", [id]);
  if (result.affectedRows === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ status: "ok" });
}