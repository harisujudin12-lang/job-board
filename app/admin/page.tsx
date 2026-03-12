"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Job } from "@/lib/supabase";

export default function AdminDashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    setLoading(true);
    const res = await fetch("/api/jobs");
    const data = await res.json();
    setJobs(data);
    setLoading(false);
  }

  async function handleDelete(id: string, namaPosisi: string) {
    if (!confirm(`Yakin ingin menghapus lowongan "${namaPosisi}"?`)) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
      if (res.ok) {
        setJobs((prev) => prev.filter((j) => j.id !== id));
      }
    } finally {
      setDeleting(null);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              <span className="text-violet-500">Admin</span> Dashboard
            </h1>
            <p className="mt-1 text-gray-500 text-sm">
              Kelola semua lowongan kerja
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-white/10 rounded-lg transition-colors"
            >
              Lihat Situs
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-red-400 hover:text-red-300 border border-red-500/30 rounded-lg transition-colors"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">
            Daftar Lowongan ({jobs.length})
          </h2>
          <Link
            href="/admin/jobs/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Tambah Lowongan
          </Link>
        </div>

        {/* Table */}
        {loading ? (
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-white/5 rounded-lg" />
              ))}
            </div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-16 text-center">
            <svg
              className="mx-auto w-12 h-12 text-gray-600 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p className="text-gray-400 mb-4">Belum ada lowongan</p>
            <Link
              href="/admin/jobs/new"
              className="text-violet-400 hover:text-violet-300 font-semibold transition-colors"
            >
              + Tambah lowongan pertama
            </Link>
          </div>
        ) : (
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Posisi
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Perusahaan
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Lokasi
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {jobs.map((job) => (
                    <tr
                      key={job.id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white font-semibold">
                            {job.nama_posisi}
                          </p>
                          <span className="text-xs text-violet-400">
                            {job.kategori}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {job.nama_perusahaan}
                      </td>
                      <td className="px-6 py-4 text-gray-400">{job.lokasi}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${
                            job.status === "Aktif"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {formatDate(job.created_at)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/jobs/${job.id}/edit`}
                            className="px-3 py-1.5 text-xs font-medium text-violet-400 hover:text-violet-300 border border-violet-500/30 rounded-lg transition-colors"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() =>
                              handleDelete(job.id, job.nama_posisi)
                            }
                            disabled={deleting === job.id}
                            className="px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 border border-red-500/30 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {deleting === job.id ? "..." : "Hapus"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-white/10">
              {jobs.map((job) => (
                <div key={job.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-white font-semibold">
                        {job.nama_posisi}
                      </p>
                      <p className="text-sm text-gray-400">
                        {job.nama_perusahaan}
                      </p>
                    </div>
                    <span
                      className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${
                        job.status === "Aktif"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{job.lokasi}</span>
                    <span>{job.kategori}</span>
                    <span>{formatDate(job.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/jobs/${job.id}/edit`}
                      className="px-3 py-1.5 text-xs font-medium text-violet-400 border border-violet-500/30 rounded-lg"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(job.id, job.nama_posisi)}
                      disabled={deleting === job.id}
                      className="px-3 py-1.5 text-xs font-medium text-red-400 border border-red-500/30 rounded-lg disabled:opacity-50"
                    >
                      {deleting === job.id ? "..." : "Hapus"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
