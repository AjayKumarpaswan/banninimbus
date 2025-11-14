import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";

const Reservation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const data = state || {};

  // ✅ Date calculations
  const parseDate = (str) => (str ? new Date(str) : new Date());
  const checkinDate = parseDate(data.checkin);
  const checkoutDate = parseDate(data.checkout);
  const nights = Math.max(
    1,
    Math.round((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24))
  );

  // ✅ Price calculations
  const basePrice = parseFloat(data.price?.replace(/[^\d.]/g, "")) || 5500;
  const totalBase = basePrice * nights;
  const gst = totalBase * 0.18;
  const total = totalBase + gst;

  // ✅ Load Razorpay script
  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // ✅ Payment handler
  const handlePayment = async (amount) => {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) return alert("Razorpay SDK failed to load.");

    try {
      const response = await fetch("http://localhost:5000/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = await response.json();

      if (!data.success) return alert("Failed to create Razorpay order");

      const { order } = data;
      const options = {
        key: "rzp_test_RbAGuaW8eICYMe",
        amount: order.amount,
        currency: order.currency,
        name: "Baan Nimbus",
        description: "Room Reservation Payment",
        order_id: order.id,
        handler: async (response) => {
          const verifyRes = await fetch("http://localhost:5000/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const verify = await verifyRes.json();

          if (verify.success) {
            setPaymentSuccess(true);
            alert("✅ Payment Successful!");
          } else {
            alert("❌ Payment Verification Failed!");
          }
        },
        prefill: {
          name: user?.name || "Guest",
          email: user?.email || "guest@example.com",
          contact: user?.phone || "9999999999",
        },
        theme: { color: "#0f172a" },
      };
      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      alert("Payment failed.");
    }
  };

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    alert("Logged out successfully!");
  };

  return (
    <section className="min-h-screen bg-[#f6f6f6] flex flex-col md:flex-row justify-center items-start gap-10 px-6 py-10 font-sans">
      {/* ================= LEFT SECTION ================= */}
      <div className="w-full md:w-[520px] space-y-10">
        {/* Step 1: Login */}
        <div>
          <h2 className="text-2xl font-bold mb-4">1. LOG IN OR SIGN UP</h2>
          {user ? (
            <div className="flex items-center justify-between border border-gray-300 rounded-md px-4 py-2 bg-green-50 w-fit">
              <div className="flex items-center gap-3">
                <User className="text-green-800" />
                <div>
                  <p className="font-medium text-green-900">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.phone}</p>
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
              className="bg-green-900 text-white px-8 py-2 rounded-md hover:bg-green-800 transition"
            >
              LOG IN
            </button>
          )}
        </div>

        {/* Step 2: Payment */}
        <div>
          <h2 className="text-2xl font-bold mb-3">2. ADD A PAYMENT METHOD</h2>
          {!paymentSuccess && (
            <button
              onClick={() => handlePayment(total)}
              className="bg-green-900 text-white px-8 py-2 rounded-md hover:bg-green-800 transition"
            >
              Pay ₹{total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </button>
          )}
          {paymentSuccess && (
            <p className="mt-3 text-green-700 font-semibold">
              ✅ Payment Successful!
            </p>
          )}
        </div>

        {/* Step 3: Reservation — show only after payment */}
       
            <h2 className="text-2xl font-bold mb-3">3. YOUR RESERVATION</h2>
             {paymentSuccess && (
          <div>
            <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm">
              <p className="text-gray-700 mb-2">
                Guest Details for{" "}
                <span className="font-semibold text-green-800">{data.title}</span>
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>Guest Name:</strong> {user?.name}</p>
                <p><strong>Phone:</strong> {user?.phone}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Adults:</strong> {data.adults}</p>
                <p><strong>Kids:</strong> {data.kids}</p>
                <p><strong>Pets:</strong> {data.pets}</p>
                <p><strong>Special Request:</strong> Early Check-in</p>
                <p><strong>Estimated Arrival:</strong> 02:00 PM</p>
              </div>
            </div>

            
          </div>
        )}
        <div className="flex justify-end mt-6">
              <button
                onClick={() => navigate("/confirmation")}
                className="bg-green-900 text-white px-10 py-2 rounded-md hover:bg-green-800 transition"
              >
                NEXT
              </button>
            </div>
      </div>

      {/* ================= RIGHT SECTION ================= */}
      <div className="w-full md:w-[420px] bg-white border border-gray-300 rounded-3xl shadow-md p-6 relative">
        <button
          onClick={() => navigate("/rooms")}
          className="absolute top-4 right-4 bg-green-900 text-white px-5 py-1 rounded-md text-sm hover:bg-green-800 transition"
        >
          UPDATE
        </button>

        <img
          src={data.image || "/assets/home-bg.jpg"}
          alt={data.title}
          className="rounded-xl w-full h-[160px] object-cover mb-4"
        />
        <h2 className="text-2xl font-semibold uppercase">{data.title}</h2>
        <p className="text-sm text-gray-600 mb-2">★★★★★ 4.9</p>

        <div className="text-sm text-gray-700 space-y-1 mb-3">
          <p>Adults | {data.adults || "02"}</p>
          <p>Kids | {data.kids || "00"}</p>
          <p>Pets | {data.pets || "00"}</p>
        </div>

        <div className="flex justify-between text-sm text-gray-800 mb-4">
          <div>
            <p className="font-semibold">Check-in</p>
            <p>{data.checkin}</p>
          </div>
          <div>
            <p className="font-semibold">Check-out</p>
            <p>{data.checkout}</p>
          </div>
        </div>

        <div className="border-t border-gray-300 pt-4 text-sm text-gray-700">
          <p className="font-semibold mb-2">Price details</p>
          <div className="flex justify-between">
            <span>{nights} Nights × ₹{basePrice.toLocaleString()}</span>
            <span>₹{totalBase.toLocaleString()}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span>Taxes & fees (18% GST)</span>
            <span>₹{gst.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          </div>
          <hr className="my-3" />
          <div className="flex justify-between font-semibold text-base">
            <span>Total INR</span>
            <span>₹{total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-300 pt-4 text-xs text-gray-600 leading-relaxed">
          <p className="font-semibold text-gray-800 mb-1">
            Change & Cancellation Policy
          </p>
          <p>1. This booking is non-cancellable and non-refundable.</p>
          <p>2. You may change your booking dates once, subject to availability.</p>
        </div>
      </div>

      {showPopup && (
        <GuestPopup
          onClose={() => setShowPopup(false)}
          onSuccess={(user) => setUser(user)}
        />
      )}
    </section>
  );
};

export default Reservation;

/* ================= GUEST POPUP ================= */
const GuestPopup = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
      onClose();
    } catch {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
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
        <form onSubmit={handleSubmit} className="space-y-4">
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
