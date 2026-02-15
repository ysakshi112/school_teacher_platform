"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import {
  Briefcase,
  FileText,
  PlusCircle,
  LogOut,
  ChevronDown,
  Pencil,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function SchoolDashboard() {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const [editingJob, setEditingJob] = useState<any | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  /* LOAD TOKEN SAFELY */
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      router.push("/login");
      return;
    }

    setToken(storedToken);
  }, []);

  /* FETCH AFTER TOKEN */
  useEffect(() => {
    if (token) {
      fetchJobs();
      fetchApplications();
    }
  }, [token]);

  const authHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchJobs = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/jobs/school/me",
        authHeader
      );
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/applications/school/me",
        authHeader
      );
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const postJob = async () => {
    if (!title || !subject || !description) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/jobs/create",
        { title, subject, description },
        authHeader
      );

      setTitle("");
      setSubject("");
      setDescription("");
      fetchJobs();
      alert("Job posted successfully");
    } catch (err) {
      console.error(err);
    }
  };

  const updateJob = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/jobs/${editingJob._id}/update`,
        {
          title: editingJob.title,
          subject: editingJob.subject,
          description: editingJob.description,
        },
        authHeader
      );

      setEditingJob(null);
      fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteJob = async (jobId: string) => {
    if (!confirm("Delete this job?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/jobs/${jobId}/delete`,
        authHeader
      );

      fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  const signOut = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const jobApplications = applications.filter(
    (app) => app.jobId?._id === selectedJob?._id
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex items-center justify-between border-b bg-white px-10 py-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            School Dashboard
          </h1>
          <p className="text-sm text-slate-700">
            Manage jobs and applications
          </p>
        </div>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm"
          >
            School
            <ChevronDown className="h-4 w-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-10 w-40 rounded-lg border bg-white shadow">
              <button
                onClick={signOut}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-700 hover:bg-slate-100"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="px-10 py-8">
        <div className="mb-8 grid grid-cols-2 gap-6">
          <Stat label="Jobs Posted" value={jobs.length} icon={Briefcase} />
          <Stat
            label="Total Applications"
            value={applications.length}
            icon={FileText}
          />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-xl border bg-white p-6">
            <h2 className="mb-4 text-base font-semibold">
              My Jobs
            </h2>

            <div className="space-y-3">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="flex items-start justify-between rounded-md border bg-slate-50 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold">
                      {job.title}
                    </p>
                    <p className="text-sm">
                      {job.subject}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <IconButton onClick={() => setSelectedJob(job)}>
                      <Users className="h-4 w-4" />
                    </IconButton>

                    <IconButton onClick={() => setEditingJob(job)}>
                      <Pencil className="h-4 w-4" />
                    </IconButton>

                    <IconButton
                      onClick={() => deleteJob(job._id)}
                      danger
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </IconButton>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <h2 className="mb-4 flex items-center gap-2 text-base font-semibold">
              <PlusCircle className="h-5 w-5" />
              Post Job
            </h2>

            <Input value={title} onChange={setTitle} placeholder="Job title" />
            <Input value={subject} onChange={setSubject} placeholder="Subject" />
            <Textarea
              value={description}
              onChange={setDescription}
              placeholder="Description"
            />

            <button
              onClick={postJob}
              className="mt-2 w-full rounded-md bg-slate-900 py-2 text-sm text-white"
            >
              Post Job
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- HELPERS ---------------- */

function Stat({ label, value, icon: Icon }: any) {
  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="flex items-center gap-4">
        <Icon className="h-5 w-5" />
        <div>
          <p className="text-sm">{label}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
}

function IconButton({
  children,
  onClick,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md border px-2 py-1 ${
        danger ? "border-red-300" : "border-slate-300"
      }`}
    >
      {children}
    </button>
  );
}

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="mb-3 w-full rounded-md border px-3 py-2 text-sm"
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      className="mb-3 w-full rounded-md border px-3 py-2 text-sm"
    />
  );
}
