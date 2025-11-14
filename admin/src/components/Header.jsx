import React from "react";
import { Search, Bell, SlidersHorizontal } from "lucide-react";

const Header = ({ toggle }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-sm">
      <div className="flex items-center gap-3">
        <button className="md:hidden" onClick={toggle}>
          <SlidersHorizontal className="w-6 h-6 text-gray-700" />
        </button>
        <div className="relative">
          <input
            type="text"
            placeholder="Search Here"
            className="pl-10 pr-4 py-2 w-72 bg-gray-100 border rounded-full text-sm focus:ring-2 focus:ring-green-600 outline-none"
          />
          <Search className="absolute left-3 top-2.5 text-gray-500 w-5 h-5" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 bg-green-100 rounded-full">
          <Bell className="w-5 h-5 text-green-700" />
        </button>
        <div className="flex items-center gap-2">
          <img
            src="/assets/user.jpg"
            alt="User"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="text-right">
            <p className="font-semibold text-sm">Ajay Kumar</p>
            <p className="text-xs text-gray-500">Property Manager</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
