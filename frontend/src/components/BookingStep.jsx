import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { User, LogOut } from "lucide-react";
import axios from "axios";


const apiUrl = import.meta.env.VITE_API_URL;
const BookingStep = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const { selectedRooms, totals } = location.state || {};

  const [showPopup, setShowPopup] = useState(false);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    alert("Logged out successfully!");
  };

  return (
    <section className="min-h-screen flex justify-center items-start bg-gray-100 py-7">
      <div className="w-full max-w-5xl flex flex-col md:flex-row rounded-[40px] overflow-hidden border border-gray-300 bg-white shadow-lg">
        {/* LEFT IMAGE */}
        <div className="md:w-1/2 w-full h-[260px] md:h-auto">
          <img
            src="/assets/home-bg.jpg"
            alt="Leaf Background"
            className="w-full h-full object-cover"
          />
        </div>

        {/* RIGHT CONTENT */}
        <div className="md:w-1/2 w-full p-8 md:p-10 flex flex-col justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2 text-center md:text-left">
              Now You Can Escape to Your Own Village Square
            </h2>

            {/* ICON ROW */}
            <div className="flex justify-center md:justify-start items-center gap-3 text-sm text-gray-700 mb-6">
              <span>🐾 Pet-Friendly</span>
              <span className="text-gray-400">|</span>
              <span>🌿 Garden Paradise</span>
              <span className="text-gray-400">|</span>
              <span>🏖️ Private Pool</span>
            </div>

            {/* STEP BOX */}
            <div className="border border-gray-300 rounded-2xl p-10">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <p className="text-lg font-semibold text-gray-800">
                  1. Login or Sign up
                </p>

                {user ? (
                  <div className="flex items-center justify-between flex-1 border border-gray-300 rounded-md px-4 py-2 bg-green-50 ml-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        {user.avatar ? (
                          <img
                            src={
                              user.avatar.startsWith("http")
                                ? user.avatar
                                : `${apiUrl}${user.avatar}`
                            }
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="text-black" size={20} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-green-900">
                          {user.name} {user.phone}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="ml-4 text-red-600 hover:text-red-800"
                    >
                      <LogOut size={22} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowPopup(true)}
                    className="bg-[#063D2C] text-white px-6 py-2 rounded-md hover:bg-green-900 transition ml-2"
                  >
                    LOG IN
                  </button>
                )}
              </div>

              {/* ================== FIX ADDED HERE ================== */}
              <button
                onClick={() => {
                  if (!user) {
                    alert("Please login first");
                    setShowPopup(true);
                    return;
                  }
                  navigate("/next-step", { state: { selectedRooms, totals } });
                }}
                className="bg-[#063D2C] text-white px-6 py-2 rounded-md hover:bg-green-900 transition ml-auto block"
              >
                NEXT
              </button>
              {/* =================================================== */}
            </div>

            <p className="text-gray-700 text-sm mt-6 md:mt-10 text-center md:text-left leading-relaxed">
              Relax in a handcrafted homestay where Malnad tradition meets
              modern comfort, surrounded by gardens and local charm.
            </p>
          </div>
        </div>
      </div>

      {showPopup && (
        <GuestPopup
          onClose={() => setShowPopup(false)}
          onSuccess={(u) => setUser(u)}
        />
      )}
    </section>
  );
};

export default BookingStep;

/* ========================= POPUP ============================= */
const GuestPopup = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState("email"); // email → login or register
  const [exists, setExists] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    avatar: null,
  });

  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar" && files[0]) {
      setForm({ ...form, avatar: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  /* STEP 1: CHECK EMAIL */
  const checkEmail = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        `${apiUrl}/api/auth/check-email`,
        { email: form.email }
      );

      if (res.data.exists) {
        setExists(true);
        setStep("login");
      } else {
        setExists(false);
        setStep("register");
      }
    } catch {
      setError("Server error");
    }
  };

  /* LOGIN */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${apiUrl}/api/auth/login`,
        { email: form.email, password: form.password }
      );

      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);
      onSuccess(res.data.user);
      alert("Logged in successfully!");
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* REGISTER */
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("email", form.email);
      fd.append("phone", form.phone);
      fd.append("password", form.password);
      if (form.avatar) fd.append("avatar", form.avatar);

      const res = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      onSuccess(data.user);
      alert("Registered successfully!");
      onClose();
    } catch {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  /* GOOGLE LOGIN */
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const res = await axios.post(
        `${apiUrl}/api/auth/google`,
        { token }
      );

      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);
      onSuccess(res.data.user);
      alert("Logged in with Google!");
      onClose();
    } catch {
      setError("Google login failed");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-[999]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-green-800">
          {step === "email"
            ? "Enter Your Email"
            : exists
            ? "Login"
            : "Register"}
        </h2>

        {error && <p className="text-red-500 text-center mb-3">{error}</p>}

        {/* GOOGLE LOGIN */}
        <div className="flex justify-center mb-4">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => setError("Google login failed")}
          />
        </div>

        <div className="text-center text-gray-500 mb-4">OR</div>

        {/* STEP 1: EMAIL CHECK */}
        {step === "email" && (
          <form onSubmit={checkEmail} className="space-y-4">
            <input
              name="email"
              type="email"
              placeholder="Enter email"
              className="w-full p-3 border rounded"
              value={form.email}
              onChange={handleChange}
              required
            />

            <button className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800">
              Continue
            </button>
          </form>
        )}

        {/* LOGIN FORM */}
        {step === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              value={form.email}
              disabled
              className="w-full p-3 border rounded bg-gray-100"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              className="w-full p-3 border rounded"
              value={form.password}
              onChange={handleChange}
              required
            />

            <button className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {step === "register" && (
          <form onSubmit={handleRegister} className="space-y-4">
            <input
              name="name"
              placeholder="Full Name"
              className="w-full p-3 border rounded"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              value={form.email}
              disabled
              className="w-full p-3 border rounded bg-gray-100"
            />

            <input
              name="phone"
              placeholder="Phone"
              className="w-full p-3 border rounded"
              value={form.phone}
              onChange={handleChange}
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              className="w-full p-3 border rounded"
              value={form.password}
              onChange={handleChange}
              required
            />

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Profile Picture
              </label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-green-500 flex items-center justify-center overflow-hidden bg-white">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">No Image</span>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="avatar"
                    className="cursor-pointer inline-flex items-center px-4 py-2 bg-green-700 text-white text-sm font-medium rounded-lg shadow hover:bg-green-800"
                  >
                    Upload
                  </label>
                  <input
                    id="avatar"
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            <button className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800">
              {loading ? "Saving..." : "Register"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
