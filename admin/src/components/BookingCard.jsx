import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  SlidersHorizontal,
  Bell,
  MoreHorizontal,
  Clock,
  X,
} from "lucide-react";

const BookingCard = () => {
  const [bookings, setBookings] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const [showAllRequests, setShowAllRequests] = useState(false);
  const [showAllMessages, setShowAllMessages] = useState(false);
// ADD THIS
const [selectedBooking, setSelectedBooking] = useState(null);
const [showGuestModal, setShowGuestModal] = useState(false);

  const [admin, setAdmin] = useState({ name: "", avatar: "" });



  const [rooms, setRooms] = useState([]); // 🟢 store room list
  const [showModal, setShowModal] = useState(false); // 🟢 Modal toggle state
  const [formData, setFormData] = useState({
    roomName: "",
    name: "",
    email: "",
    phone: "",
    checkin: "",
    checkout: "",
    adults: "",
    kids: "",
    pets: "",
    specialRequest: "",
  });

  useEffect(() => {
    const fetchBookingsAndRooms = async () => {
      try {
        // ✅ Fetch admin bookings
        const adminRes = await axios.get("http://localhost:5000/api/abookings");

        // ✅ Fetch regular bookings
        const userRes = await axios.get("http://localhost:5000/api/bookings");

        // ✅ Combine both bookings
        const combinedBookings = [...adminRes.data, ...userRes.data];
        setBookings(combinedBookings);

        // ✅ Fetch rooms
        const roomRes = await axios.get("http://localhost:5000/api/rooms");
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


  // 🧩 Handle Form Input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  // 🧩 Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1️⃣ Create booking
      const res = await axios.post("http://localhost:5000/api/abookings", formData);

      // 2️⃣ Update room status to unavailable
      const selectedRoom = rooms.find(room => room.title === formData.roomName);
      if (selectedRoom) {
        await axios.put(`http://localhost:5000/api/rooms/${selectedRoom._id}/status`, {
          status: "unavailable",
        });

        // ✅ Update local room state so UI updates instantly
        setRooms(prev =>
          prev.map(room =>
            room._id === selectedRoom._id ? { ...room, status: "unavailable" } : room
          )
        );
      }

      // 3️⃣ Add booking to state so UI updates
      setBookings(prev => [res.data, ...prev]);

      setShowModal(false);
      setFormData({
        roomName: "",
        name: "",
        email: "",
        phone: "",
        checkin: "",
        checkout: "",
        adults: "",
        kids: "",
        pets: "",
        specialRequest: "",
      });

      alert("✅ Booking Created Successfully!");
    } catch (err) {
      console.error("Error creating booking:", err);
      alert("❌ Failed to create booking. Please try again.");
    }
  };


  //for cancel booking
  const handleDeleteBooking = async (bookingId, roomName) => {
    // ✅ Ask user for confirmation first
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this booking? This action cannot be undone."
    );

    if (!confirmDelete) {
      // User clicked Cancel
      return;
    }

    try {
      // ✅ Try deleting from admin bookings
      try {
        await axios.delete(`http://localhost:5000/api/abookings/${bookingId}`);
      } catch (err) {
        // ignore if not found in admin bookings
      }

      // ✅ Try deleting from user bookings
      try {
        await axios.delete(`http://localhost:5000/api/bookings/${bookingId}`);
      } catch (err) {
        // ignore if not found in user bookings
      }

      // ✅ Remove booking from frontend state
      setBookings(prev => prev.filter(b => b._id !== bookingId));

      // ✅ Update room status to available
      const deletedRoom = rooms.find(room => room.title === roomName);
      if (deletedRoom) {
        await axios.put(`http://localhost:5000/api/rooms/${deletedRoom._id}/status`, {
          status: "available",
        });

        setRooms(prev =>
          prev.map(room =>
            room._id === deletedRoom._id ? { ...room, status: "available" } : room
          )
        );
      }

      alert("✅ Booking deleted successfully!");
    } catch (err) {
      console.error("Error deleting booking:", err);
      alert("❌ Failed to delete booking. Please try again.");
    }
  };




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

  const handleGuestClick = (booking) => {
  setSelectedBooking(booking);   // store data
  setShowGuestModal(true);       // open modal
};


  return (

    <main className="min-h-screen bg-gray-50 md:ml-80 transition-all duration-300">

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
        {/* 🟢 Left Section */}
        <div className="w-full lg:max-w-2xl">
          {/* Search + Notification */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center bg-white border rounded-full px-4 py-2 w-full max-w-md shadow-sm">
              <Search className="text-gray-400 w-4 h-4 mr-2" />
              <input
                type="text"
                placeholder="Search Here"
                className="w-full focus:outline-none text-gray-700 text-sm"
              />
            </div>

            <div className="flex items-center gap-3 ml-3">
              <button className="bg-white border rounded-full p-2 hover:bg-gray-100 shadow-sm">
                <SlidersHorizontal className="w-5 h-5 text-gray-700" />
              </button>
              <button className="bg-green-900 text-white rounded-lg p-2 shadow-md hover:bg-green-800">
                <Bell className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Booking List Section */}
          <div className="bg-green-900 text-white rounded-[30px] p-4 shadow-lg">
            <div className="flex flex-wrap items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Booking</h1>
              <div className="flex gap-3 mt-3 md:mt-0">
                <button
                  className="bg-white text-green-900 px-4 py-2 rounded-full font-medium shadow hover:bg-gray-100 transition"
                  onClick={() => setShowModal(true)} // 🟢 Open modal
                >
                  Create Booking
                </button>
                <button
                  className="bg-green-800 px-4 py-2 rounded-full font-medium hover:bg-green-700 transition"
                  onClick={() => setShowCancelModal(true)}
                >
                  Cancel Booking
                </button>

              </div>
            </div>

            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  onClick={() => handleGuestClick(booking)} 
                  className="border border-green-400 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-green-800 transition"
                >
                  <div>
                    <p className="text-xs opacity-80 mb-1">
                      Booking Id{" "}
                      <span className="font-medium">
                        #{booking._id.slice(-6)}
                      </span>
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-1">
                      <img
                        src={
                          booking.avatar
                            ? booking.avatar.startsWith("http")
                              ? booking.avatar
                              : `http://localhost:5000${booking.avatar}`
                            : booking.images && booking.images.length > 0
                              ? `http://localhost:5000${booking.images[0]}`
                              : "https://i.pravatar.cc/150?img=1"
                        }
                        alt={booking.name}
                        className="w-8 h-8 rounded-full object-cover border border-white"
                      />
                      <p className="font-semibold">{booking.name}</p>
                      <span className="opacity-80">|</span>
                      <p>
                        {booking.selectedRooms && booking.selectedRooms.length > 0
                          ? booking.selectedRooms.map((r) => r.roomName).join(", ")
                          : booking.roomName || booking.roomNames || "N/A"}
                      </p>

                      <span className="opacity-80">|</span>
                      <p className="text-sm opacity-90">
                        {new Date(booking.checkin).toLocaleDateString()} -{" "}
                        {new Date(booking.checkout).toLocaleDateString()}
                      </p>
                      <span className="opacity-80">|</span>
                      <p className="font-semibold">
                        {booking.adults + booking.kids}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
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
                    : `http://localhost:5000${admin.avatar}`
                  : "https://i.pravatar.cc/100?img=10"
              }
              alt={admin.name || "Profile"}
              className="w-12 h-12 rounded-full object-cover"
            />

          </div>
          {/* property on hold */}
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



          {/* Recent Request / Special Requests */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">Recent Requests</h3>
              <MoreHorizontal className="text-gray-500 w-5 h-5" />
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {bookings
                .filter((b) => b.specialRequest && b.specialRequest.trim() !== "")
                .slice(0, showAllRequests ? undefined : 3) // show top 3 if collapsed
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
                            : `http://localhost:5000${b.avatar}`
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


          {/* Message */}
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
                            : `http://localhost:5000${b.avatar}`
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

      {/* 🟢 Create Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative shadow-xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold mb-4 text-green-900 text-center">
              Create New Booking
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Room Name
                </label>
                <select
                  name="roomName"
                  value={formData.roomName}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-600"
                >
                  <option value="">Select Room</option>
                  {rooms.map((room) => (
                    <option key={room._id} value={room.title} disabled={room.status === "unavailable"}>
                      {room.title} {room.status === "unavailable" ? "(Unavailable)" : ""}
                    </option>
                  ))}
                </select>


              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Guest Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-600"
                    placeholder="Full Name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-600"
                    placeholder="Phone Number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Check-In
                  </label>
                  <input
                    type="date"
                    name="checkin"
                    value={formData.checkin}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-600"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Check-Out
                  </label>
                  <input
                    type="date"
                    name="checkout"
                    value={formData.checkout}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Adults
                  </label>
                  <input
                    type="number"
                    name="adults"
                    value={formData.adults}
                    onChange={handleChange}
                    min="0"
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-600"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Kids
                  </label>
                  <input
                    type="number"
                    name="kids"
                    value={formData.kids}
                    onChange={handleChange}
                    min="0"
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-600"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Pets
                  </label>
                  <input
                    type="number"
                    name="pets"
                    value={formData.pets}
                    onChange={handleChange}
                    min="0"
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Special Request
                </label>
                <textarea
                  name="specialRequest"
                  value={formData.specialRequest}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-600"
                  placeholder="Enter any special requests"
                ></textarea>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="bg-green-900 text-white px-6 py-2 rounded-full font-medium hover:bg-green-800 transition"
                >
                  Submit Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* 🟢 Cancel Booking Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 relative shadow-xl">
            <button
              onClick={() => setShowCancelModal(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold mb-4 text-green-900 text-center">
              Cancel Bookings
            </h2>

            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="flex justify-between items-center border rounded-lg p-3"
                >
                  <div>
                    <p className="font-medium">{booking.name}</p>

                    <p className="text-sm opacity-80">
                      {booking.selectedRooms && booking.selectedRooms.length > 0
                        ? booking.selectedRooms.map((r) => r.roomName).join(", ")
                        : booking.roomName || booking.roomNames || "N/A"}
                    </p>
                    <p className="text-xs opacity-60">
                      {new Date(booking.checkin).toLocaleDateString()} -{" "}
                      {new Date(booking.checkout).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition"
                    onClick={() => handleDeleteBooking(booking._id, booking.roomName)}
                  >
                    Delete
                  </button>
                </div>
              ))}
              {bookings.length === 0 && <p className="text-gray-500 text-center">No bookings found</p>}
            </div>
          </div>
        </div>
      )}

{/* booking details of all guest */}
{showGuestModal && selectedBooking && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
    <div className="bg-white p-6 rounded-xl w-full max-w-lg">
      <h2 className="text-xl font-bold mb-4">Guest Details</h2>

      <p><strong>Name:</strong> {selectedBooking.name}</p>
      <p><strong>Email:</strong> {selectedBooking.email || "N/A"}</p>
      <p><strong>Phone:</strong> {selectedBooking.phone || "N/A"}</p>
      <p><strong>Rooms:</strong> {selectedBooking.roomNames || selectedBooking.roomName}</p>
      <p><strong>Check-in:</strong> {selectedBooking.checkin}</p>
      <p><strong>Check-out:</strong> {selectedBooking.checkout}</p>

      <button
        className="mt-4 bg-green-900 text-white px-4 py-2 rounded-lg"
        onClick={() => setShowGuestModal(false)}
      >
        Close
      </button>
    </div>
  </div>
)}

    </main>
  );
};

export default BookingCard;
