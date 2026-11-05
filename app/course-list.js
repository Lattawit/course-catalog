"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const field =
  "w-full rounded border border-purple-800/60 bg-[#120a24] px-2 py-1.5 text-sm text-purple-50 placeholder:text-purple-300/40 focus:border-purple-400 focus:outline-none";

export default function CourseList({ courses, instructors }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [semester, setSemester] = useState("all");
  const [editingId, setEditingId] = useState(null);

  const semesters = [...new Set(courses.map((c) => c.semester))];

  const q = query.trim().toLowerCase();
  const filtered = courses.filter(
    (c) =>
      (semester === "all" || c.semester === semester) &&
      (!q ||
        c.code.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q))
  );

  const bySemester = {};
  for (const c of filtered) (bySemester[c.semester] ??= []).push(c);

  async function handleDelete(c) {
    if (!confirm(`Delete ${c.code} – ${c.title}?`)) return;
    const res = await fetch(`/api/courses/${c.id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else alert((await res.json()).error);
  }

  async function handleSave(e, id) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const res = await fetch(`/api/courses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setEditingId(null);
      router.refresh();
    } else {
      alert((await res.json()).error);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search code, title or instructor..."
          className={`${field} flex-1 py-2`}
        />
        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className={`${field} py-2 sm:w-48`}
        >
          <option value="all">All semesters</option>
          {semesters.map((s) => (
            <option key={s} value={s}>
              Semester {s}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 && (
        <p className="rounded-lg border border-dashed border-purple-900/60 p-8 text-center text-purple-300/60">
          No courses match your search.
        </p>
      )}

      {Object.entries(bySemester).map(([sem, list]) => (
        <div key={sem}>
          <h2 className="mb-3 flex items-center gap-3 text-sm font-semibold uppercase tracking-widest text-purple-300/70">
            Semester {sem}
            <span className="h-px flex-1 bg-purple-900/60" />
          </h2>
          <ul className="space-y-3">
            {list.map((c) =>
              editingId === c.id ? (
                <EditRow
                  key={c.id}
                  course={c}
                  instructors={instructors}
                  onSave={handleSave}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <li
                  key={c.id}
                  className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-purple-900/60 border-l-4 border-l-purple-500 bg-[#1a1030] p-4 transition hover:border-l-fuchsia-400 hover:bg-[#21143d]"
                >
                  <span className="w-20 shrink-0 font-mono text-sm font-semibold text-purple-300">
                    {c.code}
                  </span>
                  <div className="min-w-0 flex-1 basis-40">
                    <h3 className="font-semibold">{c.title}</h3>
                    <p className="text-sm text-purple-300/60">👤 {c.instructor}</p>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <span className="rounded bg-purple-900/50 px-2 py-1 text-purple-200">
                      {c.credits} credits
                    </span>
                    <span className="rounded bg-purple-900/50 px-2 py-1 text-purple-200">
                      {c.seats} seats
                    </span>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <button
                      onClick={() => setEditingId(c.id)}
                      className="rounded border border-purple-700/60 px-2 py-1 text-purple-200 hover:bg-purple-800/40"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c)}
                      className="rounded border border-rose-800/60 px-2 py-1 text-rose-300 hover:bg-rose-900/40"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              )
            )}
          </ul>
        </div>
      ))}
    </div>
  );
}

function EditRow({ course, instructors, onSave, onCancel }) {
  return (
    <li className="rounded-lg border border-purple-500/60 bg-[#21143d] p-4">
      <form onSubmit={(e) => onSave(e, course.id)} className="grid gap-3 sm:grid-cols-6">
        <input name="code" defaultValue={course.code} required className={`${field} sm:col-span-2`} />
        <input name="title" defaultValue={course.title} required className={`${field} sm:col-span-4`} />
        <input name="credits" type="number" min="1" defaultValue={course.credits} required className={`${field} sm:col-span-2`} />
        <input name="seats" type="number" min="1" defaultValue={course.seats} required className={`${field} sm:col-span-2`} />
        <input name="semester" defaultValue={course.semester} required className={`${field} sm:col-span-2`} />
        <select name="instructorId" defaultValue={course.instructorId} required className={`${field} sm:col-span-4`}>
          {instructors.map((i) => (
            <option key={i.id} value={i.id}>
              {i.fullname}
            </option>
          ))}
        </select>
        <div className="flex gap-2 sm:col-span-2 sm:justify-end">
          <button type="submit" className="rounded bg-purple-600 px-3 py-1.5 text-sm font-semibold hover:bg-purple-500">
            Save
          </button>
          <button type="button" onClick={onCancel} className="rounded border border-purple-700/60 px-3 py-1.5 text-sm text-purple-200 hover:bg-purple-800/40">
            Cancel
          </button>
        </div>
      </form>
    </li>
  );
}