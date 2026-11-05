import { Suspense } from "react";
import { connection } from "next/server";
import { pool } from "@/lib/db";
import AddCourseForm from "./add-course-form";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Course Catalog</h1>
          <p className="text-slate-400">
            Lattawit Sirisawat 6706989 · database <code>6706989_mydb</code>
          </p>
        </header>

        <Suspense fallback={<p className="text-slate-400">Loading courses...</p>}>
          <Courses />
        </Suspense>
      </div>
    </main>
  );
}

async function Courses() {
  await connection(); // รัน query ทุก request ไม่ใช่ตอน build

  const [courses] = await pool.query(
    `SELECT c.id, c.code, c.title, c.credits, c.semester, c.seats,
            i.fullname AS instructor
     FROM courses c
     JOIN instructor i ON i.id = c.instructorId
     ORDER BY c.semester, c.code`
  );
  const [instructors] = await pool.query(
    "SELECT id, fullname FROM instructor ORDER BY fullname"
  );

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => (
          <div
            key={c.id}
            className="flex flex-col rounded-lg border-t-4 border-blue-600 bg-white p-5 text-slate-900 shadow transition hover:-translate-y-1 hover:shadow-xl"
          >
            <span className="mb-2 self-start rounded-full bg-blue-600 px-3 py-0.5 text-sm text-white">
              {c.code}
            </span>
            <h2 className="mb-3 text-lg font-semibold">{c.title}</h2>
            <div className="mb-4 flex flex-wrap gap-2 text-sm">
              <span className="rounded bg-slate-100 px-2">{c.credits} credits</span>
              <span className="rounded bg-slate-100 px-2">Sem {c.semester}</span>
              <span className="rounded bg-slate-100 px-2">{c.seats} seats</span>
            </div>
            <div className="mt-auto border-t pt-2 text-sm text-slate-500">
              👤 {c.instructor}
            </div>
          </div>
        ))}
      </div>

      <AddCourseForm instructors={instructors} />
    </>
  );
}