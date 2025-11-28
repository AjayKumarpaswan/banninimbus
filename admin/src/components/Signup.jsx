import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    avatar: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "avatar" && files.length > 0) {
      setForm({ ...form, avatar: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("email", form.email);
      fd.append("phone", form.phone);
      fd.append("password", form.password);
      if (form.avatar) fd.append("avatar", form.avatar);

      const res = await axios.post(
        "http://localhost:5000/api/admin/register",
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      localStorage.setItem("admin", JSON.stringify(res.data.admin));
      localStorage.setItem("adminToken", res.data.token);
      alert("Registered successfully")

      navigate("/"); // redirect to login after successful signup

      setForm({ name: "", email: "", phone: "", password: "", avatar: null });
      setPreview(null);
    } catch (error) {
      setMsg(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

//   const handleGoogle = async (res) => {
//     try {
//       const googleRes = await axios.post("http://localhost:5000/api/admin/google", {
//         token: res.credential,
//       });

//       localStorage.setItem("admin", JSON.stringify(googleRes.data.admin));
//       localStorage.setItem("adminToken", googleRes.data.token);
      
//       navigate("/"); // redirect after Google auth
//     } catch (err) {
//       setMsg("Google registration failed");
//     }
//   };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8">

        <h1 className="text-2xl font-bold text-green-800 text-center mb-6">
          Admin Registration
        </h1>

        {msg && (
          <p
            className={`text-center mb-4 ${
              msg.includes("failed") ? "text-red-600" : "text-green-600"
            }`}
          >
            {msg}
          </p>
        )}

        {/* <div className="flex justify-center mb-4">
          <GoogleLogin onSuccess={handleGoogle} onError={() => setMsg("Google failed")} />
        </div> */}

        {/* <div className="text-center text-gray-500 mb-4">OR</div> */}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-md"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-md"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-3 border rounded-md"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-md"
          />

          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 border-2 border-dashed flex items-center justify-center rounded-full overflow-hidden">
              {preview ? (
                <img src={preview} className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm text-gray-400">No Image</span>
              )}
            </div>

            <label className="cursor-pointer px-4 py-2 bg-green-700 text-white rounded-md">
              Upload Avatar
              <input
                type="file"
                name="avatar"
                className="hidden"
                onChange={handleChange}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 text-white py-2 rounded-md"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Already have an account */}
        <p className="text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <Link to="/" className="text-green-700 font-semibold">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Signup;
