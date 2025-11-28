import React, { useState, useEffect } from "react";
import { User } from "lucide-react";

const MyAccount = () => {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("admin"));
    setAdmin(stored || null);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin");
    setAdmin(null);
  };

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center md:ml-60 p-4">
        <div className="bg-white shadow-xl rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-3">No Account Found</h2>
          <p className="text-gray-500 mb-3">Please login first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center md:ml-60 p-4">
      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-lg p-10 flex flex-col items-center text-center relative overflow-hidden">

        <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-100 rounded-full opacity-40 blur-2xl"></div>

        {/* Avatar */}
        <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-green-600 shadow-md mb-5">
          {admin.avatar ? (
            <img
              src={
                admin.avatar.startsWith("http")
                  ? admin.avatar
                  : `http://localhost:5000${admin.avatar}`
              }
              alt={admin.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-green-50">
              <User className="text-green-600" size={40} />
            </div>
          )}
        </div>

        {/* Info */}
        <h2 className="text-2xl font-semibold text-gray-800">{admin.name}</h2>
        <p className="text-gray-500">{admin.email}</p>
        {admin.phone && <p className="text-gray-500">{admin.phone}</p>}

        <div className="mt-4 px-4 py-1 bg-green-100 text-green-700 text-sm rounded-full capitalize">
          {admin.role}
        </div>

        <div className="w-16 border-t-2 border-gray-200 my-6"></div>

        <button
          onClick={handleLogout}
          className="px-6 py-2.5 bg-red-500 text-white rounded-full font-medium shadow-md hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default MyAccount;
