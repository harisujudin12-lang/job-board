"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Job } from "@/lib/supabase";

export default function HomePage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("");
  const [allKategori, setAllKategori] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, [search, kategori]);

  async function fetchJobs() {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (kategori) params.set("kategori", kategori);

    const res = await fetch(`/api/jobs?${params.toString()}`);
    const data: Job[] = await res.json();
    setJobs(data);

    // Kumpulkan semua kategori unik
    if (!kategori && !search) {
      const cats = Array.from(new Set(data.map((j) => j.kategori))).filter(Boolean);
      setAllKategori(cats);
    }
    setLoading(false);
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                <span className="text-violet-500">Mading</span> Lowongan Kerja
              </h1>
              <p className="mt-1 text-gray-400 text-sm">
                Temukan peluang karir terbaik untuk masa depanmu
              </p>
            </div>
            <Link
              href="/admin/login"
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Search & Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Cari posisi, perusahaan, atau lokasi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
            />
          </div>
          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition appearance-none cursor-pointer"
          >
            <option value="" className="bg-[#111]">
              Semua Kategori
            </option>
            {allKategori.map((k) => (
              <option key={k} value={k} className="bg-[#111]">
                {k}
              </option>
            ))}
          </select>
        </div>

        {/* Results count */}
        {!loading && (
          <p className="mt-4 text-sm text-gray-500">
            Menampilkan {jobs.length} lowongan
            {search && ` untuk "${search}"`}
            {kategori && ` di kategori "${kategori}"`}
          </p>
        )}
      </div>

      {/* Job Cards Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse"
              >
                <div className="h-6 bg-white/10 rounded w-3/4 mb-4" />
                <div className="h-4 bg-white/10 rounded w-1/2 mb-3" />
                <div className="h-4 bg-white/10 rounded w-2/3 mb-3" />
                <div className="h-4 bg-white/10 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20">
            <svg
              className="mx-auto w-16 h-16 text-gray-600 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 13.255A23.193 23.193 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              Tidak ada lowongan ditemukan
            </h3>
            <p className="text-gray-500">
              Coba ubah kata kunci atau filter pencarian
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`}>
                <div className="group bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:bg-white/[0.06] hover:border-violet-500/50 transition-all duration-300 cursor-pointer h-full flex flex-col">
                  {/* Kategori Badge */}
                  <span className="inline-block self-start px-3 py-1 text-xs font-semibold bg-violet-500/20 text-violet-400 rounded-full mb-4">
                    {job.kategori}
                  </span>

                  {/* Posisi */}
                  <h2 className="text-xl font-bold text-white mb-2 group-hover:text-violet-400 transition-colors">
                    {job.nama_posisi}
                  </h2>

                  {/* Perusahaan */}
                  <p className="text-gray-400 font-medium mb-3">
                    {job.nama_perusahaan}
                  </p>

                  {/* Info */}
                  <div className="mt-auto space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
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
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {job.lokasi}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
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
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {formatDate(job.created_at)}
                    </div>
                    {job.tanggal_deadline && (
                      <div className="flex items-center gap-2 text-sm text-amber-500">
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
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Deadline: {formatDate(job.tanggal_deadline)}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <p className="text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Mading Lowongan Kerja. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
