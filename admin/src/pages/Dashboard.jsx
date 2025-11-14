import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import BookingCard from "../components/BookingCard";
import RightPanel from "../components/RightPanel";

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);

  const bookings = [
    {
      id: "2025SC0001",
      name: "Ankit Pandey",
      room: "Saeng Chan",
      dates: "12-12-2025 - 14-12-2025",
      guests: "02",
      image: "/assets/user.jpg",
    },
    {
      id: "2025TA0002",
      name: "Balaji",
      room: "Taantawan +1",
      dates: "18-12-2025 - 23-12-2025",
      guests: "08",
      image: "/assets/user.jpg",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isOpen={isOpen} toggle={() => setIsOpen(!isOpen)} />
      <div className="flex-1 flex flex-col">
        <Header toggle={() => setIsOpen(!isOpen)} />
        <main className="flex-1 flex flex-col xl:flex-row gap-6 p-6">
          <div className="flex-1 bg-green-900 text-white rounded-3xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Booking</h2>
              <div className="space-x-2">
                <button className="bg-white text-green-900 px-4 py-2 rounded-md text-sm">
                  Create Booking
                </button>
                <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm">
                  Cancel Booking
                </button>
              </div>
            </div>

            {bookings.map((b) => (
              <BookingCard key={b.id} booking={b} />
            ))}
          </div>

          <RightPanel />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
