import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../data/useAuth";
import api from "../data/api";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";

// ─── Icons ────────────────────────────────────────────────────────────────────

const UserIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const EyeIcon = ({ off }: { off?: boolean }) =>
  off ? (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

// const GoogleIcon = () => (
//   <svg className="w-5 h-5" viewBox="0 0 24 24">
//     <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
//     <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
//     <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
//     <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
//   </svg>
// );

// ─── Illustration ─────────────────────────────────────────────────────────────

const LibraryIllustration = () => (
  <div className="relative flex overflow-hidden font-sans">
    <img
      src='login2.svg'
      className="relative w-xl z-10"
    />
  </div>
  // <svg viewBox="0 0 480 340" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-2xl">
  //   {/* Bookshelf */}
  //   <rect x="260" y="60" width="170" height="230" rx="6" fill="#e2e0f0" />
  //   <rect x="270" y="70" width="30" height="80" rx="3" fill="#c4b5fd" />
  //   <rect x="305" y="70" width="22" height="80" rx="3" fill="#ddd6fe" />
  //   <rect x="332" y="70" width="28" height="80" rx="3" fill="#c4b5fd" />
  //   <rect x="365" y="70" width="20" height="80" rx="3" fill="#a78bfa" />
  //   <rect x="270" y="165" width="25" height="70" rx="3" fill="#ddd6fe" />
  //   <rect x="300" y="165" width="30" height="70" rx="3" fill="#c4b5fd" />
  //   <rect x="335" y="165" width="20" height="70" rx="3" fill="#a78bfa" />
  //   <rect x="360" y="165" width="25" height="70" rx="3" fill="#ddd6fe" />
  //   {/* Shelf lines */}
  //   <rect x="265" y="155" width="160" height="6" rx="3" fill="#c4b5fd" />
  //   <rect x="265" y="240" width="160" height="6" rx="3" fill="#c4b5fd" />
  //   {/* Small plant on shelf */}
  //   <circle cx="418" cy="148" r="10" fill="#86efac" />
  //   <rect x="415" y="152" width="6" height="8" rx="2" fill="#6ee7b7" />

  //   {/* Stack of books on floor */}
  //   <rect x="140" y="240" width="90" height="22" rx="4" fill="#fbbf24" />
  //   <rect x="148" y="220" width="80" height="22" rx="4" fill="#7c3aed" />
  //   <rect x="144" y="200" width="84" height="22" rx="4" fill="#6d28d9" />

  //   {/* Plant pot */}
  //   <ellipse cx="80" cy="290" rx="28" ry="10" fill="#c4b5fd" />
  //   <rect x="65" y="258" width="30" height="35" rx="4" fill="#ddd6fe" />
  //   {/* Plant leaves */}
  //   <ellipse cx="80" cy="245" rx="10" ry="20" fill="#86efac" transform="rotate(-20 80 245)" />
  //   <ellipse cx="80" cy="245" rx="10" ry="20" fill="#6ee7b7" transform="rotate(20 80 245)" />
  //   <ellipse cx="80" cy="248" rx="7" ry="16" fill="#a7f3d0" />

  //   {/* Small plant right */}
  //   <ellipse cx="460" cy="292" rx="18" ry="7" fill="#c4b5fd" />
  //   <rect x="452" y="272" width="16" height="22" rx="3" fill="#ddd6fe" />
  //   <ellipse cx="460" cy="265" rx="7" ry="13" fill="#86efac" transform="rotate(-15 460 265)" />
  //   <ellipse cx="460" cy="265" rx="7" ry="13" fill="#6ee7b7" transform="rotate(15 460 265)" />

  //   {/* Laptop body */}
  //   <rect x="145" y="185" width="230" height="145" rx="8" fill="#1e1b4b" />
  //   <rect x="152" y="192" width="216" height="130" rx="5" fill="#312e81" />
  //   {/* Laptop screen content */}
  //   <rect x="158" y="198" width="204" height="118" rx="4" fill="#f5f3ff" />
  //   {/* Sidebar */}
  //   <rect x="158" y="198" width="42" height="118" rx="4" fill="#ede9fe" />
  //   <rect x="164" y="208" width="30" height="6" rx="2" fill="#c4b5fd" />
  //   <rect x="164" y="220" width="26" height="4" rx="2" fill="#ddd6fe" />
  //   <rect x="164" y="230" width="26" height="4" rx="2" fill="#ddd6fe" />
  //   <rect x="164" y="240" width="26" height="4" rx="2" fill="#ddd6fe" />
  //   <rect x="164" y="250" width="26" height="4" rx="2" fill="#c4b5fd" />
  //   {/* Content area */}
  //   <rect x="208" y="204" width="148" height="14" rx="3" fill="#7c3aed" opacity="0.15" />
  //   <rect x="208" y="224" width="42" height="24" rx="3" fill="#a78bfa" opacity="0.5" />
  //   <rect x="256" y="224" width="42" height="24" rx="3" fill="#fcd34d" opacity="0.5" />
  //   <rect x="304" y="224" width="42" height="24" rx="3" fill="#86efac" opacity="0.5" />
  //   <rect x="208" y="256" width="140" height="5" rx="2" fill="#ddd6fe" />
  //   <rect x="208" y="266" width="140" height="5" rx="2" fill="#ddd6fe" />
  //   <rect x="208" y="276" width="100" height="5" rx="2" fill="#ddd6fe" />
  //   {/* Bar chart */}
  //   <rect x="208" y="296" width="12" height="16" rx="2" fill="#a78bfa" />
  //   <rect x="224" y="288" width="12" height="24" rx="2" fill="#7c3aed" />
  //   <rect x="240" y="292" width="12" height="20" rx="2" fill="#a78bfa" />
  //   <rect x="256" y="284" width="12" height="28" rx="2" fill="#7c3aed" />
  //   <rect x="272" y="294" width="12" height="18" rx="2" fill="#a78bfa" />
  //   {/* Laptop base */}
  //   <rect x="118" y="328" width="284" height="12" rx="6" fill="#312e81" />
  //   <rect x="195" y="330" width="130" height="6" rx="3" fill="#1e1b4b" />
  // </svg>
);

// ─── Logo ─────────────────────────────────────────────────────────────────────

const UniLibraryLogo = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24">
    {/* Outer blue triangle (pointing up) */}
    <polygon points="40,4 74,64 6,64" fill="none" stroke="#3b82f6" strokeWidth="4" />
    {/* Green triangle (pointing down) */}
    <polygon points="40,76 6,16 74,16" fill="none" stroke="#22c55e" strokeWidth="4" />
    {/* Inner red hexagon */}
    <polygon points="40,22 52,29 52,43 40,50 28,43 28,29" fill="#ef4444" opacity="0.9" />
    {/* Book icon inside */}
    <rect x="33" y="30" width="14" height="16" rx="1.5" fill="white" />
    <line x1="40" y1="30" x2="40" y2="46" stroke="#ef4444" strokeWidth="1.5" />
    <line x1="33" y1="34" x2="39" y2="34" stroke="#fca5a5" strokeWidth="1" />
    <line x1="33" y1="37" x2="39" y2="37" stroke="#fca5a5" strokeWidth="1" />
    <line x1="33" y1="40" x2="39" y2="40" stroke="#fca5a5" strokeWidth="1" />
  </svg>
);

// ─── Login Form Types ─────────────────────────────────────────────────────────

interface LoginFormState {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
}

function validateForm(form: LoginFormState): LoginFormErrors {
  const errors: LoginFormErrors = {};
  if (!form.email) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!form.password) {
    errors.password = "Password is required.";
  } else if (form.password.length < 4) {
    errors.password = "Password must be at least 6 characters.";
  }
  return errors;
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Login() {
  const [form, setForm] = useState<LoginFormState>({
    email: "",
    password: "",
    rememberMe: true,
  });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error on change
    if (errors[name as keyof LoginFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errs = validateForm(form);

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);

    try {

      setLoading(true);

      const response = await api.post("/api/login/", {
        email: form.email,
        password: form.password,
      });

      login(response.data.access);

      navigate("/", { replace: true });

    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("Status:", err.response?.status);
        console.error("Response:", err.response?.data);
      }

      alert("Login failed");
    }
  };

  return (
    <div className="h-screen flex font-sans ">

      {/* Background Blur */}
      {/* <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-violet-300/30 blur-[140px]" />

      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] rounded-full bg-blue-300/20 blur-[120px]" />

      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-fuchsia-200/20 blur-[120px]" /> */}

      {/* ── Left Panel ── */}
      <div className="relative hidden lg:flex flex-col justify-between w-1/2 px-16 py-12 z-10" style={{ backgroundColor: "#f0eef8" }}>
        <div>
          {/* Logo */}
          <UniLibraryLogo />

          {/* Brand name */}
          <div className="mt-4">
            <h1 className="text-3xl font-black tracking-tight text-gray-900">
              Uni_<span className="text-purple-600">Library</span>
            </h1>
            <p className="text-lg font-semibold text-gray-800 mt-0.5">Management System</p>
          </div>

          {/* Divider */}
        <div className="w-8 h-0.5 bg-purple-500 mt-4 mb-2" />
          {/* Tagline */}
          <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
            A smart and simple way to manage<br />your library resources.
          </p>
        </div>

        {/* Illustration */}
        <div className="relative flex flex-1 items-center justify-center">

          <div className="absolute w-[500px] h-[500px] rounded-full bg-violet-300/20 blur-[90px]" />

          <div className="absolute bottom-10 w-[350px] h-[120px] rounded-full bg-indigo-300/20 blur-[70px]" />

          <LibraryIllustration />

        </div>

        {/* Footer */}
        <p className="text-xs text-gray-400 leading-relaxed">
          © 2026 Uni_Library Management System.<br />All rights reserved.
        </p>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="bg-white rounded-3xl shadow-xl w-full max-w-md px-10 py-10">

          {/* Heading */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Welcome <span className="text-purple-600">Back!</span>
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              Sign in to access your library dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                Email Address
              </label>
              <div className={`flex items-center border rounded-xl px-3 py-2.5 gap-2 bg-white transition
                ${errors.email ? "border-red-400 ring-1 ring-red-300" : "border-gray-200 focus-within:border-purple-400 focus-within:ring-1 focus-within:ring-purple-300"}`}
              >
                <UserIcon />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className="flex-1 text-sm text-gray-700 placeholder-gray-400 bg-transparent outline-none"
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                Password
              </label>
              <div className={`flex items-center border rounded-xl px-3 py-2.5 gap-2 bg-white transition
                ${errors.password ? "border-red-400 ring-1 ring-red-300" : "border-gray-200 focus-within:border-purple-400 focus-within:ring-1 focus-within:ring-purple-300"}`}
              >
                <LockIcon />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="flex-1 text-sm text-gray-700 placeholder-gray-400 bg-transparent outline-none"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-gray-400 hover:text-gray-600 transition"
                  tabIndex={-1}
                >
                  <EyeIcon off={showPassword} />
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={form.rememberMe}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded flex items-center justify-center transition
                    ${form.rememberMe ? "bg-purple-600" : "bg-white border-2 border-gray-300"}`}
                  >
                    {form.rememberMe && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-700">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-purple-600 font-medium hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-70 text-white font-bold py-3 rounded-xl transition text-sm tracking-wide shadow-md"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in…
                </span>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">or continue with</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Google Sign In */}
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const response = await api.post("/api/auth/google-login/", {
                    idToken: credentialResponse.credential,
                  });

                  login(response.data.token);

                  navigate("/", { replace: true });

                } catch (error) {
                  console.error(error);
                  alert("Google Login Failed");
                }
              }}
              onError={() => {
                alert("Google Sign-In was cancelled or failed.");
              }}
            />
          </form>

          {/* Contact Admin */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <button className="text-purple-600 font-semibold hover:underline">
              Contact Administrator
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
