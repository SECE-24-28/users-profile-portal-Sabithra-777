"use client";
import { useState } from "react";

interface StudentData {
  name: string; email: string; phone: string; department: string; year: number;
}

interface Props {
  initial?: Partial<StudentData>;
  onSubmit: (data: StudentData) => void;
  loading: boolean;
  onCancel: () => void;
}

export default function StudentForm({ initial, onSubmit, loading, onCancel }: Props) {
  const [form, setForm] = useState<StudentData>({
    name: initial?.name || "",
    email: initial?.email || "",
    phone: initial?.phone || "",
    department: initial?.department || "",
    year: initial?.year || 1,
  });

  const set = (k: keyof StudentData, v: string | number) => setForm(f => ({ ...f, [k]: v }));

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(form); }} className="space-y-3">
      <input placeholder="Full Name" value={form.name} onChange={e => set("name", e.target.value)}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
      <input type="email" placeholder="Email" value={form.email} onChange={e => set("email", e.target.value)}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
      <input placeholder="Phone" value={form.phone} onChange={e => set("phone", e.target.value)}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
      <input placeholder="Department" value={form.department} onChange={e => set("department", e.target.value)}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
      <select value={form.year} onChange={e => set("year", parseInt(e.target.value))}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
        {[1, 2, 3, 4].map(y => <option key={y} value={y}>Year {y}</option>)}
      </select>
      <div className="flex gap-2">
        <button type="submit" disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
          {loading ? "Saving..." : "Save"}
        </button>
        <button type="button" onClick={onCancel}
          className="flex-1 border py-2 rounded hover:bg-gray-50">Cancel</button>
      </div>
    </form>
  );
}
