"use client";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_STUDENTS, ADD_STUDENT } from "@/lib/graphql-operations";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import StudentCard from "@/components/StudentCard";
import StudentForm from "@/components/StudentForm";
import toast from "react-hot-toast";

interface Student {
  id: string; name: string; email: string; phone?: string;
  department: string; year: number; profileImage?: string; createdAt: string;
}

export default function StudentsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user) router.push("/auth");
  }, [user, router]);

  const { data, loading } = useQuery(GET_STUDENTS, { skip: !user });
  const [addStudent, { loading: addLoading }] = useMutation(ADD_STUDENT, {
    refetchQueries: [GET_STUDENTS],
    onCompleted: () => { toast.success("Student added!"); setShowAdd(false); },
  });

  const students: Student[] = data?.students || [];
  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.department.toLowerCase().includes(search.toLowerCase())
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">🎓 Student Portal</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user.email}</span>
          <button onClick={() => { logout(); router.push("/auth"); }}
            className="text-sm text-red-500 hover:text-red-700">Logout</button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            placeholder="Search by name, email, department..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button onClick={() => setShowAdd(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 whitespace-nowrap">
            + Add Student
          </button>
        </div>

        {showAdd && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4">Add New Student</h2>
              <StudentForm
                loading={addLoading}
                onCancel={() => setShowAdd(false)}
                onSubmit={data => addStudent({ variables: data })}
              />
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading students...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            {search ? "No students match your search." : "No students yet. Add one!"}
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-500 mb-4">{filtered.length} student{filtered.length !== 1 ? "s" : ""}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(student => <StudentCard key={student.id} student={student} />)}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
