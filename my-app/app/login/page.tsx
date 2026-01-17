"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { motion } from "framer-motion";
import { School, User, Shield } from "lucide-react";

type Role = "" | "teacher" | "school" | "superadmin";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("");

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-md border border-slate-200"
      >
        {/* SUPER ADMIN TOGGLE */}
        <button
          onClick={() => setRole("superadmin")}
          className={`absolute right-6 top-6 text-xs font-medium transition
            ${
              role === "superadmin"
                ? "text-slate-900"
                : "text-slate-400 hover:text-slate-700"
            }`}
        >
          Super Admin
        </button>

        {/* HEADER */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to continue to the platform
          </p>
        </div>

        {/* ROLE SELECTION */}
        <div className="mt-8 space-y-3">
          <RoleOption
            active={role === "teacher"}
            icon={User}
            title="Teacher"
            subtitle="Apply to verified schools"
            onClick={() => setRole("teacher")}
          />

          <RoleOption
            active={role === "school"}
            icon={School}
            title="School"
            subtitle="Post jobs & manage applicants"
            onClick={() => setRole("school")}
          />

          {role === "superadmin" && (
            <RoleOption
              active
              icon={Shield}
              title="Super Admin"
              subtitle="Approve users & manage platform"
              onClick={() => {}}
            />
          )}
        </div>

        {/* GOOGLE LOGIN */}
        <div className="mt-8 flex justify-center">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              if (!role) {
                alert("Please select a role first");
                return;
              }

              try {
                const res = await axios.post(
                  "http://localhost:5000/api/auth/google",
                  {
                    token: credentialResponse.credential,
                    role,
                  }
                );

                localStorage.setItem("token", res.data.token);
                const user = res.data.user;

                if (user.role === "superadmin")
                  router.push("/admin/dashboard");
                if (user.role === "school")
                  router.push("/school/dashboard");
                if (user.role === "teacher")
                  router.push("/teacher/dashboard");
              } catch (err: any) {
                if (err.response?.status === 403) {
                  alert(err.response.data.message);
                } else {
                  alert("Login failed");
                }
              }
            }}
            onError={() => alert("Google login failed")}
          />
        </div>

        {/* FOOTER INFO */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Secure Google sign-in · No passwords required
        </p>
      </motion.div>
    </div>
  );
}

/* ---------- ROLE CARD COMPONENT ---------- */

function RoleOption({
  icon: Icon,
  title,
  subtitle,
  active,
  onClick,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-xl border p-4 text-left transition
        ${
          active
            ? "border-slate-900 bg-slate-50"
            : "border-slate-200 hover:border-slate-400"
        }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg
            ${active ? "bg-slate-900" : "bg-slate-100"}`}
        >
          <Icon
            className={`h-5 w-5 ${
              active ? "text-white" : "text-slate-700"
            }`}
          />
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">
            {title}
          </p>
          <p className="text-xs text-slate-500">
            {subtitle}
          </p>
        </div>
      </div>
    </button>
  );
}
