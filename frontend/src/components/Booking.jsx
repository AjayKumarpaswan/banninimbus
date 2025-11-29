// src/pages/Booking.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { room, bookingDetails } = location.state || {};

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);

  // ✅ Auto image carousel
  useEffect(() => {
    if (!room?.images?.length) return;
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % room.images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [room?.images]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleBooking = async () => {
    if (!form.name || !form.email || !form.password) {
      alert("Please fill all required fields (name, email, password)");
      return;
    }

    try {
      setLoading(true);

      // Step 1: Register guest
      const userRes = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role: "guest",
        }),
      });

      const userData = await userRes.json();
      if (!userRes.ok) {
        alert(userData.message || "User registration failed");
        return;
      }

      const guest_id = userData.user?.id || userData._id;

      // Step 2: Create booking
      const bookingRes = await fetch(`${apiUrl}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room_id: room._id,
          guest_id,
          checkin: bookingDetails.checkin,
          checkout: bookingDetails.checkout,
        }),
      });

      const bookingData = await bookingRes.json();
      if (bookingRes.ok) {
        setBooking(bookingData.booking);
        alert("✅ Booking created successfully!");
      } else {
        alert(bookingData.message || "Booking failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    alert("💳 Payment integration coming soon (Razorpay/Stripe)");
  };

  if (!room) return <p className="text-center mt-10">No room selected</p>;

  const nextImage = () =>
    setCurrentImage((prev) => (prev + 1) % room.images.length);
  const prevImage = () =>
    setCurrentImage(
      (prev) => (prev - 1 + room.images.length) % room.images.length
    );

  return (
    <section className="min-h-screen bg-gray-100 py-8 px-4 flex flex-col lg:flex-row gap-8 items-start justify-center">
      {/* 🏨 Left: Room Details */}
      <div className="flex-1 bg-white shadow-xl rounded-2xl p-4 sm:p-6 max-w-full lg:max-w-3xl w-full">
        <h2 className="text-2xl sm:text-3xl font-semibold text-blue-800 mb-4 text-center">
          {room.name}
        </h2>

        {/* 🖼️ Responsive Carousel */}
        <div className="relative w-full h-[220px] sm:h-[350px] md:h-[400px] overflow-hidden rounded-xl mb-5">
          {room.images?.map((img, i) => (
            <img
              key={i}
              src={`${apiUrl}${img}`}
              alt={room.name}
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                i === currentImage ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}

          {/* Carousel buttons */}
          {room.images?.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 sm:p-3 transition"
              >
                ‹
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 sm:p-3 transition"
              >
                ›
              </button>
            </>
          )}

          {/* Dots */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
            {room.images?.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImage(i)}
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${
                  i === currentImage ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Room Info */}
        <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
          <span className="font-bold">Description:</span> {room.description}
        </p>
        <p className="text-lg font-bold text-blue-700 mb-4">
          <span className="font-bold">Rate:</span> ₹{room.rate} / night
        </p>

        <div className="mt-3">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">
            Amenities:
          </h4>
          <ul className="grid grid-cols-2 gap-2 text-gray-700 text-sm sm:text-base">
            {room.amenities?.map((a, i) => (
              <li key={i} className="flex items-center gap-2">
                <span>✔</span> {a}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 🧾 Right: Booking Form */}
      <div className="w-full lg:w-[400px] bg-white shadow-xl rounded-2xl p-5 sm:p-6">
        <h3 className="text-2xl font-semibold text-gray-800 border-b pb-3 mb-4 text-center sm:text-left">
          Guest Information
        </h3>

        <div className="space-y-4">
          {["name", "email", "phone", "password"].map((field, idx) => (
            <input
              key={idx}
              type={field === "password" ? "password" : field === "email" ? "email" : "text"}
              name={field}
              placeholder={
                field === "name"
                  ? "Full Name"
                  : field.charAt(0).toUpperCase() + field.slice(1)
              }
              value={form[field]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 outline-none"
            />
          ))}
        </div>

        <div className="mt-5 space-y-1 text-gray-700 text-sm sm:text-base">
          <p>
            <strong>Check-in:</strong> {bookingDetails.checkin}
          </p>
          <p>
            <strong>Check-out:</strong> {bookingDetails.checkout}
          </p>
        </div>

        {!booking ? (
          <button
            onClick={handleBooking}
            disabled={loading}
            className="mt-5 w-full bg-blue-600 text-white font-medium py-3 rounded-md hover:bg-blue-700 transition-all"
          >
            {loading ? "Processing..." : "Confirm Booking"}
          </button>
        ) : (
          <button
            onClick={handlePayment}
            className="mt-5 w-full bg-green-600 text-white font-medium py-3 rounded-md hover:bg-green-700 transition-all"
          >
            Pay Now
          </button>
        )}

        <button
          onClick={() => navigate(-1)}
          className="mt-3 w-full bg-gray-700 text-white py-3 rounded-md hover:bg-gray-800 transition-all"
        >
          Go Back
        </button>
      </div>
    </section>
  );
};

export default Booking;
