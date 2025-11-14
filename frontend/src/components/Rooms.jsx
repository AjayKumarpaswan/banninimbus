import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Rooms = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const formData = location.state || {
    room: "",
    checkin: "",
    checkout: "",
    adults: "02",
    kids: "02",
    pets: "01",
    status: "",
  };

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ store multiple selected rooms
  const [selectedRooms, setSelectedRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/rooms");
        setRooms(res.data || []);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  // ✅ Calculate totals dynamically
  const totals = useMemo(() => {
    const totalAdults = selectedRooms.reduce((sum, r) => sum + r.adults, 0);
    const totalKids = selectedRooms.reduce((sum, r) => sum + r.kids, 0);
    const totalPets = selectedRooms.reduce((sum, r) => sum + r.pets, 0);
    const roomNames = selectedRooms.map((r) => r.roomName).join(", ");
    return { totalAdults, totalKids, totalPets, roomNames };
  }, [selectedRooms]);

  return (
    <section className="min-h-screen px-4 md:px-20 py-5 font-sans text-gray-800">
      <h1 className="text-3xl font-semibold mb-10 text-center">Our Rooms</h1>

      {/* 🟢 TOP BAR (visible if at least one room selected) */}
      {selectedRooms.length > 0 && (
        <div className="rounded-lg px-6 py-3 mb-6 shadow-sm flex flex-wrap justify-center items-center gap-4 bg-white border">
          <div className="flex flex-wrap gap-2 md:gap-4 items-center justify-center">
            {[
              { label: "Adults", value: String(totals.totalAdults).padStart(2, "0") },
              { label: "Kids", value: String(totals.totalKids).padStart(2, "0") },
              { label: "Pets", value: String(totals.totalPets).padStart(2, "0") },
              { label: "Rooms", value: totals.roomNames || "—" },
            ].map((item, i) => (
              <div
                key={i}
                className="border border-gray-400 rounded-md px-5 py-2 flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <span className="text-gray-800 font-medium">{item.label}</span>
                <span className="text-gray-800 font-semibold">| {item.value}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() =>
              navigate("/booking-step", { state: { selectedRooms, totals } })
            }
            className="bg-[#063D2C] text-white px-6 py-2 rounded-md text-sm md:text-base hover:bg-green-800 transition"
          >
            PROCEED
          </button>
        </div>
      )}

      {/* 🏠 Room list */}
      {loading ? (
        <p className="text-center text-gray-500">Loading rooms...</p>
      ) : rooms.length === 0 ? (
        <p className="text-center text-gray-500">No rooms available.</p>
      ) : (
        rooms.map((room, index) => (
          <RoomCard
            key={room._id || index}
            {...room}
            index={index}
            formData={formData}
            selectedRooms={selectedRooms}
            setSelectedRooms={setSelectedRooms}
          />
        ))
      )}
    </section>
  );
};

// ✅ RoomCard component
const RoomCard = ({
  _id,
  images = [],
  title,
  rating,
  price,
  description,
  includes = [],
  policy = [],
  features = [],
  index,
  formData,
  selectedRooms,
  setSelectedRooms,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showGuestSelector, setShowGuestSelector] = useState(false);
  const navigate = useNavigate();

  const [guests, setGuests] = useState({
    adults: parseInt(formData.adults) || 2,
    kids: parseInt(formData.kids) || 0,
    pets: parseInt(formData.pets) || 0,
  });

  const isSelected = selectedRooms.some((r) => r.roomId === _id);

  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [images.length]);

const updateGuest = (type, delta) => {
  setGuests((prev) => ({
    ...prev,
    [type]: Math.max(0, Math.min(2, prev[type] + delta)),
  }));
};


  const handleSelectRoom = () => {
    setShowGuestSelector(true);
  };

  const handleConfirmRoom = () => {
    const roomDetails = {
      roomId: _id,
      adults: guests.adults,
      kids: guests.kids,
      pets: guests.pets,
      roomName: title,
      price,
      images,
      description,
      includes,
      policy,
      features,
    };

    if (isSelected) {
      // remove if already selected
      setSelectedRooms(selectedRooms.filter((r) => r.roomId !== _id));
    } else {
      // add to selected list
      setSelectedRooms([...selectedRooms, roomDetails]);
    }

    setShowGuestSelector(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row gap-8 mb-10 shadow-sm hover:shadow-md transition-all duration-300">
      {/* 🖼️ Left Image */}
      <div className="relative w-full md:w-[320px] overflow-hidden rounded-lg">
        {images && images.length > 0 ? (
          <>
            <img
              src={`http://localhost:5000${images[currentIndex]}`}
              alt={title}
              className="w-full h-[230px] object-cover transition-all duration-700 rounded-lg"
            />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 w-2 rounded-full ${
                    i === currentIndex
                      ? "bg-green-700 scale-110"
                      : "bg-gray-400 hover:bg-gray-500"
                  }`}
                />
              ))}
            </div>
          </>
        ) : (
          <img
            src="/assets/home-bg.jpg"
            alt="default"
            className="w-full h-[230px] object-cover rounded-lg"
          />
        )}
      </div>

      {/* 🧾 Right Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-semibold">
              {title}{" "}
              <span className="text-gray-500 text-sm font-normal">
                | Max Capacity 02
              </span>
            </h2>
            <p className="flex items-center text-sm">
              <span className="text-black text-lg mr-1">★★★★★</span>
              {rating || "—"}
            </p>
          </div>

          <p className="mt-2 text-gray-700 leading-relaxed">{description}</p>

          <div className="grid md:grid-cols-2 gap-4 my-5">
            <div className="border border-gray-300 rounded-lg p-3 text-sm bg-gray-50">
              <p className="font-semibold mb-1">What’s Included</p>
              <ul className="list-disc list-inside space-y-1">
                {includes.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="border border-gray-300 rounded-lg p-3 text-sm bg-gray-50">
              <p className="font-semibold mb-1">Family Policy</p>
              <ul className="list-disc list-inside space-y-1">
                {policy.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
            {features.map((f, i) => (
              <span key={i}>{f}</span>
            ))}
          </div>
        </div>

        {/* 💰 Price + Guests */}
        <div className="flex flex-wrap justify-between items-center mt-6">
          <p className="text-xl font-semibold">{price}</p>

          {!showGuestSelector ? (
            <button
              onClick={handleSelectRoom}
              className={`px-6 py-2 rounded-md transition ${
                isSelected
                  ? "bg-green-900 text-white"
                  : "bg-green-900 text-white hover:bg-green-800"
              }`}
            >
              {isSelected ? "Selected ✓" : "Select Room"}
            </button>
          ) : (
            <div className="flex flex-col items-end">
              <div className="border border-gray-300 rounded-lg p-3 bg-white flex flex-col gap-2">
                {["adults", "kids", "pets"].map((type) => (
                  <div
                    key={type}
                    className="flex justify-between items-center text-sm font-medium border-b last:border-none pb-1"
                  >
                    <span className="capitalize w-16">{type}</span>
                    <div className="flex items-center border border-gray-300 rounded px-2 py-0.5">
                      <span className="mx-2 w-4 text-center font-semibold">
                        {String(guests[type]).padStart(2, "0")}
                      </span>
                      <div className="flex flex-col">
                        <button
                          onClick={() => updateGuest(type, +1)}
                          className="text-xs text-gray-700 hover:text-green-800"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => updateGuest(type, -1)}
                          className="text-xs text-gray-700 hover:text-green-800"
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={handleConfirmRoom}
                className="mt-3 bg-green-900 text-white px-8 py-2 rounded-md hover:bg-green-800 transition"
              >
                {isSelected ? "Remove Room" : "Confirm"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rooms;
