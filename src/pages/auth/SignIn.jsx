import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import imageItem from "../../assets/welcome-image-two.jpg";
import InputField from "../../components/Input";
import Button from "../../components/Button";
import { publicRequest } from "../../api/config";

export default function Signin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await publicRequest.post("/organisation-user/sign-in", form);
      if (response.status === 200) {
        localStorage.setItem("userToken", response.data.token);
        navigate("/roadmap-analysis");
      }
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white flex flex-col md:flex-row items-center justify-center px-6 py-10">
      {/* Left image */}
      <div className="hidden md:block w-full max-w-md mr-10">
        <img
          src={imageItem}
          alt="Cyber Security Login"
          className="w-full h-auto rounded-xl shadow-lg border border-white/10"
        />
      </div>

      {/* Right form */}
      <div className="w-full max-w-xl bg-slate-900 p-8 rounded-2xl border border-white/10 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In to Your Account</h2>

        <div className="space-y-5">
          <InputField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your business email"
          />
          <InputField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
        </div>

        {errorMessage && (
          <div className="text-red-400 text-md mx-auto mt-5">{errorMessage}</div>
        )}

        <div className="mt-8 flex justify-center">
          <Button loading={loading} onClick={handleSubmit}>
            Login
          </Button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-400">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-400 hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
