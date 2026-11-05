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

  const input =
    "w-full rounded border border-purple-800/60 bg-[#1a1030] px-3 py-2 text-purple-50 placeholder:text-purple-300/40 focus:border-purple-400 focus:outline-none";

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-3 rounded-lg border border-purple-900/50 bg-purple-950/30 p-5"
    >
      <h2 className="text-lg font-semibold text-purple-200">Add course</h2>
      <input name="code" placeholder="Code (e.g. DIT400)" required className={input} />
      <input name="title" placeholder="Title" required className={input} />
      <div className="grid grid-cols-2 gap-3">
        <input name="credits" type="number" min="1" placeholder="Credits" required className={input} />
        <input name="seats" type="number" min="1" placeholder="Seats" required className={input} />
      </div>
      <input name="semester" placeholder="Semester (e.g. 2/2026)" required className={input} />
      <select name="instructorId" required className={input}>
        {instructors.map((i) => (
          <option key={i.id} value={i.id}>{i.fullname}</option>
        ))}
      </select>
      <button className="rounded bg-purple-600 px-4 py-2 font-semibold hover:bg-purple-500">
        Add course
      </button>
    </form>
  );
}