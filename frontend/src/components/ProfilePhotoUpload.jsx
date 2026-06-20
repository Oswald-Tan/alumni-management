import { useState, useRef } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Camera, Upload, X, Check, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import ConfirmModal from "./ConfirmModal";

// Helper untuk set default crop
function centerAspectCrop(width, height, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 80,
      },
      aspect,
      width,
      height
    ),
    width,
    height
  );
}

export default function ProfilePhotoUpload({ currentFoto, onUploadSuccess, uploadService, deleteService, roleTheme = "teal" }) {
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const imgRef = useRef(null);
  const fileInputRef = useRef(null);

  const themeColors = {
    teal: {
      bg: "bg-teal-50",
      text: "text-teal-600",
      btn: "bg-teal-600 hover:bg-teal-700",
      border: "border-teal-500",
      accent: "teal",
    },
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      btn: "bg-blue-600 hover:bg-blue-700",
      border: "border-blue-500",
      accent: "blue",
    },
  };

  const currentTheme = themeColors[roleTheme] || themeColors.teal;

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Batasi ukuran file 3MB
      if (file.size > 3 * 1024 * 1024) {
        toast.error("Ukuran file terlalu besar. Maksimal 3MB.");
        e.target.value = "";
        return;
      }

      // Batasi format file gambar
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Format file tidak didukung. Gunakan JPG, JPEG, PNG, atau WEBP.");
        e.target.value = "";
        return;
      }

      setCrop(undefined); // Reset crop
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgSrc(reader.result?.toString() || "");
        setIsModalOpen(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1)); // Enforce 1:1 ratio
  };

  const handleUpload = async () => {
    if (!completedCrop || !imgRef.current) return;

    setIsUploading(true);
    try {
      const canvas = document.createElement("canvas");
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
      
      canvas.width = completedCrop.width;
      canvas.height = completedCrop.height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        imgRef.current,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width,
        completedCrop.height
      );

      // Convert canvas to blob
      canvas.toBlob(async (blob) => {
        if (!blob) {
          toast.error("Gagal memproses gambar");
          setIsUploading(false);
          return;
        }

        const formData = new FormData();
        formData.append("foto", blob, "profile.jpg");

        try {
          const res = await uploadService(formData);
          toast.success("Foto profil berhasil diperbarui!");
          if (onUploadSuccess) {
            onUploadSuccess(res.data.data.foto);
          }
          handleCloseModal();
        } catch (err) {
          console.error(err);
          toast.error(err.response?.data?.message || "Gagal mengunggah foto profil");
        } finally {
          setIsUploading(false);
        }
      }, "image/jpeg", 0.9);

    } catch (err) {
      console.error(err);
      toast.error("Gagal melakukan crop gambar");
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteService();
      toast.success("Foto profil berhasil dihapus!");
      if (onUploadSuccess) {
        onUploadSuccess(null);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Gagal menghapus foto profil");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setImgSrc("");
    setCompletedCrop(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar Container */}
      <div className="relative group">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-slate-100 flex items-center justify-center">
          {currentFoto ? (
            <img
              src={`http://localhost:5000/uploads/foto/${currentFoto}`}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <Camera size={40} className="text-slate-300" />
          )}
        </div>

        {/* Upload Overlay Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className={`absolute bottom-0 right-0 w-10 h-10 ${currentTheme.btn} text-white rounded-full flex items-center justify-center shadow-md border-2 border-white hover:scale-105 active:scale-95 transition-all cursor-pointer`}
          title="Upload Foto"
        >
          <Upload size={16} />
        </button>

        {/* Delete Overlay Button */}
        {currentFoto && (
          <button
            onClick={() => setIsConfirmOpen(true)}
            className="absolute bottom-0 left-0 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md border-2 border-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Hapus Foto"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={onSelectFile}
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
      />

      <span className="text-[11px] text-slate-400 text-center leading-relaxed">
        Format: JPG, JPEG, PNG, WEBP (Max 3MB)<br />Rasio aspek foto otomatis 1:1
      </span>

      {/* Modal Crop */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">Sesuaikan Foto Profil</h3>
              <button
                onClick={handleCloseModal}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-slate-50 min-h-[300px]">
              {imgSrc && (
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                  circularCrop
                >
                  <img
                    ref={imgRef}
                    alt="Crop me"
                    src={imgSrc}
                    onLoad={onImageLoad}
                    className="max-h-[50vh] max-w-full object-contain"
                  />
                </ReactCrop>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t bg-slate-50 flex items-center justify-end gap-3">
              <button
                onClick={handleCloseModal}
                disabled={isUploading}
                className="btn-secondary text-xs font-semibold py-2 px-4 rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleUpload}
                disabled={isUploading || !completedCrop}
                className={`inline-flex items-center gap-2 py-2 px-5 ${currentTheme.btn} disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer border-none`}
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="animate-spin" size={14} />
                    Mengunggah...
                  </>
                ) : (
                  <>
                    <Check size={14} />
                    Terapkan Foto
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Foto Profil"
        message="Apakah Anda yakin ingin menghapus foto profil ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus"
        roleTheme="red"
      />
    </div>
  );
}
