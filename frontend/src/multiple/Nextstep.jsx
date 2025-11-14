import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User } from "lucide-react";

const Nextstep = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 🟢 Get selected room details from navigation state
  const { selectedRooms, totals } = location.state || {};
  console.log("nextstep selectedRooms:", selectedRooms);
  console.log("nextstep totals:", totals);

  // Default user data (from localStorage or fallback)
  const storedUser = JSON.parse(localStorage.getItem("user")) || {
    name: "Ankit Pandey",
    phone: "9305852525",
    email: "ankitpandey@gmail.com",
    avatar: "",
  };

  // Combined totals for editable fields
  const [formData, setFormData] = useState({
    name: storedUser.name,
    phone: storedUser.phone,
    email: storedUser.email,
    avatar: storedUser.avatar,
    adults: totals?.totalAdults || 0,
    kids: totals?.totalKids || 0,
    pets: totals?.totalPets || 0,
    kidsAges: Array(totals?.totalKids || 0).fill(""),
    specialRequest: " ",
    checkin: selectedRooms?.[0]?.checkin ,
    checkout: selectedRooms?.[0]?.checkout,
    roomNames: totals?.roomNames || "",
  });

  const [extraChildCharge, setExtraChildCharge] = useState(0);

  // 🧠 Handle guest info change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🧠 Handle change in kids count
  const handleKidsChange = (e) => {
    const count = Number(e.target.value);
    setFormData((prev) => ({
      ...prev,
      kids: count,
      kidsAges: Array(count).fill(""),
    }));
  };

  // 🧠 Handle individual kid age change + extra charge calculation
  const handleKidAgeChange = (index, value) => {
    const updatedAges = [...formData.kidsAges];
    updatedAges[index] = value;

    // Calculate extra charge: 2500 for every kid older than 8
    const extraCharge = updatedAges.reduce(
      (acc, age) => (Number(age) > 8 ? acc + 2500 : acc),
      0
    );

    setFormData((prev) => ({ ...prev, kidsAges: updatedAges }));
    setExtraChildCharge(extraCharge);
  };

  // 🧾 Handle Pay Now
  const handlePayNow = () => {
    const checkinDate = new Date(formData.checkin);
    const checkoutDate = new Date(formData.checkout);
    const calculatedNights = Math.ceil(
      (checkoutDate - checkinDate) / (1000 * 60 * 60 * 24)
    );

    // Merge room details and user/reservation info
    const paymentData = {
      selectedRooms,
      ...formData,
      extraChildCharge,
      nights: calculatedNights,
    };

    navigate("/payment", { state: { paymentData, totals } });
  };

  return (
    <section className="min-h-screen flex justify-center items-start bg-gray-100 py-10 px-4">
      <div className="max-w-7xl flex flex-col md:flex-row bg-white border border-gray-300 rounded-[36px] overflow-hidden shadow-sm">
        {/* Left Image */}
        <div className="md:w-[45%] w-full h-[240px] md:h-auto">
          <img
            src="/assets/home-bg.jpg"
            alt="Rooms"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Section */}
        <div className="md:w-[55%] w-full p-8 md:p-10 flex flex-col">
          <h2 className="text-xl md:text-2xl font-semibold text-[#141414] mb-3 text-left">
            Now You Can Escape to Your Own Village Square
          </h2>

          <div className="flex items-center gap-3 text-sm text-[#333] mb-5">
            <span>🐾 Pet-Friendly</span>
            <span className="text-gray-400">|</span>
            <span>🌿 Garden Paradise</span>
            <span className="text-gray-400">|</span>
            <span>🏖️ Private Pool</span>
          </div>

          {/* Step 1 - Guest Info */}
          <div className="flex items-center gap-3 mb-3">
            <p className="text-lg font-semibold text-gray-800 leading-none">1.</p>
            <div className="flex items-center border border-gray-400 rounded-md px-3 py-1.5">
              <User className="text-gray-700 mr-2" size={17} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="outline-none bg-transparent text-gray-800 font-medium text-[15px]"
              />
            </div>
          </div>

          {/* Step 2 - Reservation */}
          <div className="flex items-center gap-3 mb-6">
            <p className="text-lg font-semibold text-gray-800 leading-none">2.</p>
            <div className="border border-gray-400 rounded-md px-3 py-1.5 text-gray-800 font-semibold text-[15px]">
              YOUR RESERVATION
            </div>
          </div>

          {/* Reservation Info */}
          <div className="text-gray-700 text-sm space-y-3">
            <p>
              Guest Details for{" "}
              <span className="text-green-700 font-medium">
                {formData.roomNames}
              </span>
            </p>

            {/* Phone */}
            <p>
              Phone No. &nbsp;|&nbsp;
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="border-b border-gray-400 focus:border-green-700 outline-none text-gray-900 bg-transparent"
              />
            </p>

            {/* Email */}
            <p>
              Email Id. &nbsp;|&nbsp;
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border-b border-gray-400 focus:border-green-700 outline-none text-gray-900 bg-transparent"
              />
            </p>

            {/* Adults / Kids / Pets */}
            <div className="flex flex-wrap gap-2">
              <label className="border border-gray-400 px-3 py-1 rounded text-sm flex items-center gap-1">
                Adults |
                <input
                  type="number"
                  name="adults"
                  min="0"
                  value={formData.adults.toString().padStart(2, "0")}
                  onChange={handleChange}
                  className="w-10 outline-none bg-transparent text-center"
                />
              </label>

              <label className="border border-gray-400 px-3 py-1 rounded text-sm flex items-center gap-1">
                Kids |
                <input
                  type="number"
                  name="kids"
                  min="0"
                  value={formData.kids.toString().padStart(2, "0")}
                  onChange={handleKidsChange}
                  className="w-10 outline-none bg-transparent text-center"
                />
              </label>

              <label className="border border-gray-400 px-3 py-1 rounded text-sm flex items-center gap-1">
                Pets |
                <input
                  type="number"
                  name="pets"
                  min="0"
                  value={formData.pets.toString().padStart(2, "0")}
                  onChange={handleChange}
                  className="w-10 outline-none bg-transparent text-center"
                />
              </label>
            </div>

            {/* 🧒 Kids Age Selector */}
            {formData.kids > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-3">
                {formData.kidsAges.map((age, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 border border-gray-400 rounded-md px-2 py-1 text-sm text-gray-700"
                  >
                    <span className="text-gray-600">Kid {index + 1}:</span>
                    <select
                      value={age}
                      onChange={(e) => handleKidAgeChange(index, e.target.value)}
                      className="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700"
                    >
                      <option value="">Age needed</option>
                      {Array.from({ length: 18 }, (_, i) => (
                        <option key={i} value={i}>
                          {i} years old
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}

            {/* Special Request */}
            <p>
              Special Request &nbsp;|&nbsp;
              <input
                type="text"
                name="specialRequest"
                value={formData.specialRequest}
                onChange={handleChange}
                placeholder="Any special request?"
                className="border-b border-gray-400 focus:border-green-700 outline-none text-gray-900 bg-transparent w-full md:w-auto"
              />
            </p>

            {/* Check-in / Check-out */}
            <div className="flex items-center gap-3 text-sm text-gray-800 mt-3">
              <label className="flex flex-col md:flex-row md:items-center gap-1">
                <span className="text-gray-700 font-medium">Check-in |</span>
                <input
                  type="datetime-local"
                  name="checkin"
                  value={formData.checkin}
                  onChange={handleChange}
                  className="border border-gray-400 rounded-md px-2 py-1 text-gray-800"
                />
              </label>

              <label className="flex flex-col md:flex-row md:items-center gap-1">
                <span className="text-gray-700 font-medium">Check-out |</span>
                <input
                  type="datetime-local"
                  name="checkout"
                  value={formData.checkout}
                  onChange={handleChange}
                  className="border border-gray-400 rounded-md px-2 py-1 text-gray-800"
                />
              </label>
            </div>
          </div>

          {/* Pay Button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handlePayNow}
              className="bg-[#063D2C] text-white px-6 py-2 rounded-md hover:bg-green-900 transition text-sm font-medium tracking-wide"
            >
              PAY NOW
            </button>
          </div>

          <p className="text-gray-700 text-sm mt-6 leading-relaxed">
            Relax in a handcrafted homestay where Malnad tradition meets modern
            comfort, surrounded by gardens and local charm.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Nextstep;
