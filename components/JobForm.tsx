"use client";

import { useState } from "react";
import Link from "next/link";
import { Job } from "@/lib/supabase";

type JobFormData = {
  nama_posisi: string;
  nama_perusahaan: string;
  lokasi: string;
  kategori: string;
  deskripsi: string;
  persyaratan: string;
  link_lamaran: string;
  tanggal_deadline: string;
  status: "Aktif" | "Nonaktif";
};

type Props = {
  initialData?: Job;
  mode: "create" | "edit";
};

export default function JobForm({ initialData, mode }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<JobFormData>({
    nama_posisi: initialData?.nama_posisi || "",
    nama_perusahaan: initialData?.nama_perusahaan || "",
    lokasi: initialData?.lokasi || "",
    kategori: initialData?.kategori || "",
    deskripsi: initialData?.deskripsi || "",
    persyaratan: initialData?.persyaratan || "",
    link_lamaran: initialData?.link_lamaran || "",
    tanggal_deadline: initialData?.tanggal_deadline || "",
    status: initialData?.status || "Aktif",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url = mode === "create" ? "/api/jobs" : `/api/jobs/${initialData?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const body = {
        ...form,
        tanggal_deadline: form.tanggal_deadline || null,
        persyaratan: form.persyaratan || null,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal menyimpan lowongan");
      }

      window.location.href = "/admin";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <header className="border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {mode === "create" ? "Tambah Lowongan Baru" : "Edit Lowongan"}
          </h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6"
        >
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="nama_posisi" className="block text-sm font-medium text-gray-300 mb-2">
              Nama Posisi <span className="text-red-400">*</span>
            </label>
            <input
              id="nama_posisi"
              name="nama_posisi"
              type="text"
              value={form.nama_posisi}
              onChange={handleChange}
              required
              placeholder="Contoh: Frontend Developer"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label htmlFor="nama_perusahaan" className="block text-sm font-medium text-gray-300 mb-2">
              Nama Perusahaan <span className="text-red-400">*</span>
            </label>
            <input
              id="nama_perusahaan"
              name="nama_perusahaan"
              type="text"
              value={form.nama_perusahaan}
              onChange={handleChange}
              required
              placeholder="Contoh: PT Teknologi Nusantara"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="lokasi" className="block text-sm font-medium text-gray-300 mb-2">
                Lokasi <span className="text-red-400">*</span>
              </label>
              <input
                id="lokasi"
                name="lokasi"
                type="text"
                value={form.lokasi}
                onChange={handleChange}
                required
                placeholder="Contoh: Remote / Jakarta / Hybrid"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label htmlFor="kategori" className="block text-sm font-medium text-gray-300 mb-2">
                Kategori <span className="text-red-400">*</span>
              </label>
              <input
                id="kategori"
                name="kategori"
                type="text"
                value={form.kategori}
                onChange={handleChange}
                required
                placeholder="Contoh: Engineering, Design, Marketing"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div>
            <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-300 mb-2">
              Deskripsi Pekerjaan <span className="text-red-400">*</span>
            </label>
            <textarea
              id="deskripsi"
              name="deskripsi"
              value={form.deskripsi}
              onChange={handleChange}
              required
              rows={8}
              placeholder="Jelaskan deskripsi pekerjaan secara detail..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition resize-y"
            />
          </div>

          <div>
            <label htmlFor="persyaratan" className="block text-sm font-medium text-gray-300 mb-2">
              Persyaratan
            </label>
            <textarea
              id="persyaratan"
              name="persyaratan"
              value={form.persyaratan}
              onChange={handleChange}
              rows={6}
              placeholder="Tuliskan persyaratan yang dibutuhkan..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition resize-y"
            />
          </div>

          <div>
            <label htmlFor="link_lamaran" className="block text-sm font-medium text-gray-300 mb-2">
              Link Lamaran Eksternal <span className="text-red-400">*</span>
            </label>
            <input
              id="link_lamaran"
              name="link_lamaran"
              type="url"
              value={form.link_lamaran}
              onChange={handleChange}
              required
              placeholder="https://careers.example.com/apply"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="tanggal_deadline" className="block text-sm font-medium text-gray-300 mb-2">
                Tanggal Deadline
              </label>
              <input
                id="tanggal_deadline"
                name="tanggal_deadline"
                type="date"
                value={form.tanggal_deadline}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition appearance-none cursor-pointer"
              >
                <option value="Aktif" className="bg-[#111]">Aktif</option>
                <option value="Nonaktif" className="bg-[#111]">Nonaktif</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors"
            >
              {loading
                ? "Menyimpan..."
                : mode === "create"
                ? "Tambah Lowongan"
                : "Simpan Perubahan"}
            </button>
            <Link
              href="/admin"
              className="px-6 py-3 text-gray-400 hover:text-white border border-white/10 rounded-xl transition-colors"
            >
              Batal
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
