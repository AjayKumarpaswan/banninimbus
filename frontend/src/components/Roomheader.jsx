import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
const Roomheader = () => {
  const location = useLocation();
  const formData = location.state || {
    room: "",
    checkin: "",
    checkout: "",
    adults: "",
    kids: "",
    pets: "",
    capacity: "",
    noOfRooms: "",
  };

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch all rooms from backend (no filtering)
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/rooms`);
        setRooms(res.data || []);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return (
    <section className="min-h-screen bg-[#f8f8f8] px-4 md:px-20 py-5 font-sans text-gray-800">
      <h1 className="text-3xl font-semibold mb-10 text-center">Our Rooms</h1>

      {/* 🔹 Loader or Empty State */}
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
          />
        ))
      )}
    </section>
  );
};

// ✅ Room Card
const RoomCard = ({
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
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // 🔹 Auto-slide every 4 seconds
  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [images.length]);

  const currentImage = useMemo(() => images[currentIndex], [images, currentIndex]);

  const handleBookNow = () => {
    navigate("/reservation", {
      state: {
        title,
        rating,
        price,
        description,
        images,
        includes,
        policy,
        features,
        index,
        ...formData,
      },
    });
  };

  return (
    <div className="bg-white border border-gray-300 rounded-xl p-6 flex flex-col md:flex-row gap-8 mb-10 shadow-sm hover:shadow-md transition-all duration-300">
      {/* 🔹 Left - Image Carousel */}
        <div className="relative w-full md:w-[550px] h-auto overflow-hidden rounded-lg">
        {images && images.length > 0 ? (
          <>
            <img
              src={`${apiUrl}${images[currentIndex]}`}
              alt={title}
              className="w-full h-auto object-cover transition-all duration-700 rounded-lg"
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

      {/* 🔹 Right - Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-semibold tracking-wide">
              {title}{" "}
              <span className="text-gray-500 font-normal">
                | {String(index + 1).padStart(2, "0")}
              </span>
            </h2>
            <p className="flex items-center text-sm">
              <span className="text-black text-lg mr-1">★★★★★</span>{" "}
              {rating || "—"}
            </p>
          </div>

          <p className="mt-3 text-gray-700 leading-relaxed text-[15px]">
            {description}
          </p>

          <div className="grid md:grid-cols-2 gap-4 my-5">
            <div className="border border-gray-300 rounded-md p-3 text-sm bg-gray-50">
              <p className="font-semibold mb-1">What’s Included</p>
              <ul className="list-disc list-inside space-y-1">
                {includes.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="border border-gray-300 rounded-md p-3 text-sm bg-gray-50">
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

        <div className="flex justify-between items-center mt-6">
          <p className="text-lg font-semibold">{price}</p>
          {/* <button
            onClick={handleBookNow}
            className="bg-green-900 text-white px-6 py-2 rounded-md hover:bg-green-800 transition"
          >
            BOOK NOW
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default Roomheader;
