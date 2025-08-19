import { useState } from "react";
import forgetPasswordImage from "../../assets/forget-password.jpg";
import InputField from "../../components/Input";
import Button from "../../components/Button";
import OtpInput from "react-otp-input";
import { publicRequest } from "../../api/config";
import { showToast } from "../../lib/toast";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState("email"); // "email" | "otp" | "reset"

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();


  const handleSendOtp = async () => {
    if (!email) {
      setError("Email is required");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await publicRequest.put("/organisation-user/forget-password", { businessEmail: email });
      setStep("otp");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };


  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError("Please enter the full 6-digit OTP");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await publicRequest.post("/organisation-user/forget-password-otp", { businessEmail: email, otp });
      setStep("reset");
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  // Reset Password
  const handleResetPassword = async () => {
    if (!newPassword) {
      setError("Please enter a new password");
      return;
    }
    setError("");
    setLoading(true);
    try {
      // Send email, otp, newPassword to reset password endpoint
      await publicRequest.post("/organisation-user/reset-password", { businessEmail: email, otp, newPassword });
      setError("");
      showToast.success("Password reset successful! You can now log in with your new password.");

      setStep("email");
      setEmail("");
      setOtp("");
      setNewPassword("");
      setTimeout(() => navigate("/signin"), 1000)
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="max-w-5xl bg-slate-900 rounded-lg flex overflow-hidden shadow-lg">
        {/* Left side image */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center bg-slate-800">
          <img
            src={forgetPasswordImage}
            alt="Forgot Password"
            className="object-contain w-80 h-80 rounded-md"
            loading="lazy"
            draggable={false}
          />
        </div>

        {/* Right side form */}
        <div className="w-full max-w-md p-8 flex flex-col justify-center text-white space-y-6">
          {step === "email" && (
            <>
              <h2 className="text-3xl font-semibold">Forgot Password</h2>
              <p className="text-gray-400">
                Enter your business email and we'll send you an OTP to reset your password.
              </p>
              <InputField
                label="Business Email"
                placeholder="Enter your business email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error}
                type="email"
              />
              <Button loading={loading} onClick={handleSendOtp} variant="primary">
                Send OTP
              </Button>
            </>
          )}

          {step === "otp" && (
            <>
              <h2 className="text-3xl font-semibold">Enter OTP</h2>
              <p className="text-gray-400">
                We sent a 6-digit code to <span className="text-blue-400">{email}</span>
              </p>
              <div className="flex justify-center mb-6">
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  inputType="tel"
                  containerStyle={{ gap: "0.5rem" }}
                  renderInput={(props, index) => (
                    <input
                      {...props}
                      key={index}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      onWheel={(e) => e.target.blur()}
                      style={{
                        ...props.style,
                        width: "3rem",
                        height: "3rem",
                        borderRadius: "0.5rem",
                        border: "1px solid white",
                        backgroundColor: "#1e293b",
                        color: "#fff",
                        fontSize: "1.25rem",
                        outline: "none",
                        transition: "border 0.2s ease",
                        marginBottom: "0.5rem",
                        marginTop: "0.5rem",
                      }}
                      onFocus={(e) => {
                        e.target.style.border = "1px solid #38bdf8"; // Light blue focus border
                      }}
                      onBlur={(e) => {
                        e.target.style.border = "1px solid white"; // Revert border
                      }}
                    />
                  )}
                />
              </div>
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              <Button loading={loading} onClick={handleVerifyOtp} variant="primary" disabled={otp.length !== 6}>
                Verify OTP
              </Button>
            </>
          )}

          {step === "reset" && (
            <>
              <h2 className="text-3xl font-semibold">Reset Password</h2>
              <p className="text-gray-400">
                Enter your new password below.
              </p>
              <InputField
                label="New Password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                type="password"
                error={error}
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              <Button loading={loading} onClick={handleResetPassword} variant="primary" disabled={!newPassword}>
                Reset Password
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
