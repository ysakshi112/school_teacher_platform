"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  FileText,
  Wallet,
  Search,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function TeacherDashboard() {
  const router = useRouter();

  const [jobs, setJobs] = useState<any[]>([]);
  const [credits, setCredits] = useState(0);
  const [applications, setApplications] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  /* ------------------ AUTH HEADER ------------------ */
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const authHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  /* ------------------ LOAD RAZORPAY ------------------ */
  const loadRazorpay = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      document.body.appendChild(script);
    });

  /* ------------------ FETCH DATA ------------------ */
  const fetchJobs = async () => {
    const { data } = await axios.get(
      "http://localhost:5000/api/jobs/all",
      authHeader
    );
    setJobs(data);
  };

  const fetchCredits = async () => {
    const { data } = await axios.get(
      "http://localhost:5000/api/users/me",
      authHeader
    );
    setCredits(data.credits || 0);
  };

  const fetchApplications = async () => {
    const { data } = await axios.get(
      "http://localhost:5000/api/applications/teacher/applications",
      authHeader
    );
    setApplications(data);
  };

  useEffect(() => {
    fetchJobs();
    fetchApplications();
    fetchCredits();
  }, []);

  /* ------------------ APPLY JOB ------------------ */
  const applyJob = async (jobId: string) => {
    try {
      await axios.post(
        "http://localhost:5000/api/applications/apply",
        { jobId },
        authHeader
      );
      alert("Applied successfully");
      fetchApplications();
      fetchCredits();
    } catch (err: any) {
      alert(err.response?.data?.message || "Apply failed");
    }
  };

  /* ------------------ BUY CREDITS ------------------ */
  const buyCredits = async () => {
    await loadRazorpay();

    const { data } = await axios.post(
      "http://localhost:5000/api/payments/create-order",
      { credits: 5 },
      authHeader
    );

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: "INR",
      order_id: data.id,
      name: "School–Teacher Platform",
      handler: async function (response: any) {
        await axios.post(
          "http://localhost:5000/api/payments/verify",
          {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            credits: 5,
          },
          authHeader
        );
        alert("Credits added");
        fetchCredits();
      },
    };

    new window.Razorpay(options).open();
  };

  /* ------------------ SIGN OUT ------------------ */
  const signOut = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  /* ------------------ FILTER JOBS ------------------ */
  const filteredJobs = jobs.filter((job) =>
    `${job.title} ${job.subject} ${job.description}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  /* ------------------ UI ------------------ */
  return (
    <div className="min-h-screen bg-slate-50">
      {/* TOP BAR */}
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white px-10 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-slate-900">
          Teacher Dashboard
        </h1>

        <div className="relative flex items-center gap-3">
          {/* CREDITS (CLICK TO TOP-UP) */}
          <button
            onClick={buyCredits}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm hover:bg-slate-100"
          >
            <Wallet className="h-4 w-4 text-slate-700" />
            <span className="font-semibold text-slate-900">
              {credits}
            </span>
          </button>

          {/* PROFILE */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 hover:bg-slate-100"
          >
            Teacher
            <ChevronDown className="h-4 w-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-10 w-44 rounded-xl border border-slate-200 bg-white shadow-md">
              <button
                onClick={buyCredits}
                className="w-full px-4 py-2 text-blue-500 text-left text-sm hover:bg-slate-50"
              >
                Buy credits
              </button>

              <button
                onClick={signOut}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-slate-50"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-10 py-6">
        {/* SEARCH */}
        <div className="mb-4 max-w-md relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs"
            className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* JOB LIST */}
          <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white divide-y">
            {filteredJobs.length === 0 ? (
              <p className="p-4 text-sm text-slate-500">
                No jobs found
              </p>
            ) : (
              filteredJobs.map((job) => (
                <motion.div
                  key={job._id}
                  whileHover={{ backgroundColor: "#f8fafc" }}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {job.title}
                    </p>
                    <p className="text-xs text-indigo-600">
                      {job.subject}
                    </p>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {job.description}
                    </p>
                  </div>

                  <button
                    onClick={() => applyJob(job._id)}
                    className="rounded-md bg-slate-900 px-3 py-1.5 text-xs text-white hover:bg-slate-800"
                  >
                    Apply
                  </button>
                </motion.div>
              ))
            )}
          </div>

          {/* APPLICATIONS */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
              <FileText className="h-4 w-4" />
              My Applications
            </h2>

            {applications.length === 0 ? (
              <p className="text-xs text-slate-500">
                No applications yet
              </p>
            ) : (
              <div className="space-y-2">
                {applications.map((app) => (
                  <div
                    key={app._id}
                    className="rounded-md bg-slate-50 px-3 py-2"
                  >
                    <p className="text-xs font-medium text-slate-900">
                      {app.jobId?.title}
                    </p>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {app.jobId?.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
