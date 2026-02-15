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

  /* ---------------- LOAD TOKEN SAFELY ---------------- */
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      router.push("/login");
      return;
    }

    setToken(storedToken);
  }, []);

  /* ---------------- FETCH AFTER TOKEN ---------------- */
  useEffect(() => {
    if (token) {
      fetchJobs();
      fetchApplications();
    }
  }, [token]);

  const getAuthHeader = () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  /* ---------------- FETCH ---------------- */
  const fetchJobs = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/jobs/school/me",
        getAuthHeader()
      );
      setJobs(res.data);
    } catch (err) {
      console.error("Fetch jobs error:", err);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/applications/school/me",
        getAuthHeader()
      );
      setApplications(res.data);
    } catch (err) {
      console.error("Fetch applications error:", err);
    }
  };

  /* ---------------- POST ---------------- */
  const postJob = async () => {
    if (!title || !subject || !description) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/jobs/create",
        { title, subject, description },
        getAuthHeader()
      );

      setTitle("");
      setSubject("");
      setDescription("");
      fetchJobs();
      alert("Job posted successfully");
    } catch (err) {
      console.error("Post job error:", err);
    }
  };

  /* ---------------- UPDATE ---------------- */
  const updateJob = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/jobs/${editingJob._id}/update`,
        {
          title: editingJob.title,
          subject: editingJob.subject,
          description: editingJob.description,
        },
        getAuthHeader()
      );

      setEditingJob(null);
      fetchJobs();
    } catch (err) {
      console.error("Update job error:", err);
    }
  };

  /* ---------------- DELETE ---------------- */
  const deleteJob = async (jobId: string) => {
    if (!confirm("Delete this job?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/jobs/${jobId}/delete`,
        getAuthHeader()
      );

      fetchJobs();
    } catch (err) {
      console.error("Delete job error:", err);
    }
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
      {/* SAME UI BELOW — unchanged */}
      {/* (Your existing JSX stays exactly same from here onward) */}
