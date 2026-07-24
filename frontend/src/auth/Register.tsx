import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../data/useAuth";
import api from "../data/api";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";

// ─── Icons ────────────────────────────────────────────────────────────────────

const UserIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const MailIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const BadgeIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <path d="M8 14h.01" />
    <path d="M12 14h.01" />
    <path d="M16 14h.01" />
    <path d="M8 18h.01" />
    <path d="M12 18h.01" />
    <path d="M16 18h.01" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path d="M3 21h18" />
    <path d="M9 8h1" />
    <path d="M9 12h1" />
    <path d="M9 16h1" />
    <path d="M14 8h1" />
    <path d="M14 12h1" />
    <path d="M14 16h1" />
    <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
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

// ─── Logo ─────────────────────────────────────────────────────────────────────

const UniLibraryLogo = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 mx-auto mb-2">
    <polygon points="40,4 74,64 6,64" fill="none" stroke="#3b82f6" strokeWidth="4" />
    <polygon points="40,76 6,16 74,16" fill="none" stroke="#22c55e" strokeWidth="4" />
    <polygon points="40,22 52,29 52,43 40,50 28,43 28,29" fill="#ef4444" opacity="0.9" />
    <rect x="33" y="30" width="14" height="16" rx="1.5" fill="white" />
    <line x1="40" y1="30" x2="40" y2="46" stroke="#ef4444" strokeWidth="1.5" />
    <line x1="33" y1="34" x2="39" y2="34" stroke="#fca5a5" strokeWidth="1" />
    <line x1="33" y1="37" x2="39" y2="37" stroke="#fca5a5" strokeWidth="1" />
    <line x1="33" y1="40" x2="39" y2="40" stroke="#fca5a5" strokeWidth="1" />
  </svg>
);

// ─── Register Form Types ──────────────────────────────────────────────────────

interface RegisterFormState {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  rollNo: string;
  department: string;
}

interface RegisterFormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  rollNo?: string;
  department?: string;
  idCard?: string;
}

function validateForm(form: RegisterFormState, idCard: File | null): RegisterFormErrors {
  const errors: RegisterFormErrors = {};
  if (!form.fullName) errors.fullName = "Full Name is required.";
  if (!form.email) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!form.phone) {
    errors.phone = "Phone Number is required.";
  } else if (!/^\d{10}$/.test(form.phone.trim())) {
    errors.phone = "Phone number must be exactly 10 digits.";
  }
  if (!form.password) {
    errors.password = "Password is required.";
  } else if (form.password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }
  if (!form.rollNo) errors.rollNo = "Roll Number is required.";
  if (!form.department) errors.department = "Department is required.";
  if (!idCard) errors.idCard = "Identity card is required.";
  return errors;
}

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [form, setForm] = useState<RegisterFormState>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    rollNo: "",
    department: "",
  });
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [idCard, setIdCard] = useState<File | null>(null);
  const [idCardPreview, setIdCardPreview] = useState<string | null>(null);
  const idCardRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof RegisterFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateForm(form, idCard);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const names = form.fullName.trim().split(" ");
      const firstName = names[0];
      const lastName = names.slice(1).join(" ");
      const username = form.email.split("@")[0] + Math.floor(Math.random() * 1000);

      // 1. Register the user
      const registerData = new FormData();
      registerData.append("username", username);
      registerData.append("email", form.email);
      registerData.append("password", form.password);
      registerData.append("first_name", firstName);
      registerData.append("last_name", lastName);
      registerData.append("role", "student");
      registerData.append("roll_no", form.rollNo);
      registerData.append("department", form.department);
      registerData.append("phone", form.phone);
      if (idCard) registerData.append("id_proof", idCard);

      await api.post("/api/accounts/register/", registerData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // 2. Automatically log them in after registration
      const loginResponse = await api.post("/api/login/", {
        email: form.email,
        password: form.password,
      });

      login(loginResponse.data.access, loginResponse.data.refresh);
      toast.success("Account created successfully!");
      navigate("/", { replace: true });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error(err.response?.data);
        const errorData = err.response?.data;
        if (errorData?.email) {
          setErrors((prev) => ({ ...prev, email: Array.isArray(errorData.email) ? errorData.email[0] : errorData.email }));
        }
        if (errorData?.phone) {
          setErrors((prev) => ({ ...prev, phone: Array.isArray(errorData.phone) ? errorData.phone[0] : errorData.phone }));
        }
        if (errorData?.roll_no) {
          setErrors((prev) => ({ ...prev, rollNo: Array.isArray(errorData.roll_no) ? errorData.roll_no[0] : errorData.roll_no }));
        }
        if (!errorData?.email && !errorData?.phone && !errorData?.roll_no) {
          toast.error(errorData?.detail || "Registration failed. Please try again.");
        }
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-gray-50 items-center justify-center py-10 px-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md px-8 py-10">
        <div className="text-center mb-6">
          <UniLibraryLogo />
          <h2 className="text-3xl font-bold text-gray-900">
            Create an <span className="text-purple-600">Account</span>
          </h2>
          <p className="text-sm text-gray-400 mt-2 leading-relaxed">
            Register to access the library dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Full Name + Phone */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">Full Name</label>
              <div className={`flex items-center border rounded-xl px-3 py-2.5 gap-2 bg-white transition ${errors.fullName ? "border-red-400 ring-1 ring-red-300" : "border-gray-200 focus-within:border-purple-400 focus-within:ring-1 focus-within:ring-purple-300"}`}>
                <UserIcon />
                <input type="text" name="fullName" value={form.fullName} onChange={handleChange} placeholder="John Doe" className="w-full text-sm text-gray-700 placeholder-gray-400 bg-transparent outline-none" />
              </div>
              {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">Phone Number</label>
              <div className={`flex items-center border rounded-xl px-3 py-2.5 gap-2 bg-white transition ${errors.phone ? "border-red-400 ring-1 ring-red-300" : "border-gray-200 focus-within:border-purple-400 focus-within:ring-1 focus-within:ring-purple-300"}`}>
                <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 12 19.79 19.79 0 0 1 1 3.18 2 2 0 0 1 2.98 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16l.92.92z" />
                </svg>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="98XXXXXXXX" className="w-full text-sm text-gray-700 placeholder-gray-400 bg-transparent outline-none" />
              </div>
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div className="flex gap-3">
            {/* Roll Number */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">Roll Number</label>
              <div className={`flex items-center border rounded-xl px-3 py-2.5 gap-2 bg-white transition ${errors.rollNo ? "border-red-400 ring-1 ring-red-300" : "border-gray-200 focus-within:border-purple-400 focus-within:ring-1 focus-within:ring-purple-300"}`}>
                <BadgeIcon />
                <input type="text" name="rollNo" value={form.rollNo} onChange={handleChange} placeholder="e.g. CS-01" className="w-full text-sm text-gray-700 placeholder-gray-400 bg-transparent outline-none" />
              </div>
              {errors.rollNo && <p className="text-xs text-red-500 mt-1">{errors.rollNo}</p>}
            </div>

            {/* Department */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">Department</label>
              <div className={`flex items-center border rounded-xl px-3 py-2.5 gap-2 bg-white transition ${errors.department ? "border-red-400 ring-1 ring-red-300" : "border-gray-200 focus-within:border-purple-400 focus-within:ring-1 focus-within:ring-purple-300"}`}>
                <BuildingIcon />
                <select name="department" value={form.department} onChange={handleChange} className="w-full text-sm text-gray-700 bg-transparent outline-none cursor-pointer">
                  <option value="" disabled>Select...</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">IT</option>
                  <option value="Civil Engineering">Civil</option>
                  <option value="Mechanical Engineering">Mechanical</option>
                  <option value="Electrical Engineering">Electrical</option>
                  <option value="BBA">BBA</option>
                  <option value="MBA">MBA</option>
                </select>
              </div>
              {errors.department && <p className="text-xs text-red-500 mt-1">{errors.department}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">Email Address</label>
            <div className={`flex items-center border rounded-xl px-3 py-2.5 gap-2 bg-white transition ${errors.email ? "border-red-400 ring-1 ring-red-300" : "border-gray-200 focus-within:border-purple-400 focus-within:ring-1 focus-within:ring-purple-300"}`}>
              <MailIcon />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="flex-1 text-sm text-gray-700 placeholder-gray-400 bg-transparent outline-none"
                autoComplete="email"
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>


          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">Password</label>
            <div className={`flex items-center border rounded-xl px-3 py-2.5 gap-2 bg-white transition ${errors.password ? "border-red-400 ring-1 ring-red-300" : "border-gray-200 focus-within:border-purple-400 focus-within:ring-1 focus-within:ring-purple-300"}`}>
              <LockIcon />
              <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} placeholder="Create a password" className="flex-1 text-sm text-gray-700 placeholder-gray-400 bg-transparent outline-none" />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="text-gray-400 hover:text-gray-600 transition" tabIndex={-1}>
                <EyeIcon off={showPassword} />
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          {/* Identity Card Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">Identity Card / College ID *</label>
            <div
              className={`border-2 border-dashed rounded-xl p-3 cursor-pointer transition text-center ${errors.idCard ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-purple-400 hover:bg-purple-50"}`}
              onClick={() => idCardRef.current?.click()}
            >
              {idCardPreview ? (
                <div className="relative">
                  <img src={idCardPreview} alt="ID Card Preview" className="mx-auto max-h-32 rounded-lg object-contain" />
                  <button
                    type="button"
                    className="mt-2 text-xs text-red-500 hover:text-red-700 font-medium"
                    onClick={(e) => { e.stopPropagation(); setIdCard(null); setIdCardPreview(null); if (idCardRef.current) idCardRef.current.value = ""; }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="py-2">
                  <svg className="w-8 h-8 text-gray-300 mx-auto mb-1" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                  </svg>
                  <p className="text-sm text-gray-500"><span className="text-purple-600 font-semibold">Click to upload</span> your ID card</p>
                  <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, PDF up to 5MB</p>
                </div>
              )}
            </div>
            <input
              ref={idCardRef}
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setIdCard(file);
                if (file.type.startsWith("image/")) {
                  setIdCardPreview(URL.createObjectURL(file));
                } else {
                  setIdCardPreview(null);
                }
                setErrors((prev) => ({ ...prev, idCard: undefined }));
              }}
            />
            {idCard && !idCardPreview && (
              <p className="text-xs text-green-600 mt-1">✓ {idCard.name} selected</p>
            )}
            {errors.idCard && <p className="text-xs text-red-500 mt-1">{errors.idCard}</p>}
          </div>

          {/* Register Button */}
          <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-70 text-white font-bold py-3 rounded-xl transition text-sm tracking-wide shadow-md mt-2">
            {loading ? "Registering..." : "Register"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or sign up with</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google Sign In */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const response = await api.post("/api/accounts/google-login/", {
                    id_token: credentialResponse.credential,
                  });
                  login(response.data.access, response.data.refresh);
                  navigate("/", { replace: true });
                } catch (error) {
                  console.error(error);
                  toast.error("Google Registration Failed");
                }
              }}
              onError={() => toast.warning("Google Sign-In was cancelled or failed.")}
            />
          </div>
        </form>

        <div className="w-full border-t border-gray-100 pt-6 mt-6">
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <button type="button" onClick={() => navigate("/login")} className="text-purple-600 font-semibold hover:underline">
              Sign In
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
