import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../data/api";

const UniLibraryLogo = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto mb-4">
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

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
    roll_no: "",
    department: "",
  });
  const [idProof, setIdProof] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIdProof(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append("role", "student"); // enforce student role
      
      if (idProof) {
        formData.append("id_proof", idProof);
      }

      await api.post("/api/accounts/register/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Registration successful! Please login.");
      navigate("/login", { replace: true });
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-purple-400 focus:ring-1 focus:ring-purple-300 outline-none transition";
  const labelClass = "block text-sm font-semibold text-gray-800 mb-1.5";

  return (
    <div className="min-h-screen flex font-sans bg-gray-50 items-center justify-center py-10 px-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-3xl px-8 py-10">
        
        <div className="text-center mb-8">
          <UniLibraryLogo />
          <h2 className="text-3xl font-bold text-gray-900">
            Create an <span className="text-purple-600">Account</span>
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            Register as a student to access the library
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Username</label>
              <input type="text" name="username" value={form.username} onChange={handleChange} required className={inputClass} placeholder="johndoe" />
            </div>
            <div>
              <label className={labelClass}>Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required className={inputClass} placeholder="john@example.com" />
            </div>
            <div>
              <label className={labelClass}>First Name</label>
              <input type="text" name="first_name" value={form.first_name} onChange={handleChange} required className={inputClass} placeholder="John" />
            </div>
            <div>
              <label className={labelClass}>Last Name</label>
              <input type="text" name="last_name" value={form.last_name} onChange={handleChange} required className={inputClass} placeholder="Doe" />
            </div>
            <div>
              <label className={labelClass}>Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} required className={inputClass} placeholder="••••••••" />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input type="text" name="phone" value={form.phone} onChange={handleChange} required className={inputClass} placeholder="+1234567890" />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Address</label>
              <input type="text" name="address" value={form.address} onChange={handleChange} required className={inputClass} placeholder="123 Main St, City" />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 mt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Student Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Roll Number</label>
                <input type="text" name="roll_no" value={form.roll_no} onChange={handleChange} required className={inputClass} placeholder="CS-2026-001" />
              </div>
              <div>
                <label className={labelClass}>Department</label>
                <input type="text" name="department" value={form.department} onChange={handleChange} required className={inputClass} placeholder="Computer Science" />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>ID Proof (Image/PDF)</label>
                <input type="file" name="id_proof" accept="image/*,.pdf" onChange={handleFileChange} required className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-70 text-white font-bold py-3 rounded-xl transition text-sm tracking-wide shadow-md mt-4"
          >
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <button type="button" onClick={() => navigate("/login")} className="text-purple-600 font-semibold hover:underline">
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
