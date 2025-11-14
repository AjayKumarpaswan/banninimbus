import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut } from "lucide-react";
import logo from "/assets/home__logo--white.png";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    alert("Logged out successfully!");
  };

  return (
    <header className="w-full bg-[#f5f5f5] shadow-sm px-6 md:px-16 py-3 flex items-center justify-between relative z-50">
      {/* 🌿 Logo */}
      <div className="relative flex items-center space-x-2">
        <img
          src={logo}
          alt="Baan Nimbus Logo Shadow"
          className="absolute h-10 md:h-20 object-contain invert opacity-90"
        />
        <img
          src={logo}
          alt="Baan Nimbus Logo"
          className="relative h-10 md:h-20 object-contain"
        />
      </div>

      {/* 🌿 Desktop Nav */}
      <nav className="hidden md:flex space-x-10 text-gray-800 font-medium">
        <a href="/" className="hover:text-green-700 transition">
          Home
        </a>
        <a href="/roomheader" className="hover:text-green-700 transition">
          Rooms
        </a>
        <a href="#" className="hover:text-green-700 transition">
          About
        </a>
        <a href="#" className="hover:text-green-700 transition">
          Cuisine
        </a>
      </nav>

      {/* 🌿 Right Section */}
      <div className="hidden md:flex items-center space-x-4">
        {user ? (
          <div className="flex items-center gap-2 text-gray-900">
            <div className="flex items-center gap-3">
              {/* 🟢 User Avatar or Icon */}
              <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                {user.avatar ? (
                  <img
                    src={
                      user.avatar.startsWith("http")
                        ? user.avatar // full URL from Google
                        : `http://localhost:5000${user.avatar}` // local upload
                    }
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="text-black" size={20} />
                )}
              </div>


              {/* 🧑 User Name */}
              <span className="font-semibold text-black">{user.name}</span>

              {/* 🔴 Logout Button */}
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowPopup(true)}
            className="border border-gray-800 text-gray-800 font-semibold px-4 py-1.5 rounded-full hover:bg-gray-800 hover:text-white transition"
          >
            Login
          </button>
        )}
      </div>

      {/* 🌿 Mobile Menu Button */}
      <button
        className="md:hidden text-gray-800 text-3xl focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      {/* 🌿 Mobile Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-[70px] left-0 w-full bg-white shadow-lg rounded-b-2xl md:hidden overflow-hidden z-50"
          >
            <div className="flex flex-col items-center py-5 space-y-5 text-gray-800 font-medium">
              <a href="/" onClick={() => setMenuOpen(false)} className="hover:text-green-700 transition">Home</a>
              <a href="/roomheader" onClick={() => setMenuOpen(false)} className="hover:text-green-700 transition">Rooms</a>
              <a href="#" onClick={() => setMenuOpen(false)} className="hover:text-green-700 transition">About</a>
              <a href="#" onClick={() => setMenuOpen(false)} className="hover:text-green-700 transition">Cuisine</a>
              <hr className="w-3/4" />

              {user ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                   {user.avatar ? (
                  <img
                    src={
                      user.avatar.startsWith("http")
                        ? user.avatar // full URL from Google
                        : `http://localhost:5000${user.avatar}` // local upload
                    }
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="text-black" size={20} />
                )}
                  </div>
                  <span className="font-semibold text-black">{user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-800 transition"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setShowPopup(true); setMenuOpen(false); }}
                  className="border border-gray-800 text-gray-800 font-semibold px-4 py-1.5 rounded-full hover:bg-gray-800 hover:text-white transition"
                >
                  Login
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌿 Login Popup */}
      {showPopup && (
        <GuestPopup
          onClose={() => setShowPopup(false)}
          onSuccess={(newUser) => setUser(newUser)}
        />
      )}
    </header>
  );
};

export default Header;

/* =================== GUEST POPUP =================== */
const GuestPopup = ({ onClose, onSuccess }) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("password", form.password);
      if (form.avatar) formData.append("avatar", form.avatar);

      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        body: formData,
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

  // ✅ Google Login Handler
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const res = await axios.post("http://localhost:5000/api/auth/google", { token });
      const user = res.data.user;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", res.data.token);
      onSuccess(user);
      alert("Logged in with Google!");
      onClose();
    } catch (err) {
      console.error("Google login failed:", err);
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
          Guest Information
        </h2>
        {error && <p className="text-red-500 text-center mb-3">{error}</p>}

        {/* 🌟 Google Login Button */}
        <div className="flex justify-center mb-4">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => setError("Google login failed")}
          />
        </div>

        <div className="text-center text-gray-500 mb-4">OR</div>

        {/* 🌿 Existing Form */}
        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <input
            name="name"
            placeholder="Full Name"
            className="w-full p-3 border rounded"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded"
            value={form.email}
            onChange={handleChange}
            required
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

          {/* Avatar Upload */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Profile Picture
            </label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-green-500 flex items-center justify-center overflow-hidden bg-white">
                {preview ? (
                  <img
                    src={preview}
                    alt="Avatar Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-sm text-center px-2">No Image</span>
                )}
              </div>
              <div>
                <label
                  htmlFor="avatar"
                  className="cursor-pointer inline-flex items-center px-4 py-2 bg-green-700 text-white text-sm font-medium rounded-lg shadow hover:bg-green-800 transition-all duration-200"
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
                <p className="text-xs text-gray-500 mt-2">JPG, PNG, or WEBP • Max 2MB</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition"
          >
            {loading ? "Saving..." : "Save & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};
