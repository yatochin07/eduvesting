"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { motion } from "framer-motion";

// IMPORT FUNGSI YANG BENAR DARI TEMPLATE
import { redirectToGoogleLogin } from "@/lib/auth";
import apiClient from "@/lib/api-client"; 

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    university: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isValidEmailData = (email: string) => {
    const disposableDomains = ['mailinator.com', '10minutemail.com', 'tempmail.com', 'yopmail.com'];
    const domain = email.split('@')[1]?.toLowerCase() || "";
    if (disposableDomains.includes(domain)) {
      return { valid: false, msg: "Email sementara (temp mail) tidak bisa dipakai. Gunakan email kampus/pribadimu ya!" };
    }
    return { valid: true, msg: "" };
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) return;

    const emailCheck = isValidEmailData(formData.email);
    if (!emailCheck.valid) {
      Swal.fire({ icon: "warning", title: "Email Ditolak", text: emailCheck.msg, background: "#1e293b", color: "#e2e8f0" });
      return;
    }

    setLoading(true);

    try {
      // TEMBAK API REGISTER KE BACKEND (Sesuaikan endpoint "/auth/register" jika di backend beda)
      await apiClient.post("/auth/register", {
        full_name: formData.fullName,
        email: formData.email,
        university: formData.university,
        password: formData.password,
      });

      setLoading(false);
      
      Swal.fire({
        icon: "success",
        title: "Pendaftaran Berhasil!",
        text: "Akun Anda telah dibuat. Silakan cek email jika diperlukan konfirmasi, atau langsung login.",
        background: "#1e293b", color: "#e2e8f0", confirmButtonColor: "#10b981"
      });
      
      setFormData({ fullName: "", email: "", university: "", password: "" });
      setTermsAccepted(false);

    } catch (error: any) {
      setLoading(false);
      Swal.fire({
        icon: "error", 
        title: "Gagal Mendaftar", 
        text: error?.response?.data?.detail || error.message || "Terjadi kesalahan saat mendaftar.", 
        background: "#1e293b", 
        color: "#e2e8f0"
      });
    }
  };

  return (
    <form onSubmit={handleRegister} className="flex flex-col gap-4 animate-[fadeUp_0.35s_ease_both]">
      <div className="mb-2">
        <h2 className="text-xl font-jakarta text-slate-800 dark:text-slate-100">Buat Akun Baru</h2>
        <p className="text-sm font-jakarta text-slate-500 mt-1">Gratis untuk semua mahasiswa dan pemula.</p>
      </div>

      <Input
        label="Nama Lengkap"
        type="text"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        placeholder="Arief Rahardian"
        required
        icon={<i className="fa-solid fa-user"></i>}
      />

      <Input
        label="Email Kampus / Pribadi"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="email@mahasiswa.ac.id"
        required
        icon={<i className="fa-solid fa-envelope"></i>}
      />

      <Input
        label="Universitas (Opsional)"
        type="text"
        name="university"
        value={formData.university}
        onChange={handleChange}
        placeholder="Universitas Indonesia"
        icon={<i className="fa-solid fa-building-columns"></i>}
      />

      <Input
        label="Buat Password"
        type={showPassword ? "text" : "password"}
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Minimal 8 karakter"
        required
        minLength={8}
        icon={<i className="fa-solid fa-lock"></i>}
        rightElement={
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-none">
            <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
          </button>
        }
      />

      <div className="flex items-start gap-2 mt-2">
        <input 
          type="checkbox" 
          id="terms" 
          checked={termsAccepted} 
          onChange={(e) => setTermsAccepted(e.target.checked)}
          className="mt-0.5 accent-indigo-500 rounded cursor-pointer"
        />
        <label htmlFor="terms" className="text-xs font-jakarta text-slate-500 dark:text-slate-400 leading-relaxed cursor-pointer select-none">
          Saya menyetujui <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">Syarat & Ketentuan</a> dan memahami ini adalah platform simulasi.
        </label>
      </div>

      <Button type="submit" loading={loading} loadingText="Mendaftarkan..." disabled={!termsAccepted} className="mt-2">
        Buat Akun Gratis
      </Button>

      <motion.div className="flex items-center gap-3 my-2">
        <motion.div className="flex-1 h-px bg-black/10 dark:bg-white/10"></motion.div>
        <span className="text-xs font-jakarta text-slate-500">atau mendaftar dengan</span>
        <motion.div className="flex-1 h-px bg-black/10 dark:bg-white/10"></motion.div>
      </motion.div>

      <button
        type="button"
        // PANGGIL FUNGSI GOOGLE DARI TEMPLATE
        onClick={() => redirectToGoogleLogin()} 
        className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-slate-700 dark:text-slate-300 text-sm font-medium py-3 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex justify-center items-center gap-1.5"
      >
        <Image src="/google.svg" alt="Google Icon" width={18} height={18} />
        <b className="text-sm font-jakarta">Google</b>
      </button>
    </form>
  );
}