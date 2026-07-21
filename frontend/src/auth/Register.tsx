import { useNavigate } from "react-router-dom";
import { useAuth } from "../data/useAuth";
import api from "../data/api";
import { GoogleLogin } from "@react-oauth/google";

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
  const navigate = useNavigate();
  const { login } = useAuth();

  return (
    <div className="min-h-screen flex font-sans bg-gray-50 items-center justify-center py-10 px-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md px-8 py-10">
        
        <div className="text-center mb-8">
          <UniLibraryLogo />
          <h2 className="text-3xl font-bold text-gray-900">
            Create an <span className="text-purple-600">Account</span>
          </h2>
          <p className="text-sm text-gray-400 mt-2 leading-relaxed">
            Register securely using your Google account to access the library. This ensures you receive important updates and fine reminders.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="w-full max-w-xs flex justify-center">
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
                  alert("Google Registration Failed");
                }
              }}
              onError={() => {
                alert("Google Sign-In was cancelled or failed.");
              }}
              useOneTap
            />
          </div>

          <div className="w-full border-t border-gray-100 pt-6 mt-6">
            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <button 
                type="button" 
                onClick={() => navigate("/login")} 
                className="text-purple-600 font-semibold hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
