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

  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const [editingJob, setEditingJob] = useState<any | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const authHeader = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  /* ---------------- FETCH ---------------- */
  const fetchJobs = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/jobs/school/me",
      authHeader
    );
    setJobs(res.data);
  };

  const fetchApplications = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/applications/school/me",
      authHeader
    );
    setApplications(res.data);
  };

  /* ---------------- POST ---------------- */
  const postJob = async () => {
    if (!title || !subject || !description) {
      alert("Please fill all fields");
      return;
    }

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
  };

  /* ---------------- UPDATE ---------------- */
  const updateJob = async () => {
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
  };

  /* ---------------- DELETE ---------------- */
  const deleteJob = async (jobId: string) => {
    if (!confirm("Delete this job?")) return;

    await axios.delete(
      `http://localhost:5000/api/jobs/${jobId}/delete`,
      authHeader
    );

    fetchJobs();
  };

  /* ---------------- SIGN OUT ---------------- */
  const signOut = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const jobApplications = applications.filter(
    (app) => app.jobId?._id === selectedJob?._id
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* TOP BAR */}
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
            className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-900 hover:bg-slate-100"
          >
            School
            <ChevronDown className="h-4 w-4 text-slate-900" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-10 w-40 rounded-lg border border-slate-200 bg-white shadow">
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

      {/* CONTENT */}
      <div className="px-10 py-8">
        {/* STATS */}
        <div className="mb-8 grid grid-cols-2 gap-6">
          <Stat label="Jobs Posted" value={jobs.length} icon={Briefcase} />
          <Stat label="Total Applications" value={applications.length} icon={FileText} />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* JOB LIST */}
          <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 text-base font-semibold text-slate-900">
              My Jobs
            </h2>

            <div className="space-y-3">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="flex items-start justify-between rounded-md border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {job.title}
                    </p>
                    <p className="text-sm text-slate-800">
                      {job.subject}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <IconButton onClick={() => setSelectedJob(job)}>
                      <Users className="h-4 w-4 text-slate-900" />
                    </IconButton>

                    <IconButton onClick={() => setEditingJob(job)}>
                      <Pencil className="h-4 w-4 text-slate-900" />
                    </IconButton>

                    <IconButton
                      onClick={() => deleteJob(job._id)}
                      danger
                    >
                      <Trash2 className="h-4 w-4 text-red-700" />
                    </IconButton>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* POST JOB */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-900">
              <PlusCircle className="h-5 w-5 text-slate-900" />
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
              className="mt-2 w-full rounded-md bg-slate-900 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Post Job
            </button>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editingJob && (
        <Modal title="Edit Job" onClose={() => setEditingJob(null)}>
          <Input
            value={editingJob.title}
            onChange={(v) => setEditingJob({ ...editingJob, title: v })}
            placeholder="Job title"
          />
          <Input
            value={editingJob.subject}
            onChange={(v) => setEditingJob({ ...editingJob, subject: v })}
            placeholder="Subject"
          />
          <Textarea
            value={editingJob.description}
            onChange={(v) =>
              setEditingJob({ ...editingJob, description: v })
            }
            placeholder="Description"
          />

          <button
            onClick={updateJob}
            className="mt-2 w-full rounded-md bg-slate-900 py-2 text-sm text-white"
          >
            Save Changes
          </button>
        </Modal>
      )}

      {/* VIEW APPLICANTS */}
      {selectedJob && (
        <Modal
          title={`Applicants for ${selectedJob.title}`}
          onClose={() => setSelectedJob(null)}
        >
          {jobApplications.length === 0 ? (
            <p className="text-sm text-slate-700">
              No applications yet
            </p>
          ) : (
            jobApplications.map((app) => (
              <div
                key={app._id}
                className="mb-3 rounded-md border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <p className="text-sm font-semibold text-slate-900">
                  {app.teacherId?.name || "Teacher"}
                </p>
                <p className="text-sm text-slate-700">
                  Status: {app.status}
                </p>
              </div>
            ))
          )}
        </Modal>
      )}
    </div>
  );
}

/* ---------------- UI HELPERS ---------------- */

function Stat({ label, value, icon: Icon }: any) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
          <Icon className="h-5 w-5 text-slate-900" />
        </div>
        <div>
          <p className="text-sm text-slate-700">{label}</p>
          <p className="text-2xl font-semibold text-slate-900">{value}</p>
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
      className={`rounded-md border px-2 py-1 hover:bg-slate-100 ${
        danger ? "border-red-300 hover:bg-red-50" : "border-slate-300"
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
      className="mb-3 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900"
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
      className="mb-3 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900"
    />
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900">
            {title}
          </h3>
          <button onClick={onClose}>
            <X className="h-4 w-4 text-slate-900" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
