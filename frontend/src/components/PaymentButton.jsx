import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { User, LogOut, CheckCircle } from "lucide-react";
import axios from "axios";

const Reservation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // ✅ Popup, User, and Payment states
  const [showPopup, setShowPopup] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(false);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const data = state || {};

  // ✅ Correct Date Parsing
  const parseDate = (str) => (str ? new Date(str) : new Date());
  const checkinDate = parseDate(data.checkin);
  const checkoutDate = parseDate(data.checkout);

  // ✅ Nights Calculation
  const nights = Math.max(
    1,
    Math.round((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24))
  );

  // ✅ Pricing Calculations
  const basePrice = parseFloat(data.price?.replace(/[^\d.]/g, "")) || 0;
  const totalBase = basePrice * nights;
  const gst = totalBase * 0.18;
  const total = totalBase + gst;

  // ✅ Logout Handler
  const handleLogout = async () => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      alert("Logged out successfully!");
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Failed to remove account.");
    }
  };

  // ✅ Load Razorpay Script
  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // ✅ Handle Payment
  const handlePayment = async () => {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) return alert("Razorpay SDK failed to load.");

    try {
      const { data } = await axios.post("http://localhost:5000/api/payment/create-order", {
        amount: total, // from reservation
      });

      if (!data.success) return alert("Failed to create order.");

      const { order } = data;

      const options = {
        key: "rzp_test_Rjwed0WAMV5UmV", // Test key
        amount: order.amount,
        currency: order.currency,
        name: "Baan Nimbus",
        description: "Room Reservation Payment",
        order_id: order.id,
        handler: async function (response) {
          const verify = await axios.post("http://localhost:5000/api/payment/verify", response);
          if (verify.data.success) {
            setPaymentStatus(true);
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
        theme: {
          color: "#0f172a",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment initiation failed. Check console for details.");
    }
  };

  return (
    <section className="flex flex-col md:flex-row justify-center px-4 md:px-10 py-10 font-sans">
      {/* ================= LEFT SIDE ================= */}
      <div className="w-full md:w-1/2 space-y-10">
        {/* STEP 1 */}
        <div>
          <h2 className="text-2xl font-bold mb-3 tracking-wide">
            1. LOG IN OR SIGN UP
          </h2>

          {user ? (
            <div className="flex items-center justify-between border border-gray-300 rounded-md px-4 py-2 bg-green-50 w-fit">
              <div className="flex items-center gap-3">
                <User className="text-green-800" />
                <div className="flex flex-col">
                  <span className="font-medium text-green-900">
                    {user.name}
                  </span>
                  <span className="text-sm text-gray-600">{user.phone}</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="ml-4 text-red-600 hover:text-red-800 transition"
                title="Logout"
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

        {/* STEP 2 */}
        <div>
          <h2 className="text-2xl font-bold mb-3 tracking-wide">
            2. ADD A PAYMENT METHOD
          </h2>

          {!paymentStatus ? (
            <button
              onClick={handlePayment}
              className="bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Pay ₹{total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </button>
          ) : (
            <div className="flex items-center gap-2 text-green-700 font-semibold">
              <CheckCircle className="text-green-700" />
              Payment Successful
            </div>
          )}
        </div>

        {/* STEP 3 */}
        <div>
          <h2 className="text-2xl font-bold mb-3 tracking-wide">
            3. YOUR RESERVATION
          </h2>
          <button className="bg-green-900 text-white px-10 py-2 rounded-md hover:bg-green-800 transition">
            NEXT
          </button>
        </div>
      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="w-full md:w-[420px] bg-white border border-gray-300 rounded-3xl shadow-md p-6 mt-10 md:mt-0 relative">
        <button
          onClick={() => navigate("/rooms")}
          className="absolute top-4 right-4 bg-green-900 text-white px-5 py-1 rounded-md text-sm hover:bg-green-800 transition"
        >
          UPDATE
        </button>

        <img
          src={
            data.images && data.images.length > 0
              ? `http://localhost:5000${data.images[0]}`
              : "/assets/home-bg.jpg"
          }
          alt={data.title}
          className="rounded-xl w-full h-[160px] object-cover mb-4"
        />

        <h2 className="text-2xl font-semibold uppercase">{data.title}</h2>
        <p className="text-sm text-gray-600 mb-2">
          ★★★★★ {data.rating || "4.9"}
        </p>

        <div className="text-sm text-gray-700 space-y-1 mb-3">
          <p>Adults | {data.adults || "00"}</p>
          <p>Kids | {data.kids || "00"}</p>
          <p>Pets | {data.pets || "00"}</p>
        </div>

        <div className="mt-3 flex justify-between text-sm text-gray-800">
          <div>
            <p className="font-semibold">Check-in</p>
            <p>{data.checkin}</p>
          </div>
          <div>
            <p className="font-semibold">Check-out</p>
            <p>{data.checkout}</p>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-300 pt-4 text-sm text-gray-700">
          <p className="font-semibold mb-2">Price details</p>
          <div className="flex justify-between">
            <span>
              {nights} Nights x ₹{basePrice.toLocaleString()}
            </span>
            <span>₹{totalBase.toLocaleString()}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span>Taxes & fees (18% GST)</span>
            <span>
              ₹{gst.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
          </div>
          <hr className="my-3" />
          <div className="flex justify-between font-semibold text-base">
            <span>Total INR</span>
            <span>
              ₹{total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* ================= POPUP ================= */}
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
