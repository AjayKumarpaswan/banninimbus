import React, { useState } from "react";

const BookingDropdown = ({ onClose }) => {
  const [form, setForm] = useState({
    checkin: "",
    checkout: "",
    adults: 1,
    kids: 0,
    pets: 0,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Search Rooms Data:", form);
    alert("Searching rooms...");
  };

  return (
   <div className="fixed right-6 top-19 w-[400px] bg-white shadow-2xl rounded-xl p-6 z-50 text-black">

      <div className="flex justify-between items-center mb-3">
        <h2 className="text-center text-xl font-semibold">Book Your Stay</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-black text-lg">
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Check-in Date */}
        <div>
          <label className="block text-gray-700 mb-1">Check-in Date:</label>
          <input
            type="date"
            name="checkin"
            value={form.checkin}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>

        {/* Check-out Date */}
        <div>
          <label className="block text-gray-700 mb-1">Check-out Date:</label>
          <input
            type="date"
            name="checkout"
            value={form.checkout}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>

        {/* Adults */}
        <div>
          <label className="block text-gray-700 mb-1">Adults:</label>
          <input
            type="number"
            name="adults"
            value={form.adults}
            min="1"
            max="9"
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Kids */}
        <div>
          <label className="block text-gray-700 mb-1">
            Kids (above 10 years):
          </label>
          <input
            type="number"
            name="kids"
            value={form.kids}
            min="0"
            max="9"
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Pets */}
        <div>
          <label className="block text-gray-700 mb-1">Pets:</label>
          <input
            type="number"
            name="pets"
            value={form.pets}
            min="0"
            max="9"
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Search Rooms
        </button>
      </form>
    </div>
  );
};

export default BookingDropdown;
