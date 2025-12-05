import React, { useEffect, useState } from "react";
import axios from "axios";
import { Mail, Phone, Bed, Calendar, Users } from "lucide-react";
const apiUrl = import.meta.env.VITE_API_URL;
const Guest = () => {
  const [guests, setGuests] = useState([]);

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/bookings`);
        setGuests(res.data);
      } catch (err) {
        console.error("Error fetching guests:", err);
      }
    };
    fetchGuests();
  }, []);

  return (
    <div className="md:ml-70 p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Total Guest Details ({guests.length})
      </h1>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto shadow rounded-lg">
        <table className="min-w-[900px] w-full bg-white border-collapse">
          <thead className="bg-green-900 text-white">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Guest</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Rooms</th>
              <th className="p-3 text-left">Check-In</th>
              <th className="p-3 text-left">Check-Out</th>
              <th className="p-3 text-left">Guests</th>
              <th className="p-3 text-left">Total ₹</th>
              <th className="p-3 text-left">Special Request</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((guest, index) => (
              <tr
                key={guest._id}
                className="border-b hover:bg-green-50 transition"
              >
                <td className="p-3">{index + 1}</td>
                <td className="p-3 flex items-center gap-2">
                  <img
                    src={guest.avatar || "https://i.pravatar.cc/50?img=1"}
                    alt={guest.name}
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                  <span className="font-medium">{guest.name}</span>
                </td>
                <td className="p-3">{guest.email}</td>
                <td className="p-3">{guest.phone}</td>
                <td className="p-3">{guest.roomNames}</td>
                <td className="p-3">{new Date(guest.checkin).toLocaleDateString()}</td>
                <td className="p-3">{new Date(guest.checkout).toLocaleDateString()}</td>
                <td className="p-3">{guest.adults + guest.kids + (guest.pets || 0)}</td>
                <td className="p-3 font-semibold text-green-900">₹{guest.totalAmount}</td>
                <td className="p-3">{guest.specialRequest || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden flex flex-col gap-5">
        {guests.map((guest, index) => (
          <div
            key={guest._id}
            className="bg-white shadow-lg rounded-xl p-4 border border-gray-200 hover:shadow-2xl transition"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="font-semibold text-gray-700">{index + 1}.</span>
              <img
                src={guest.avatar || "https://i.pravatar.cc/50?img=1"}
                alt={guest.name}
                className="w-12 h-12 rounded-full object-cover border"
              />
              <span className="text-lg font-semibold text-gray-800">{guest.name}</span>
            </div>

            <div className="grid grid-cols-1 gap-2 text-gray-600 text-sm">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-green-700" /> {guest.email}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-green-700" /> {guest.phone}
              </p>
              <p className="flex items-center gap-2">
                <Bed className="w-4 h-4 text-green-700" /> {guest.roomNames}
              </p>
              <p className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-green-700" /> Check-In:{" "}
                {new Date(guest.checkin).toLocaleDateString()}
              </p>
              <p className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-green-700" /> Check-Out:{" "}
                {new Date(guest.checkout).toLocaleDateString()}
              </p>
              <p className="flex items-center gap-2">
                <Users className="w-4 h-4 text-green-700" /> Guests: {guest.adults + guest.kids + (guest.pets || 0)}
              </p>
              <p className="text-green-900 font-semibold text-lg">₹{guest.totalAmount}</p>
              {guest.specialRequest && (
                <p className="flex items-start gap-2">
                  <span className="font-semibold text-gray-700">Special Request:</span> {guest.specialRequest}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {guests.length === 0 && (
        <p className="text-gray-500 text-center mt-10">No guests found.</p>
      )}
    </div>
  );
};

export default Guest;
