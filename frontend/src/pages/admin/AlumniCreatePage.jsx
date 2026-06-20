import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { createAlumni } from "../../services/alumniService";
import { getJurusan } from "../../services/jurusanService";
import { toast } from "react-toastify";

export default function AlumniCreatePage() {
  const navigate = useNavigate();
  const [jurusanList, setJurusanList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    nim: "",
    nama: "",
    jurusanId: "",
    tanggalKelulusan: "",
    tanggalWisuda: "",
    nomorIjazah: "",
    tanggalPengambilanIjazah: "",
  });

  useEffect(() => {
    getJurusan().then((res) => setJurusanList(res.data.data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await createAlumni(form);
      toast.success("Alumni berhasil ditambahkan");
      navigate("/admin/alumni");
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menambahkan alumni");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin/alumni" className="btn-secondary py-2 px-3">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="page-title">Tambah Alumni</h1>
          <p className="page-subtitle">Input data alumni baru untuk arsip</p>
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
                placeholder="Contoh: 2020714001"
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
                placeholder="Contoh: Ahmad Fauzan"
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
                placeholder="Contoh: I-1029302"
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

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={isLoading} className="btn-primary">
              <Save size={16} />
              {isLoading ? "Menyimpan..." : "Simpan Alumni"}
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
