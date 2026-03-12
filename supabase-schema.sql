-- =============================================
-- Schema Database: Job Board (Mading Lowongan Kerja)
-- Jalankan SQL ini di Supabase SQL Editor
-- =============================================

CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_posisi TEXT NOT NULL,
  nama_perusahaan TEXT NOT NULL,
  lokasi TEXT NOT NULL,
  kategori TEXT NOT NULL,
  deskripsi TEXT NOT NULL,
  persyaratan TEXT,
  link_lamaran TEXT NOT NULL,
  tanggal_deadline DATE,
  status TEXT NOT NULL DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Nonaktif')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger untuk auto-update kolom updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Enable Row Level Security (opsional, bisa diatur sesuai kebutuhan)
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Policy: semua orang bisa membaca job yang aktif
CREATE POLICY "Public can read active jobs"
  ON jobs FOR SELECT
  USING (status = 'Aktif');

-- Policy: service role bisa melakukan semua operasi
CREATE POLICY "Service role full access"
  ON jobs FOR ALL
  USING (true)
  WITH CHECK (true);
