import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import imageItem from "../../assets/welcome-image-two.jpg";
import InputField from "../../components/Input";
import Button from "../../components/Button";
import { publicRequest } from "../../api/config";

export default function Signin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Clear API error when user makes changes
    if (apiError) {
      setApiError("");
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setApiError("");
    
    try {
      const response = await publicRequest.post("/organisation-user/sign-in", {
        email: form.email.trim().toLowerCase(),
        password: form.password
      });
      
      if (response.status === 200) {
        localStorage.setItem("userToken", response.data.token);
        navigate("/roadmap-analysis");
      }
    } catch (err) {
      console.error("Login error:", err);
      
      if (err?.response?.status === 401) {
        setApiError("Invalid email or password. Please try again.");
      } else if (err?.response?.status === 404) {
        setApiError("Account not found. Please check your email or sign up.");
      } else if (err?.response?.status >= 500) {
        setApiError("Server error. Please try again later.");
      } else {
        setApiError(err?.response?.data?.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white flex flex-col lg:flex-row items-center justify-center px-4 py-6 lg:px-8 lg:py-10">
      {/* Left image section */}
      <div className="hidden lg:flex w-full max-w-lg xl:max-w-xl mr-8 xl:mr-12 flex-col">
        <div className="mb-2">
          <h1 className="text-2xl xl:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Secure Your Digital Assets
          </h1>
        </div>
        <img
          src={imageItem}
          alt="Cyber Security Login"
          className="w-full h-auto rounded-2xl shadow-2xl border border-white/20 backdrop-blur-sm"
        />
      </div>

      {/* Right form section */}
      <div className="w-full max-w-md lg:max-w-lg">
        <div className="bg-slate-800/50 backdrop-blur-xl p-6 lg:p-8 rounded-2xl border border-white/10 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-xl lg:text-2xl font-bold mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-gray-400 text-sm lg:text-base">
              Sign in to access your security dashboard
            </p>
          </div>

          {/* Global API Error */}
          {apiError && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-500/50 rounded-lg">
              <p className="text-red-300 text-sm text-center">{apiError}</p>
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-5">
              <InputField
                label="Business Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your business email"
                error={errors.email}
              />
              
              <InputField
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                error={errors.password}
              />
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link 
                to="/forgot-password" 
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-center">
              <Button loading={loading} onClick={handleSubmit}>
                Login
              </Button>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{" "}
              <Link 
                to="/signup" 
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Mobile image */}
        <div className="lg:hidden mt-8 text-center">
          <img
            src={imageItem}
            alt="Cyber Security"
            className="w-48 h-auto mx-auto rounded-xl opacity-70"
          />
        </div>
      </div>
    </div>
  );
}