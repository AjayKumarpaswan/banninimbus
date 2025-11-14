import React, { useEffect, useState } from "react";
import axios from "axios";
import { Mail, Phone, Bed, Calendar } from "lucide-react";

const Message = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/bookings");
        // Only keep bookings with specialRequest
        const specialRequests = res.data.filter(
          (booking) => booking.specialRequest && booking.specialRequest.trim() !== ""
        );
        setMessages(specialRequests);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="md:ml-64  min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Special Requests ({messages.length})
      </h1>

      {messages.length === 0 && (
        <p className="text-gray-500 text-center mt-10">
          No special requests found.
        </p>
      )}

      <div className="flex flex-col gap-4">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className="bg-white rounded-xl shadow-md p-4 border border-gray-200 hover:shadow-lg transition"
          >
            {/* Guest Info */}
            <div className="flex items-center gap-3 mb-3">
              <img
                src={msg.avatar || "https://i.pravatar.cc/50?img=1"}
                alt={msg.name}
                className="w-12 h-12 rounded-full object-cover border"
              />
              <div>
                <p className="font-semibold text-gray-800">{msg.name}</p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Mail className="w-4 h-4 text-green-700" /> {msg.email}
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Phone className="w-4 h-4 text-green-700" /> {msg.phone}
                </p>
              </div>
            </div>

            {/* Booking Info */}
            <div className="grid grid-cols-1 gap-2 text-gray-600 text-sm mb-2">
              <p className="flex items-center gap-2">
                <Bed className="w-4 h-4 text-green-700" /> Rooms: {msg.roomNames}
              </p>
              <p className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-green-700" /> Check-In:{" "}
                {new Date(msg.checkin).toLocaleDateString()}
              </p>
              <p className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-green-700" /> Check-Out:{" "}
                {new Date(msg.checkout).toLocaleDateString()}
              </p>
            </div>

            {/* Special Request */}
            <div className="bg-green-50 border-l-4 border-green-700 p-3 rounded-md">
              <p className="font-medium text-green-900">Special Request:</p>
              <p className="text-gray-700">{msg.specialRequest}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Message;
