import React, { useState } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await axios.post("http://localhost:5000/api/admin/login", form);

      localStorage.setItem("admin", JSON.stringify(res.data.admin));
      localStorage.setItem("adminToken", res.data.token);

      setMsg("Login successful!");

      // Redirect after login
       navigate("/booking"); // change to your actual page
    } catch (err) {
      setMsg(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async (response) => {
    try {
      const res = await axios.post("http://localhost:5000/api/admin/google", {
        token: response.credential,
      });

      localStorage.setItem("admin", JSON.stringify(res.data.admin));
      localStorage.setItem("adminToken", res.data.token);

      setMsg("Google login successful!");

      navigate("/booking");
    } catch (err) {
      setMsg("Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-green-800 text-center mb-6">
          Admin Login
        </h1>

        {msg && (
          <p
            className={`text-center mb-4 ${
              msg.includes("successful") ? "text-green-600" : "text-red-600"
            }`}
          >
            {msg}
          </p>
        )}

        <div className="flex justify-center mb-4">
          <GoogleLogin
            onSuccess={handleGoogle}
            onError={() => setMsg("Google failed")}
          />
        </div>

        <div className="text-center text-gray-500 mb-4">OR</div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-md"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-md"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 text-white py-2 rounded-md"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Add Sign Up Navigation */}
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="text-green-700 font-semibold hover:underline"
          >
            Don't have an account? Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
