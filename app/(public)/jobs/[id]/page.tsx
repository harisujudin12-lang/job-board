import { getSupabaseAdmin, Job } from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getJob(id: string): Promise<Job | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as Job;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function JobDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const job = await getJob(params.id);

  if (!job || job.status === "Nonaktif") {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <header className="border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Daftar Lowongan
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            <span className="text-violet-500">Job Board</span> Professional Development MTI
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <article>
          <span className="inline-block px-3 py-1 text-xs font-semibold bg-violet-500/20 text-violet-400 rounded-full mb-4">
            {job.kategori}
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            {job.nama_posisi}
          </h2>

          <p className="text-xl text-gray-300 font-semibold mb-6">
            {job.nama_perusahaan}
          </p>

          <div className="flex flex-wrap gap-6 mb-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {job.lokasi}
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Diposting: {formatDate(job.created_at)}
            </div>
            {job.tanggal_deadline && (
              <div className="flex items-center gap-2 text-amber-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Deadline: {formatDate(job.tanggal_deadline)}
              </div>
            )}
          </div>

          <div className="border-t border-white/10 my-8" />

          <section className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Deskripsi Pekerjaan</h3>
            <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {job.deskripsi}
            </div>
          </section>

          {job.persyaratan && (
            <section className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4">Persyaratan</h3>
              <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {job.persyaratan}
              </div>
            </section>
          )}

          <div className="border-t border-white/10 my-8" />

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <a
              href={job.link_lamaran}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-colors text-lg"
            >
              Lamar Sekarang
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
              Kembali ke Daftar
            </Link>
          </div>
        </article>
      </main>

      <footer className="border-t border-white/10 py-8 mt-16">
        <p className="text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Job Board Professional Development MTI. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
