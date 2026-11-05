"use client";

import { useRouter } from "next/navigation";

export default function AddCourseForm({ instructors }) {
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    const res = await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      form.reset();
      router.refresh(); // รัน Server Component ใหม่เพื่อแสดงรายวิชาที่เพิ่ม
    } else {
      alert((await res.json()).error);
    }
  }

  const input = "rounded border border-slate-600 bg-slate-800 px-3 py-2";

  return (
    <form onSubmit={handleSubmit} className="mt-10 grid gap-3 rounded-lg bg-slate-800/50 p-5 sm:grid-cols-3">
      <h2 className="text-xl font-semibold sm:col-span-3">Add course</h2>
      <input name="code" placeholder="Code (e.g. DIT400)" required className={input} />
      <input name="title" placeholder="Title" required className={`${input} sm:col-span-2`} />
      <input name="credits" type="number" min="1" placeholder="Credits" required className={input} />
      <input name="semester" placeholder="Semester (e.g. 2/2026)" required className={input} />
      <input name="seats" type="number" min="1" placeholder="Seats" required className={input} />
      <select name="instructorId" required className={`${input} sm:col-span-2`}>
        {instructors.map((i) => (
          <option key={i.id} value={i.id}>{i.fullname}</option>
        ))}
      </select>
      <button className="rounded bg-blue-600 px-4 py-2 font-semibold hover:bg-blue-500">Add</button>
    </form>
  );
}