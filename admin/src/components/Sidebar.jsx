import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Calendar,
  Users,
  MessageSquare,
  List,
  BarChart3,
  Settings,
  UserCircle,
  LogOut,
  HelpCircle,
  BookOpen,
  Menu,
  X,
} from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const topMenu = [
    { name: "Bookings", icon: <BookOpen />, path: "/" },
    { name: "Calendar", icon: <Calendar />, path: "/calendar" },
    { name: "Guests", icon: <Users />, path: "/guests" },
    { name: "Message", icon: <MessageSquare />, path: "/messages" },
    { name: "Listing", icon: <List />, path: "/listing" },
    // { name: "Analytics", icon: <BarChart3 />, path: "/analytics" },
    // { name: "Settings", icon: <Settings />, path: "/settings" },
  ];

  const bottomMenu = [
    { name: "My Account", icon: <UserCircle />, path: "/account" },
    { name: "Sign Out", icon: <LogOut />, path: "/account" },
    { name: "Help", icon: <HelpCircle />, path: "/help" },
  ];

  return (
    <>
      {/* ✅ Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-white border-b shadow-sm z-50 flex items-center justify-between px-4 py-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* ✅ Sidebar (Always Fixed) */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r shadow-md flex flex-col justify-between transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } overflow-hidden`}
      >
        {/* Logo */}
        <div className="relative flex items-center justify-center mt-16 md:mt-6 mb-5 space-x-2">
          <img
            src="/assets/home__logo--white.png"
            alt="Baan Nimbus Logo Shadow"
            className="absolute h-10 md:h-20 object-contain invert opacity-90"
          />
          <img
            src="/assets/home__logo--white.png"
            alt="Baan Nimbus Logo"
            className="relative h-10 md:h-20 object-contain"
          />
        </div>

        {/* Top Menu */}
        <nav className="flex-1 px-4 space-y-5 overflow-y-auto">
          {topMenu.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path === "/" && location.pathname === "/bookings");
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-green-800 text-white"
                    : "text-gray-700 hover:bg-green-100"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <span className="w-5 h-5">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Menu */}
        <div className="border-t p-4 space-y-3">
          {bottomMenu.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-green-100"
              onClick={() => setIsOpen(false)}
            >
              <span className="w-5 h-5">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </div>
      </aside>

      {/* ✅ Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm md:hidden z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
