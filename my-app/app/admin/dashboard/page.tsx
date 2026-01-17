"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Shield,
  LogOut,
  CheckCircle,
  XCircle,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);

  const authHeader = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  /* ---------------- FETCH ---------------- */
  const fetchPendingUsers = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/admin/pending-users",
      authHeader
    );
    setUsers(res.data);
  };

  /* ---------------- APPROVE (FUTURE BACKEND) ---------------- */
  const approveUser = async (userId: string) => {
    await axios.post(
      `http://localhost:5000/api/admin/users/${userId}/approve`,
      {},
      authHeader
    );
    fetchPendingUsers();
  };

  /* ---------------- REJECT (FUTURE BACKEND) ---------------- */
  const rejectUser = async (userId: string) => {
    if (!confirm("Reject this user?")) return;

    await axios.post(
      `http://localhost:5000/api/admin/users/${userId}/reject`,
      {},
      authHeader
    );
    fetchPendingUsers();
  };

  /* ---------------- SIGN OUT ---------------- */
  const signOut = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* TOP BAR */}
      <div className="flex items-center justify-between border-b bg-white px-10 py-3">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-slate-900" />
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              Super Admin Dashboard
            </h1>
            <p className="text-sm text-slate-700">
              Platform approvals & control
            </p>
          </div>
        </div>

        <button
          onClick={signOut}
          className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>

      {/* CONTENT */}
      <div className="px-10 py-8">
        {/* STATS */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            icon={Users}
            label="Pending Users"
            value={users.length}
          />
          <StatCard
            icon={Shield}
            label="Admin Actions Today"
            value={users.length}
          />
        </div>

        {/* APPROVALS */}
        <div className="rounded-xl border bg-white">
          <div className="border-b px-6 py-4">
            <h2 className="text-base font-semibold text-slate-900">
              Pending Approvals
            </h2>
          </div>

          {users.length === 0 ? (
            <p className="px-6 py-6 text-sm text-slate-700">
              No pending users
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-slate-800">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left font-semibold">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left font-semibold">
                    Role
                  </th>
                  <th className="px-6 py-3 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-t hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 text-slate-900 font-medium">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-slate-800">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-slate-800 capitalize">
                      {user.role}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => approveUser(user._id)}
                          className="flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Approve
                        </button>

                        <button
                          onClick={() => rejectUser(user._id)}
                          className="flex items-center gap-1 rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
                        >
                          <XCircle className="h-4 w-4" />
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- COMPONENT ---------------- */

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
          <Icon className="h-5 w-5 text-slate-900" />
        </div>
        <div>
          <p className="text-sm text-slate-700">{label}</p>
          <p className="text-2xl font-semibold text-slate-900">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
