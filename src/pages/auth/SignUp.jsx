import { useState, useEffect } from "react"
import imageOne from "../../assets/welcome-image-one.jpg"
import InputField from "../../components/Input"
import Button from "../../components/Button"
import { publicRequest } from "../../api/config"
import OtpInput from "react-otp-input"
import { Link } from "react-router-dom"

export default function SignUp() {
  const [form, setForm] = useState({
    organisationName: "",
    businessEmail: "",
    phoneNumber: "",
    username: "",
    password: "",
  })

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [success, setSuccess] = useState(false)
  const [otp, setOtp] = useState("")
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpError, setOtpError] = useState("")
  const [otpSuccess, setOtpSuccess] = useState(false)

  useEffect(() => {
    const generatePassword = () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
      let pass = ""
      for (let i = 0; i < 12; i++) {
        pass += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return pass
    }

    setForm((prev) => ({
      ...prev,
      password: generatePassword(),
    }))
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    setErrorMessage("")
    try {
      const payload = {
        organisationName: form.organisationName,
        businessEmail: form.businessEmail,
        phoneNumber: form.phoneNumber,
        username: form.username,
        password: form.password,
      }

      await publicRequest.post("/organisation-user/register", payload)
      setSuccess(true)
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  const handleOtpVerify = async () => {
    setOtpLoading(true)
    setOtpError("")
    try {
      let response = await publicRequest.post("/organisation-user/verify-otp", {
        email: form.businessEmail,
        otp,
      })
      if(response.status == 200) {
        localStorage.setItem("userToken", response.data.token);
      }
      setOtpSuccess(true)
    } catch (err) {
      setOtpError(err?.response?.data?.message || "Invalid OTP")
    } finally {
      setOtpLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white flex flex-col md:flex-row items-center justify-center px-6 py-10">
      <div className="hidden md:block w-full max-w-md mr-10">
        <img
          src={imageOne}
          alt="Cyber Security Illustration"
          className="w-full h-auto rounded-xl shadow-lg border border-white/10"
        />
      </div>

      <div className="w-full max-w-xl bg-slate-900 p-8 rounded-2xl border border-white/10 shadow-xl">
        {!success ? (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">
              Create Your Free Account With Us
            </h2>

            <div className="space-y-5">
              <InputField
                label="Organisation Name"
                name="organisationName"
                value={form.organisationName}
                onChange={handleChange}
                placeholder="e.g. CyberSecure Ltd"
              />
              <InputField
                label="Business Email"
                name="businessEmail"
                value={form.businessEmail}
                onChange={handleChange}
                placeholder="e.g. security@cybersecure.com"
              />
              <InputField
                label="Phone Number"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder="e.g. 9876543210"
              />
              <InputField
                label="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Choose your username"
              />
              <InputField
                label="Password (Auto Generated)"
                name="password"
                value={form.password}
                readOnly
                placeholder="Auto generated password"
              />
            </div>

            {errorMessage && (
              <div className="text-red-400 text-md mx-auto mt-5">{errorMessage}</div>
            )}

            <div className="mt-8 flex justify-center">
              <Button loading={loading} onClick={handleSubmit}>
                Sign Up
              </Button>
            </div>
          </>
        ) : (
          <>
            {!otpSuccess ? (
              <>
                <h2 className="text-xl font-semibold mb-4 text-center">
                  An OTP has been sent to <span className="text-sky-400">{form.businessEmail}</span>
                </h2>

                <div className="flex justify-center mb-6">
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    inputStyle={{
                      width: "3rem",
                      height: "3rem",
                      borderRadius: "0.5rem",
                      border: "1px solid white",
                      backgroundColor: "#1e293b",
                      color: "#fff",
                      fontSize: "1.25rem",
                    }}
                    containerStyle={{ gap: "0.5rem" }}
                    renderInput={(props) => <input {...props} />}
                  />
                </div>

                {otpError && <div className="text-red-400 mb-4 text-center">{otpError}</div>}

                <div className="flex justify-center">
                  <Button onClick={handleOtpVerify} loading={otpLoading}>
                    Verify OTP
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center flex flex-col gap-3">
                <h2 className="text-2xl font-bold mb-4 text-green-400">🎉 Verification Successful</h2>
                <p className="text-gray-300 mb-4">
                  Your account is now verified and ready to use.
                </p>
                <Link to="/roadmap-analysis" className="p-4 bg-blue-500 rounded-lg inline-block text-lg">Proceed to Roadmap Analysis</Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
