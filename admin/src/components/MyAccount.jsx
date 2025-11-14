import React, { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { User } from "lucide-react";

const MyAccount = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "admin",
    password: "",
    avatar: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [admin, setAdmin] = useState(JSON.parse(localStorage.getItem("admin")) || null);

  useEffect(() => {
    // If admin exists in localStorage, show the details
    const storedAdmin = JSON.parse(localStorage.getItem("admin"));
    if (storedAdmin) setAdmin(storedAdmin);
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar" && files[0]) {
      setForm({ ...form, avatar: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Submit registration form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("role", form.role);
      formData.append("password", form.password);
      if (form.avatar) formData.append("avatar", form.avatar);

      const res = await axios.post(
        "http://localhost:5000/api/admin/register",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const registeredAdmin = res.data.admin;
      localStorage.setItem("admin", JSON.stringify(registeredAdmin));
      setAdmin(registeredAdmin); // Show details instead of form
      setMessage("Admin registered successfully!");
      setForm({
        name: "",
        email: "",
        phone: "",
        role: "admin",
        password: "",
        avatar: null,
      });
      setPreview(null);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Google Registration/Login
  const handleGoogleRegister = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const res = await axios.post("http://localhost:5000/api/admin/google", { token });
      const googleAdmin = res.data.admin;
      localStorage.setItem("admin", JSON.stringify(googleAdmin));
      setAdmin(googleAdmin);
      setMessage(`Admin ${googleAdmin.name} registered/logged in successfully via Google!`);
    } catch (err) {
      console.error(err);
      setMessage("Google registration failed");
    }
  };

  // Logout admin
  const handleLogout = () => {
    localStorage.removeItem("admin");
    setAdmin(null);
    setMessage("");
  };

  return (
    <div className="min-h-screen flex items-center md:ml-60 justify-center bg-gray-100 p-4">
      {!admin ? (
        <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8">
          <h1 className="text-3xl font-bold text-green-800 text-center mb-6">Admin Registration</h1>

          {message && (
            <p
              className={`text-center mb-4 ${
                message.toLowerCase().includes("success") ? "text-green-600" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}

          {/* Google Login */}
          <div className="flex justify-center mb-4">
            <GoogleLogin
              onSuccess={handleGoogleRegister}
              onError={() => setMessage("Google registration failed")}
            />
          </div>

          <div className="text-center text-gray-500 mb-4">OR</div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500"
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500"
            />

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500"
            >
              <option value="admin">Admin</option>
              <option value="superadmin">Superadmin</option>
            </select>

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500"
            />

            {/* Avatar Upload */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-green-500 flex items-center justify-center overflow-hidden">
                {preview ? (
                  <img src={preview} alt="Avatar Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-sm text-center">No Image</span>
                )}
              </div>
              <div>
                <label
                  htmlFor="avatar"
                  className="cursor-pointer inline-flex items-center px-4 py-2 bg-green-700 text-white rounded-md shadow hover:bg-green-800 transition"
                >
                  Upload Avatar
                </label>
                <input
                  type="file"
                  name="avatar"
                  id="avatar"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
                <p className="text-xs text-gray-500 mt-1">JPG, PNG, WEBP • Max 2MB</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white shadow-2xl rounded-3xl w-full max-w-lg p-10 flex flex-col items-center text-center relative overflow-hidden">
    {/* Decorative circle background */}
    <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-100 rounded-full opacity-40 blur-2xl"></div>

    {/* Avatar Section */}
    <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-green-600 shadow-md mb-5">
      {admin.avatar ? (
        <img
          src={
            admin.avatar.startsWith("http")
              ? admin.avatar
              : `http://localhost:5000${admin.avatar}`
          }
          alt={admin.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-green-50">
          <User className="text-green-600" size={40} />
        </div>
      )}
    </div>

    {/* Admin Info */}
    <h2 className="text-2xl font-semibold text-gray-800">{admin.name}</h2>
    <p className="text-gray-500 text-sm mb-1">{admin.email}</p>
    {admin.phone && <p className="text-gray-500 text-sm">{admin.phone}</p>}

    <div className="mt-4 px-4 py-1 bg-green-100 text-green-700 text-sm rounded-full capitalize font-medium inline-block">
      {admin.role}
    </div>

    {/* Divider */}
    <div className="w-16 border-t-2 border-gray-200 my-6"></div>

    {/* Quick Stats or Info (optional) */}
    <div className="grid grid-cols-3 gap-6 text-sm text-gray-600 mb-6">
      <div>
        <p className="font-semibold text-green-700">Status</p>
        <p>Active</p>
      </div>
      <div>
        <p className="font-semibold text-green-700">Joined</p>
        <p>{new Date().toLocaleDateString()}</p>
      </div>
      <div>
        <p className="font-semibold text-green-700">Role</p>
        <p>{admin.role}</p>
      </div>
    </div>

    {/* Logout Button */}
    <button
      onClick={handleLogout}
      className="px-6 py-2.5 bg-red-500 text-white rounded-full font-medium shadow-md hover:bg-red-700 transition"
    >
      Logout
    </button>
  </div>
      )}
    </div>
  );
};

export default MyAccount;
