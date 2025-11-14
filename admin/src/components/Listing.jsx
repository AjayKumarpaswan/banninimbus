import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Edit,
  Trash2,
  PlusCircle,
  Search,
  Bell,
  SlidersHorizontal,
} from "lucide-react";

const Listing = () => {
  const [rooms, setRooms] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [editingFiles, setEditingFiles] = useState([]); // new images to upload
  const [removedImages, setRemovedImages] = useState([]); // existing images marked for deletion


    const [admin, setAdmin] = useState({ name: "", avatar: "" });


  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [selectedRoomsToDelete, setSelectedRoomsToDelete] = useState([]);

  const [newRoom, setNewRoom] = useState({
    title: "",
    price: "",
    description: "",
    includes: [],
    policy: [],
    features: [],
    status: "available",
  });

  const handleEditClick = (room) => {
    setEditingRoom({ ...room }); // populate modal
    setEditingFiles([]); // reset new uploads
    setRemovedImages([]); // reset removed images
    setShowEditModal(true);
  };


  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/rooms/admin");
        setRooms(res.data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchRooms();
  }, []);

   // admin info
      useEffect(() => {
        const storedAdmin = localStorage.getItem("admin"); // key depends on what you stored
        if (storedAdmin) {
          setAdmin(JSON.parse(storedAdmin));
        }
      }, []);

  const RoomCarousel = ({ images, title }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      if (images.length > 1) {
        const interval = setInterval(() => {
          setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(interval);
      }
    }, [images.length]);

    if (!images || images.length === 0) {
      return (
        <img
          src="/assets/home-bg.jpg"
          alt="default"
          className="w-48 h-40 object-cover rounded-xl"
        />
      );
    }

    return (
      <div className="relative w-48 h-full rounded-xl overflow-hidden">
        <img
          src={`http://localhost:5000${images[currentIndex]}`}
          alt={`${title} - ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-all duration-700 rounded-xl"
        />
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-2 w-2 rounded-full ${i === currentIndex ? "bg-green-700 scale-110" : "bg-gray-400"
                }`}
            />
          ))}
        </div>
      </div>
    );
  };

  // ✅ Submit handler with multipart/form-data
  const handleAddRoom = async () => {
    try {
      const formData = new FormData();
      formData.append("title", newRoom.title);
      formData.append("price", newRoom.price);
      formData.append("description", newRoom.description);
      formData.append("status", newRoom.status);

      // Arrays as JSON strings
      formData.append("includes", JSON.stringify(newRoom.includes));
      formData.append("features", JSON.stringify(newRoom.features));
      formData.append("policy", JSON.stringify(newRoom.policy));

      // Images
      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      const res = await axios.post(
        "http://localhost:5000/api/rooms",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setRooms([res.data.room, ...rooms]);
      setShowAddModal(false);
      setNewRoom({
        title: "",
        price: "",
        description: "",
        includes: [],
        policy: [],
        features: [],
        status: "available",
      });
      setSelectedFiles([]);
      // ✅ Add this line
      alert("Room added successfully!");
    } catch (err) {
      console.error("Error adding room:", err);
    }
  };

  return (
    <>
      {/* Add Room Modal */}
      {/* Add Room Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-2xl rounded-2xl p-6 relative shadow-xl">
            <h2 className="text-2xl font-semibold mb-4">Add New Property</h2>

            {/* Close Button */}
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 font-bold"
            >
              ✕
            </button>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Title */}
              <input
                type="text"
                placeholder="Title"
                className="w-full border px-3 py-2 rounded-lg"
                value={newRoom.title}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, title: e.target.value })
                }
              />

              {/* Price */}
              <input
                type="text"
                placeholder="Price"
                className="w-full border px-3 py-2 rounded-lg"
                value={newRoom.price}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, price: e.target.value })
                }
              />

              {/* Description */}
              <textarea
                placeholder="Description"
                className="w-full border px-3 py-2 rounded-lg"
                rows={4}
                value={newRoom.description}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, description: e.target.value })
                }
              />

              {/* Includes */}
              <textarea
                placeholder="Includes (comma separated)"
                className="w-full border px-3 py-2 rounded-lg"
                rows={3}
                value={newRoom.includes.join(", ")}
                onChange={(e) =>
                  setNewRoom({
                    ...newRoom,
                    includes: e.target.value
                      .split(",")           // split by commas
                      .map((item) => item.trim()) // trim spaces
                      .filter((item) => item !== ""),
                  })
                }
              />



              {/* Policy */}
              <textarea
                placeholder="Policy (comma separated)"
                className="w-full border px-3 py-2 rounded-lg"
                rows={3}
                value={newRoom.policy.join(", ")}
                onChange={(e) => {
                  const input = e.target.value;

                  // Split commas that are not inside numbers
                  const items = input.split(/,(?=\s*[^\d₹])/).map(item => item.trim()).filter(item => item !== "");

                  setNewRoom({
                    ...newRoom,
                    policy: items,
                  });
                }}
              />


              {/* Features */}
              <textarea
                placeholder="Features (comma separated)"
                className="w-full border px-3 py-2 rounded-lg"
                rows={3}
                value={newRoom.features.join(", ")}
                onChange={(e) =>
                  setNewRoom({
                    ...newRoom,
                    features: e.target.value
                      .split(",")
                      .map((item) => item.trim())
                      .filter((item) => item !== ""),
                  })
                }
              />


              {/* Images */}
              <input
                type="file"
                multiple
                onChange={(e) =>
                  setSelectedFiles([...selectedFiles, ...e.target.files])
                }
                className="w-full border px-3 py-2 rounded-lg"
              />

              {/* Preview of selected images */}
              {selectedFiles.length > 0 && (
                <div className="grid grid-cols-4 gap-4 mt-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="relative w-full h-24 rounded-lg overflow-hidden border border-gray-300"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedFiles((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              className="mt-4 w-full bg-green-800 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition"
              onClick={handleAddRoom}
            >
              Add Property
            </button>
          </div>
        </div>
      )}


      {/* 🔝 Top Search + Filter + Notification + Profile Section */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-transparent mb-8 md:ml-64 gap-4 md:gap-0">
        {/* Left Section */}
        <div className="flex flex-1 items-center gap-2 md:gap-3 w-full md:max-w-xl">
          <div className="flex items-center bg-white rounded-full px-3 py-2 w-full shadow-sm">
            <Search className="text-gray-400 w-4 h-4 mr-2" />
            <input
              type="text"
              placeholder="Search Here"
              className="w-full focus:outline-none text-gray-700 text-sm"
            />
          </div>
          <button className="bg-white border rounded-full p-2 hover:bg-gray-100 shadow-sm">
            <SlidersHorizontal className="w-5 h-5 text-gray-700" />
          </button>
          <button className="bg-[#0d4a38] text-white rounded-lg p-2 shadow-md hover:bg-green-800">
            <Bell className="w-5 h-5" />
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center bg-white rounded-full px-3 py-2 shadow-md mt-2 md:mt-0">
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
      </div>

      <main className="min-h-screen bg-[#083d2e] text-white p-6 rounded-3xl md:ml-64 transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold">Property</h1>
          <div className="flex gap-3">
            <button
              className="bg-white text-[#083d2e] px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium hover:bg-gray-100 transition"
              onClick={() => setShowAddModal(true)}
            >
              <PlusCircle size={16} /> Add New Property
            </button>
           <button
  className="bg-white text-[#083d2e] px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium hover:bg-gray-100 transition"
  onClick={() => setShowDeleteModal(true)}
>
  <Trash2 size={16} /> Delete Property
</button>

          </div>
        </div>

        {/* Property Cards */}
        <div className="space-y-6">
          {rooms.map((room) => (
            <div
              key={room._id}
              className="bg-[#0d4a38] border border-gray-500 rounded-xl p-4 flex flex-col sm:flex-row gap-4"
            >
              <div className="flex-shrink-0">
                <RoomCarousel images={room.images} title={room.title} />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold tracking-wide flex items-center gap-2">
                    {room.title}{" "}
                    <span className="text-sm font-normal text-gray-300">
                      | Max Capacity 02
                    </span>
                  </h2>
                  <div className="text-sm text-gray-300">
                    Date Of Listing{" "}
                    {new Date(room.createdAt).toLocaleDateString("en-GB")}
                  </div>
                </div>

                <div className="mt-2">
                  <p className="text-sm text-gray-200">{room.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-300">
                      Property Registered Holder
                    </p>
                    <p className="text-gray-100">Owner Name</p>
                  </div>

                  <div>
                    <p className="font-medium text-gray-300">Property Price</p>
                    <p className="text-gray-100">{room.price} for Adults</p>
                    <p className="text-gray-100">₹2,500/night for Kids</p>
                  </div>

                  <div>
                    <p className="font-medium text-gray-300">Property Features</p>
                    <ul className="list-disc ml-4 text-gray-100">
                      {room.features.slice(0, 3).map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="font-medium text-gray-300">Includes</p>
                    <ul className="list-disc ml-4 text-gray-100">
                      {room.includes.slice(0, 3).map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 mt-4">
                  <button className="bg-white text-[#083d2e] text-sm px-3 py-1 rounded-full font-medium hover:bg-gray-100">
                    Property On Hold
                  </button>
                  <button
                    className="bg-white text-[#083d2e] text-sm px-3 py-1 rounded-full font-medium flex items-center gap-1 hover:bg-gray-100"
                    onClick={() => handleEditClick(room)}
                  >
                    <Edit size={14} /> Edit
                  </button>

                </div>
              </div>
            </div>
          ))}

          {rooms.length === 0 && (
            <p className="text-center text-gray-400 mt-10">
              No properties found.
            </p>
          )}
        </div>
      </main>

      {/* Add this inside your Listing component, after the main return JSX */}

      {/* Edit Room Modal */}
      {showEditModal && editingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-2xl rounded-2xl p-6 relative shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-4">Edit Property</h2>

            {/* Close Button */}
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 font-bold"
            >
              ✕
            </button>

            <div className="space-y-4">
              {/* Title */}
              <input
                type="text"
                placeholder="Title"
                className="w-full border px-3 py-2 rounded-lg"
                value={editingRoom.title}
                onChange={(e) =>
                  setEditingRoom({ ...editingRoom, title: e.target.value })
                }
              />

              {/* Price */}
              <input
                type="text"
                placeholder="Price"
                className="w-full border px-3 py-2 rounded-lg"
                value={editingRoom.price}
                onChange={(e) =>
                  setEditingRoom({ ...editingRoom, price: e.target.value })
                }
              />

              {/* Description */}
              <textarea
                placeholder="Description"
                className="w-full border px-3 py-2 rounded-lg"
                rows={4}
                value={editingRoom.description}
                onChange={(e) =>
                  setEditingRoom({ ...editingRoom, description: e.target.value })
                }
              />

              {/* Includes */}
              <textarea
                placeholder="Includes (comma separated)"
                className="w-full border px-3 py-2 rounded-lg"
                rows={3}
                value={editingRoom.includes.join(", ")}
                onChange={(e) =>
                  setEditingRoom({
                    ...editingRoom,
                    includes: e.target.value
                      .split(",")
                      .map((item) => item.trim())
                      .filter((item) => item !== ""),
                  })
                }
              />

              {/* Policy */}
              <textarea
                placeholder="Policy (comma separated)"
                className="w-full border px-3 py-2 rounded-lg"
                rows={3}
                value={editingRoom.policy.join(", ")}
                onChange={(e) =>
                  setEditingRoom({
                    ...editingRoom,
                    policy: e.target.value
                      .split(/,(?=\s*[^\d₹])/)
                      .map((item) => item.trim())
                      .filter((item) => item !== ""),
                  })
                }
              />

              {/* Features */}
              <textarea
                placeholder="Features (comma separated)"
                className="w-full border px-3 py-2 rounded-lg"
                rows={3}
                value={editingRoom.features.join(", ")}
                onChange={(e) =>
                  setEditingRoom({
                    ...editingRoom,
                    features: e.target.value
                      .split(",")
                      .map((item) => item.trim())
                      .filter((item) => item !== ""),
                  })
                }
              />

              {/* Status */}
              <select
                className="w-full border px-3 py-2 rounded-lg"
                value={editingRoom.status}
                onChange={(e) =>
                  setEditingRoom({ ...editingRoom, status: e.target.value })
                }
              >
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>

              {/* Existing Images */}
              <div className="grid grid-cols-4 gap-2">
                {editingRoom.images.map((img, index) => (
                  <div key={index} className="relative w-full h-24 rounded-lg overflow-hidden border border-gray-300">
                    <img
                      src={`http://localhost:5000${img}`}
                      alt={`room-${index}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setRemovedImages([...removedImages, img]);
                        setEditingRoom({
                          ...editingRoom,
                          images: editingRoom.images.filter((i) => i !== img),
                        });
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Images */}
              <input
                type="file"
                multiple
                onChange={(e) =>
                  setEditingFiles([...editingFiles, ...e.target.files])
                }
                className="w-full border px-3 py-2 rounded-lg"
              />
              {editingFiles.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {editingFiles.map((file, index) => (
                    <div key={index} className="relative w-full h-24 rounded-lg overflow-hidden border border-gray-300">
                      <img
                        src={URL.createObjectURL(file)}
                        alt="new"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setEditingFiles((prev) => prev.filter((_, i) => i !== index))
                        }
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              className="mt-4 w-full bg-green-800 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition"
              onClick={async () => {
                try {
                  const formData = new FormData();
                  formData.append("title", editingRoom.title);
                  formData.append("price", editingRoom.price);
                  formData.append("description", editingRoom.description);
                  formData.append("status", editingRoom.status);
                  formData.append("includes", JSON.stringify(editingRoom.includes));
                  formData.append("policy", JSON.stringify(editingRoom.policy));
                  formData.append("features", JSON.stringify(editingRoom.features));
                  formData.append("removeImages", JSON.stringify(removedImages)); // <-- FIXED NAME

                  // Add new images
                  editingFiles.forEach((file) => formData.append("images", file));

                  const res = await axios.put(
                    `http://localhost:5000/api/rooms/${editingRoom._id}`,
                    formData,
                    {
                      headers: { "Content-Type": "multipart/form-data" },
                    }
                  );

                  // ✅ Update room in state
                  setRooms((prev) =>
                    prev.map((room) =>
                      room._id === res.data.room._id ? res.data.room : room
                    )
                  );

                  setShowEditModal(false);
                  setEditingRoom(null);
                  setEditingFiles([]);
                  setRemovedImages([]);
                  alert("Room updated successfully!");
                } catch (err) {
                  console.error("Error updating room:", err);
                }
              }}

            >
              Save Changes
            </button>
          </div>
        </div>
      )}



{/* Delete Room Modal */}
{showDeleteModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white w-full max-w-md rounded-2xl p-6 relative shadow-xl">
      <h2 className="text-2xl font-semibold mb-4">Delete Properties</h2>

      {/* Close Button */}
      <button
        onClick={() => setShowDeleteModal(false)}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 font-bold"
      >
        ✕
      </button>

      {/* List of Rooms */}
      <div className="max-h-64 overflow-y-auto space-y-2 mb-4">
        {rooms.map((room) => (
          <label
            key={room._id}
            className="flex items-center justify-between bg-gray-100 p-2 rounded-lg cursor-pointer hover:bg-gray-200"
          >
            <span>{room.title}</span>
            <input
              type="checkbox"
              checked={selectedRoomsToDelete.includes(room._id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedRoomsToDelete([...selectedRoomsToDelete, room._id]);
                } else {
                  setSelectedRoomsToDelete(
                    selectedRoomsToDelete.filter((id) => id !== room._id)
                  );
                }
              }}
            />
          </label>
        ))}
      </div>

      {/* Delete Button */}
      <button
        onClick={async () => {
          if (selectedRoomsToDelete.length === 0) return alert("Select at least one room");

          const confirmDelete = window.confirm(
            `Are you sure you want to delete ${selectedRoomsToDelete.length} room(s)?`
          );
          if (!confirmDelete) return;

          try {
            await Promise.all(
              selectedRoomsToDelete.map((id) =>
                axios.delete(`http://localhost:5000/api/rooms/${id}`)
              )
            );

            setRooms(rooms.filter((room) => !selectedRoomsToDelete.includes(room._id)));
            setSelectedRoomsToDelete([]);
            setShowDeleteModal(false);
            alert("Selected room(s) deleted successfully!");
          } catch (err) {
            console.error("Error deleting rooms:", err);
            alert("Failed to delete rooms.");
          }
        }}
        className="w-full bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition"
      >
        Delete Selected
      </button>
    </div>
  </div>
)}


    </>
  );
};

export default Listing;
