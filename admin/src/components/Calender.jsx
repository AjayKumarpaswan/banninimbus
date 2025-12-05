import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  SlidersHorizontal,
  Bell,
  MoreHorizontal,
  Clock,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

const apiUrl = import.meta.env.VITE_API_URL;
const Calendar = () => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [showRooms, setShowRooms] = useState(false);
  const [showAllRequests, setShowAllRequests] = useState(false);


  const [showAllMessages, setShowAllMessages] = useState(false);

  const [admin, setAdmin] = useState({ name: "", avatar: "" });
  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const adminRes = await axios.get(`${apiUrl}/api/abookings`);
        const userRes = await axios.get(`${apiUrl}/api/bookings`);
        const combinedBookings = [...adminRes.data, ...userRes.data];
        setBookings(combinedBookings);

        const roomRes = await axios.get(`${apiUrl}/api/rooms`);
        setRooms(roomRes.data);

        // Default select first room if none selected
        if (roomRes.data.length > 0 && !selectedRoom) {
          setSelectedRoom(roomRes.data[0].title);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);


  // admin info
  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin"); // key depends on what you stored
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);
  // Dynamic year based on any booking that matches the month
  const getDynamicYear = () => {
    const filtered = bookings.filter((b) => {
      const checkin = new Date(b.checkin);
      return (
        checkin.getMonth() === selectedMonth &&
        (!selectedRoom || b.roomName === selectedRoom)
      );
    });
    if (filtered.length > 0) {
      return new Date(filtered[0].checkin).getFullYear();
    }
    return new Date().getFullYear();
  };

  const year = getDynamicYear();
  
// Calendar logic
  const firstDay = new Date(year, selectedMonth, 1).getDay();
  const daysInMonth = new Date(year, selectedMonth + 1, 0).getDate();
  const daysArray = Array.from({ length: firstDay + daysInMonth }, (_, i) =>
    i < firstDay ? null : i - firstDay + 1
  );

  useEffect(() => {
    const fetchBookingsAndRooms = async () => {
      try {
        // ✅ Fetch admin bookings
        const adminRes = await axios.get(`${apiUrl}/api/abookings`);

        // ✅ Fetch regular bookings
        const userRes = await axios.get(`${apiUrl}/api/bookings`);

        // ✅ Combine both bookings
        const combinedBookings = [...adminRes.data, ...userRes.data];
        setBookings(combinedBookings);

        // ✅ Fetch rooms
        const roomRes = await axios.get(`${apiUrl}/api/rooms`);
        setRooms(roomRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchBookingsAndRooms();
  }, []);

  // admin info
  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin"); // key depends on what you stored
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);
  // 🟢 Generate all days for confirmed bookings
  const getBookingDays = (booking) => {
    const start = new Date(booking.checkin);
    const end = new Date(booking.checkout);
    const days = [];
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      days.push({
        ...booking,
        day: new Date(d),
      });
    }
    return days;
  };

  // Flatten all confirmed bookings into individual days
  const propertyDays = bookings
    .filter((b) => b.status === "confirmed")
    .flatMap((b) => getBookingDays(b));

  const sortedPropertyDays = propertyDays.sort((a, b) => a.day - b.day);
  const displayPropertyDays = sortedPropertyDays;


  // Helper: Get "time ago" string
  const getTimeAgo = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;

    const minutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };


  return (
    <main className="min-h-screen bg-gray-50 md:ml-64 px-4 py-6 transition-all duration-300">
      <div className="flex flex-col lg:flex-row justify-center items-start gap-10">
        {/* LEFT SIDE: Calendar */}
        <div className="w-full lg:max-w-3xl">
          {/* Search + Notification */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center bg-white border rounded-full px-4 py-2 w-full max-w-md shadow-sm">
              <Search className="text-gray-400 w-4 h-4 mr-2" />
              <input
                type="text"
                placeholder="Search Here"
                className="w-full focus:outline-none text-gray-700 text-sm"
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="bg-white border rounded-full p-2 hover:bg-gray-100 shadow-sm">
                <SlidersHorizontal className="w-5 h-5 text-gray-700" />
              </button>
              <button className="bg-green-900 text-white rounded-lg p-2 shadow-md hover:bg-green-800">
                <Bell className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Calendar Container */}
          <div className="bg-green-900 text-white rounded-[30px] p-4 shadow-lg">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
              <h1 className="text-3xl font-bold">Calendar</h1>
              <p className="text-white text-sm opacity-80">{year}</p>
            </div>

            {/* Room & Month Selector */}
            <div className="flex flex-wrap items-center gap-6 mb-6">
              {/* Room Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowRooms(!showRooms)}
                  className="bg-green-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2"
                >
                  {selectedRoom || "Select Room"}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${showRooms ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {showRooms && (
                  <div className="absolute z-10 bg-white text-green-900 mt-2 rounded-lg shadow-lg w-44 max-h-64 overflow-y-auto">
                    {rooms.map((room) => (
                      <div
                        key={room._id}
                        onClick={() => {
                          setSelectedRoom(room.title);
                          setShowRooms(false);
                        }}
                        className={`px-4 py-2 cursor-pointer hover:bg-green-100 ${selectedRoom === room.title ? "font-semibold" : ""
                          }`}
                      >
                        {room.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Month Switcher */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setSelectedMonth(selectedMonth === 0 ? 11 : selectedMonth - 1)
                  }
                  className="bg-green-800 rounded-full p-1 hover:bg-green-700"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <span className="font-semibold text-lg">
                  {months[selectedMonth]}
                </span>
                <button
                  onClick={() =>
                    setSelectedMonth(selectedMonth === 11 ? 0 : selectedMonth + 1)
                  }
                  className="bg-green-800 rounded-full p-1 hover:bg-green-700"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 text-center">
              {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
                <div key={d} className="text-xs opacity-80 mb-1">
                  {d}
                </div>
              ))}

              {daysArray.map((day, i) =>
                day ? (
                  <div
                    key={i}
                    className="border border-green-600 rounded-lg p-2 h-16 flex flex-col items-center justify-center text-sm hover:bg-green-800 transition relative"
                  >
                    <p className="font-medium">{day}</p>
                    {propertyDays.some(
                      (b) =>
                        b.day.getDate() === day &&
                        b.day.getMonth() === selectedMonth
                    ) && (
                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-yellow-400"></span>
                      )}
                  </div>
                ) : (
                  <div key={i}></div>
                )
              )}
            </div>
          </div>
        </div>

        {/* 🧱 Right Sidebar Section */}
        <div className="w-full h-screen lg:w-[350px] bg-white rounded-2xl shadow-md p-6 space-y-6 overflow-y-auto">

          {/* Profile */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">{admin.name || "Property Manager"}</h2>
              <p className="text-sm text-gray-500">Property Manager</p>
            </div>
            <img
              src={
                admin.avatar
                  ? admin.avatar.startsWith("http")
                    ? admin.avatar
                    : `${apiUrl}${admin.avatar}`
                  : "https://i.pravatar.cc/100?img=10"
              }
              alt={admin.name || "Profile"}
              className="w-12 h-12 rounded-full object-cover"
            />
          </div>

          {/* Property On Hold */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">Property On Hold</h3>
              <MoreHorizontal className="text-gray-500 " />
            </div>

            {/* Small screens: grid layout */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:hidden">
              {displayPropertyDays.map((b, index) => (
                <div
                  key={index}
                  className="bg-green-900 text-white rounded-xl p-3 flex flex-col items-center"
                >
                  <p className="text-xs opacity-80 text-center">
                    {b.day.toLocaleString("default", { month: "short", year: "numeric" })}
                  </p>
                  <p className="text-2xl font-bold">{b.day.getDate()}</p>
                  <p className="text-center text-sm">
                    {b.selectedRooms && b.selectedRooms.length > 0
                      ? b.selectedRooms.map((r) => r.roomName).join(", ")
                      : b.roomName || b.roomNames || "N/A"}
                  </p>
                </div>
              ))}
            </div>

            {/* Large screens: horizontal scroll */}
            <div className="hidden md:flex items-center gap-3 overflow-x-auto">
              {displayPropertyDays.map((b, index) => (
                <div
                  key={index}
                  className="bg-green-900 text-white rounded-xl p-3 flex flex-col items-center min-w-[100px] flex-shrink-0"
                >
                  <p className="text-xs opacity-80 text-center">
                    {b.day.toLocaleString("default", { month: "long", year: "numeric" })}
                  </p>
                  <p className="text-2xl font-bold">{b.day.getDate()}</p>
                  <p className="text-center text-sm">
                    {b.selectedRooms && b.selectedRooms.length > 0
                      ? b.selectedRooms.map((r) => r.roomName).join(", ")
                      : b.roomName || b.roomNames || "N/A"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Requests */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">Recent Requests</h3>
              <MoreHorizontal className="text-gray-500 w-5 h-5" />
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {bookings
                .filter((b) => b.specialRequest && b.specialRequest.trim() !== "")
                .slice(0, showAllRequests ? undefined : 3)
                .map((b) => (
                  <div
                    key={b._id}
                    className="flex items-center gap-3 bg-green-900 text-white p-3 rounded-xl"
                  >
                    <img
                      src={
                        b.avatar
                          ? b.avatar.startsWith("http")
                            ? b.avatar
                            : `${apiUrl}${b.avatar}`
                          : "https://i.pravatar.cc/100?img=1"
                      }
                      alt={b.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{b.name}</p>
                      <p className="text-xs opacity-90">{b.specialRequest}</p>
                    </div>
                  </div>
                ))}

              {bookings.filter((b) => b.specialRequest && b.specialRequest.trim() !== "").length > 3 && (
                <button
                  onClick={() => setShowAllRequests(!showAllRequests)}
                  className="text-sm text-green-900 font-medium mt-2 hover:underline"
                >
                  {showAllRequests ? "Show Less" : "Show More..."}
                </button>
              )}

              {bookings.filter((b) => b.specialRequest && b.specialRequest.trim() !== "").length === 0 && (
                <p className="text-sm text-gray-500">No special requests</p>
              )}
            </div>
          </div>

          {/* Messages */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">Messages</h3>
              <MoreHorizontal className="text-gray-500 w-5 h-5" />
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {bookings
                .filter((b) => b.specialRequest && b.specialRequest.trim() !== "")
                .slice(0, showAllMessages ? undefined : 3)
                .map((b) => (
                  <div
                    key={b._id}
                    className="flex items-start gap-3 bg-green-900 text-white p-4 rounded-xl"
                  >
                    <img
                      src={
                        b.avatar
                          ? b.avatar.startsWith("http")
                            ? b.avatar
                            : `${apiUrl}${b.avatar}`
                          : "https://i.pravatar.cc/100?img=1"
                      }
                      alt={b.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{b.name}</p>
                      <div className="flex items-center gap-1 text-xs opacity-90">
                        <Clock className="w-3 h-3" />
                        {getTimeAgo(b.checkin)}
                      </div>
                      <p className="text-sm mt-2 opacity-95">{b.specialRequest}</p>
                    </div>
                  </div>
                ))}

              {bookings.filter((b) => b.specialRequest && b.specialRequest.trim() !== "").length > 3 && (
                <button
                  onClick={() => setShowAllMessages(!showAllMessages)}
                  className="text-sm text-green-900 font-medium mt-2 hover:underline"
                >
                  {showAllMessages ? "Show Less" : "Show More..."}
                </button>
              )}
            </div>
          </div>

        </div>

      </div>
    </main>
  );
};

export default Calendar;
