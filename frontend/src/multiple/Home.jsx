import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import heroBg from "/assets/home-bg.jpg";

const Home = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    room: "",
    checkin: "",
    checkout: "",
    adults: "",
    kids: "",
    pets: "",
  });

  const [error, setError] = useState("");

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // clear error when user types
  };

  // handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const { room, checkin, checkout, adults, kids, pets,status } = formData;

    // Check all required fields
    if (!room || !checkin || !checkout || !adults || !kids || !pets) {
      setError("⚠️ Please fill in all the required fields before booking.");
      return;
    }

    // If all filled, navigate to rooms page
    navigate("/rooms", { state: formData });
  };

  return (
    <section className="relative w-full mt-10 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="relative flex flex-col md:flex-row items-center justify-between w-full md:w-[90%] lg:w-[85%] bg-white rounded-[30px] md:rounded-[50px] shadow-2xl overflow-hidden">
        {/* ✅ Left Image Section */}
        <div
          className="w-full md:w-1/2 h-[200px] sm:h-[250px] md:h-[70vh] bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="w-full h-full bg-black/50"></div>
        </div>

        {/* ✅ Right Content Section */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-gray-900 leading-snug mb-3">
            NOW YOU CAN ESCAPE TO <br className="hidden sm:block" /> YOUR OWN VILLAGE SQUARE
          </h1>

          {/* Feature Badges */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-gray-700 text-sm sm:text-base mt-3">
            <span>🐾 Pet-Friendly</span>
            <span className="text-gray-400">|</span>
            <span>🌿 Garden Paradise</span>
            <span className="text-gray-400">|</span>
            <span>🏊 Private Pool</span>
          </div>

          {/* Booking Form */}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 my-6"
          >
            <select
              name="room"
              value={formData.room}
              onChange={handleChange}
              required
              className="border border-gray-400 rounded-md py-2 px-3 w-full text-sm focus:outline-none focus:border-green-700"
            >
              <option value="">Select Room</option>
              <option value="Saeng Chan">Saeng Chan</option>
              <option value="Leelawadee">Taantawan</option>
              <option value="Leelawadee">Baanburee</option>
              <option value="Leelawadee">JamJuree</option>
              <option value="Leelawadee">Chaba</option>
              <option value="Leelawadee">Leelawadee</option>
              <option value="Leelawadee">Rachawadee</option>
            </select>

            <input
              type="date"
              name="checkin"
              value={formData.checkin}
              onChange={handleChange}
              required
              className="border border-gray-400 rounded-md py-2 px-3 w-full text-sm focus:outline-none focus:border-green-700"
            />

            <input
              type="date"
              name="checkout"
              value={formData.checkout}
              onChange={handleChange}
              required
              className="border border-gray-400 rounded-md py-2 px-3 w-full text-sm focus:outline-none focus:border-green-700"
            />

            <select
              name="adults"
              value={formData.adults}
              onChange={handleChange}
              required
              className="border border-gray-400 rounded-md py-2 px-3 w-full text-sm focus:outline-none focus:border-green-700"
            >
              <option value="">Select Adults</option>
              <option value="01">01</option>
              <option value="02">02</option>
              <option value="03">03</option>
            </select>

            <select
              name="kids"
              value={formData.kids}
              onChange={handleChange}
              required
              className="border border-gray-400 rounded-md py-2 px-3 w-full text-sm focus:outline-none focus:border-green-700"
            >
              <option value="">Select Kids</option>
              <option value="00">00</option>
              <option value="01">01</option>
              <option value="02">02</option>
            </select>

            <select
              name="pets"
              value={formData.pets}
              onChange={handleChange}
              required
              className="border border-gray-400 rounded-md py-2 px-3 w-full text-sm focus:outline-none focus:border-green-700"
            >
              <option value="">Select Pets</option>
              <option value="00">00</option>
              <option value="01">01</option>
            </select>

            <button
              type="submit"
              className="col-span-1 sm:col-span-2 lg:col-span-3 bg-green-800 text-white py-2 rounded-md font-semibold hover:bg-green-900 transition text-sm sm:text-base"
            >
              BOOK NOW
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <p className="text-red-600 text-sm font-medium mt-1 text-center md:text-left">
              {error}
            </p>
          )}

          <p className="italic text-gray-500 mb-3 text-sm sm:text-base">
            IT'S NOT A RESORT, IT'S AN EXPERIENCE
          </p>
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
            Relax in a handcrafted homestay where Malnad tradition meets modern comfort,
            surrounded by gardens and local charm.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Home;
