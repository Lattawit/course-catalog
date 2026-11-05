import { Suspense } from "react";
import { connection } from "next/server";
import { pool } from "@/lib/db";
import AddCourseForm from "./add-course-form";
import CourseList from "./course-list";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#150b28] to-[#0a0612] text-purple-50">
      <header className="border-b border-purple-900/50 bg-[#0f081e]/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <div>
            <h1 className="bg-gradient-to-r from-purple-300 to-fuchsia-400 bg-clip-text text-2xl font-bold text-transparent">
              Course Catalog
            </h1>
            <p className="text-sm text-purple-300/60">Lattawit Sirisawat · 6706989</p>
          </div>
          <code className="hidden rounded-full border border-purple-800/60 px-3 py-1 text-xs text-purple-300/70 sm:block">
            6706989_mydb
          </code>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <Suspense fallback={<Skeleton />}>
          <Courses />
        </Suspense>
      </div>
    </main>
  );
}

async function Courses() {
  await connection(); // รัน query ทุก request ไม่ใช่ตอน build

  const [courseRows] = await pool.query(
    `SELECT c.id, c.code, c.title, c.credits, c.semester, c.seats, c.instructorId,
            i.fullname AS instructor
     FROM courses c
     JOIN instructor i ON i.id = c.instructorId
     ORDER BY c.semester, c.code`
  );
  const [instructorRows] = await pool.query(
    "SELECT id, fullname FROM instructor ORDER BY fullname"
  );

  const courses = courseRows.map((c) => ({ ...c }));
  const instructors = instructorRows.map((i) => ({ ...i }));
  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <section className="space-y-8">
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Courses" value={courses.length} />
          <Stat label="Credits" value={totalCredits} />
          <Stat label="Instructors" value={instructors.length} />
        </div>

        <CourseList courses={courses} instructors={instructors} />
      </section>

      <aside className="lg:sticky lg:top-6 lg:self-start">
        <AddCourseForm instructors={instructors} />
      </aside>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg border border-purple-900/60 bg-[#1a1030] p-4">
      <p className="text-2xl font-bold text-purple-200">{value}</p>
      <p className="text-xs uppercase tracking-wider text-purple-300/60">{label}</p>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-16 animate-pulse rounded-lg bg-purple-900/30" />
      ))}
    </div>
  );
}