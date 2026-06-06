"use client";
import { useState } from "react";
import Image from "next/image";
import { useMutation } from "@apollo/client";
import { UPDATE_PROFILE_IMAGE, DELETE_STUDENT, UPDATE_STUDENT, GET_STUDENTS } from "@/lib/graphql-operations";
import toast from "react-hot-toast";
import StudentForm from "./StudentForm";

interface Student {
  id: string; name: string; email: string; phone?: string;
  department: string; year: number; profileImage?: string; createdAt: string;
}

export default function StudentCard({ student }: { student: Student }) {
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [updateImage] = useMutation(UPDATE_PROFILE_IMAGE, { refetchQueries: [GET_STUDENTS] });
  const [deleteStudent] = useMutation(DELETE_STUDENT, { refetchQueries: [GET_STUDENTS] });
  const [updateStudent, { loading: updateLoading }] = useMutation(UPDATE_STUDENT, {
    refetchQueries: [GET_STUDENTS],
    onCompleted: () => { toast.success("Updated!"); setEditing(false); }
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
        body: form,
      });
      const { url } = await res.json();
      await updateImage({ variables: { id: student.id, profileImage: url } });
      toast.success("Photo updated!");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete ${student.name}?`)) return;
    try {
      await deleteStudent({ variables: { id: student.id } });
      toast.success("Student deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
          {student.profileImage ? (
            <Image src={student.profileImage} alt={student.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl text-gray-400 font-bold">
              {student.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 truncate">{student.name}</h3>
          <p className="text-sm text-gray-500 truncate">{student.email}</p>
          <p className="text-xs text-blue-600">{student.department} · Year {student.year}</p>
        </div>
      </div>

      {student.phone && <p className="text-sm text-gray-600">📞 {student.phone}</p>}

      {editing ? (
        <StudentForm
          initial={student}
          loading={updateLoading}
          onCancel={() => setEditing(false)}
          onSubmit={data => updateStudent({ variables: { id: student.id, ...data } })}
        />
      ) : (
        <div className="flex gap-2 flex-wrap">
          <label className="cursor-pointer text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded hover:bg-green-100">
            {uploading ? "Uploading..." : "📷 Photo"}
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
          </label>
          <button onClick={() => setEditing(true)}
            className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded hover:bg-blue-100">
            ✏️ Edit
          </button>
          <button onClick={handleDelete}
            className="text-xs bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded hover:bg-red-100">
            🗑️ Delete
          </button>
        </div>
      )}
    </div>
  );
}
