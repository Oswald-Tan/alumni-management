import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { getAlumniById, updateAlumni } from "../../services/alumniService";
import { getJurusan } from "../../services/jurusanService";
import { toast } from "react-toastify";

export default function AlumniEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jurusanList, setJurusanList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [form, setForm] = useState({
    nim: "",
    nama: "",
    jurusanId: "",
    tanggalKelulusan: "",
    tanggalWisuda: "",
    nomorIjazah: "",
    tanggalPengambilanIjazah: "",
    password: "", // Menambahkan kolom ganti password opsional
  });

  useEffect(() => {
    Promise.all([getAlumniById(id), getJurusan()])
      .then(([alumniRes, jurusanRes]) => {
        const a = alumniRes.data.data;
        setForm({
          nim: a.nim,
          nama: a.nama,
          jurusanId: a.jurusanId,
          tanggalKelulusan: a.tanggalKelulusan?.split("T")[0] || "",
          tanggalWisuda: a.tanggalWisuda?.split("T")[0] || "",
          nomorIjazah: a.nomorIjazah || "",
          tanggalPengambilanIjazah: a.tanggalPengambilanIjazah?.split("T")[0] || "",
          password: "",
        });
        setJurusanList(jurusanRes.data.data);
      })
      .catch(() => {
        toast.error("Gagal memuat data alumni");
        navigate("/admin/alumni");
      })
      .finally(() => setIsFetching(false));
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateAlumni(id, form);
      toast.success("Data alumni berhasil diupdate");
      navigate("/admin/alumni");
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal mengupdate alumni");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="p-8">
        <div className="animate-pulse card max-w-2xl h-64" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin/alumni" className="btn-secondary py-2 px-3">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="page-title">Edit Alumni</h1>
          <p className="page-subtitle">Update data alumni #{id}</p>
        </div>
      </div>

      <div className="card max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">
                NIM <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nim"
                value={form.nim}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="form-label">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nama"
                value={form.nama}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">
              Jurusan / Program Studi <span className="text-red-500">*</span>
            </label>
            <select
              name="jurusanId"
              value={form.jurusanId}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">-- Pilih Jurusan / Program Studi --</option>
              {jurusanList.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.namaJurusan} / {j.namaProdi} ({j.jenjang} - {j.akreditasi})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Tanggal Kelulusan</label>
              <input
                type="date"
                name="tanggalKelulusan"
                value={form.tanggalKelulusan}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Tanggal Wisuda</label>
              <input
                type="date"
                name="tanggalWisuda"
                value={form.tanggalWisuda}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Nomor Ijazah</label>
              <input
                type="text"
                name="nomorIjazah"
                value={form.nomorIjazah}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Tanggal Pengambilan Ijazah</label>
              <input
                type="date"
                name="tanggalPengambilanIjazah"
                value={form.tanggalPengambilanIjazah}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div>
            <label className="form-label">Ganti Password (Kosongkan jika tidak ingin diubah)</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Masukkan password baru"
              className="form-input"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={isLoading} className="btn-primary">
              <Save size={16} />
              {isLoading ? "Menyimpan..." : "Update Alumni"}
            </button>
            <Link to="/admin/alumni" className="btn-secondary">
              Batal
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
