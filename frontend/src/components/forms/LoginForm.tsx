"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { motion } from "framer-motion";

// 1. IMPORT FUNGSI YANG BENAR DARI TEMPLATE KAMU
import { redirectToGoogleLogin } from "@/lib/auth"; 
import apiClient from "@/lib/api-client"; // Untuk nembak API email/password

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;

    setLoading(true);

    try {
      // 2. TEMBAK API LOGIN KE BACKEND (Sesuaikan endpoint "/auth/login" jika di backend beda)
      const response = await apiClient.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      // Simpan token ke localStorage (mengikuti pola template kamu)
      if (response.data?.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
        if (response.data.refresh_token) {
          localStorage.setItem("refresh_token", response.data.refresh_token);
        }
      }

      router.push("/dashboard");
    } catch (error: any) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Gagal Masuk",
        text: error?.response?.data?.detail || error.message || "Pastikan email dan passwordnya sudah benar ya.",
        background: "#1e293b",
        color: "#e2e8f0",
        confirmButtonColor: "#6366f1",
      });
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4 animate-[fadeUp_0.35s_ease_both]">
      <motion.div className="mb-2">
        <h2 className="text-xl font-jakarta text-slate-800 dark:text-slate-100">Selamat Datang Kembali</h2>
        <p className="text-sm font-jakarta text-slate-500 mt-1">Masuk untuk melanjutkan ke dashboard Anda.</p>
      </motion.div>

      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="email@mahasiswa.ac.id"
        required
        icon={<i className="fa-solid fa-envelope"></i>}
      />

      <Input
        label="Password"
        type={showPassword ? "text" : "password"}
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Masukkan password"
        required
        icon={<i className="fa-solid fa-lock"></i>}
        labelRight={<a href="#" className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">Lupa password?</a>}
        rightElement={
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-none">
            <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
          </button>
        }
      />

      <Button type="submit" loading={loading} loadingText="Memverifikasi..." className="mt-2">
        Masuk ke Dashboard
      </Button>

      <motion.div className="flex items-center gap-3 my-2">
        <motion.div className="flex-1 h-px bg-black/10 dark:bg-white/10"></motion.div>
        <span className="text-xs font-jakarta text-slate-500">atau lanjutkan dengan</span>
        <motion.div className="flex-1 h-px bg-black/10 dark:bg-white/10"></motion.div>
      </motion.div>

      <button
        type="button"
        // 3. PANGGIL FUNGSI GOOGLE DARI TEMPLATE
        onClick={() => redirectToGoogleLogin()} 
        className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-slate-700 dark:text-slate-300 text-sm font-medium py-3 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex justify-center items-center gap-1.5"
      >
        <Image src="/google.svg" alt="Google Icon" width={18} height={18} />
        <b className="text-sm font-jakarta">Google</b>
      </button>
    </form>
  );
}