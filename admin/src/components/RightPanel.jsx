import React from "react";

const RightPanel = () => {
  return (
    <aside className="hidden lg:flex flex-col w-72 bg-white border-l shadow-sm p-5 space-y-6">
      {/* Profile Section */}
      <div className="flex items-center gap-3">
        <img
          src="https://i.pravatar.cc/60?img=2"
          alt="Ajay Kumar"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h3 className="font-semibold text-gray-800">Ajay Kumar</h3>
          <p className="text-sm text-gray-500">Property Manager</p>
        </div>
      </div>

      {/* Property On Hold */}
      <div>
        <h4 className="font-semibold text-gray-800 mb-3">Property On Hold</h4>
        <div className="flex gap-3">
          <div className="bg-green-900 text-white rounded-lg p-3 text-center flex-1">
            <p className="text-xs">2024 December</p>
            <p className="text-2xl font-bold">20</p>
            <p className="text-sm">Saeng Chan</p>
          </div>
          <div className="bg-green-900 text-white rounded-lg p-3 text-center flex-1">
            <p className="text-xs">2024 December</p>
            <p className="text-2xl font-bold">22</p>
            <p className="text-sm">Taantawan</p>
          </div>
        </div>
      </div>

      {/* Recent Requests */}
      <div>
        <h4 className="font-semibold text-gray-800 mb-3">Recent Request</h4>
        <div className="space-y-2">
          {[
            { name: "Ankit Pandey", action: "Extra Bed", img: 1 },
            { name: "Mathew", action: "Dirty Bedsheet", img: 2 },
            { name: "Balaji", action: "Early Check IN", img: 3 },
          ].map((r) => (
            <div
              key={r.name}
              className="flex items-center gap-3 bg-green-900 text-white rounded-lg p-2"
            >
              <img
                src={`https://i.pravatar.cc/50?img=${r.img}`}
                alt={r.name}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="text-sm font-medium">{r.name}</p>
                <p className="text-xs text-green-100">{r.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Section */}
      <div>
        <h4 className="font-semibold text-gray-800 mb-3">Message</h4>
        <div className="bg-green-900 text-white rounded-lg p-3">
          <div className="flex items-center gap-3 mb-2">
            <img
              src="https://i.pravatar.cc/50?img=2"
              alt="Mathew"
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="font-medium text-sm">Mathew</p>
              <p className="text-xs opacity-80">1 Minute Ago</p>
            </div>
          </div>
          <p className="text-sm opacity-90 leading-snug">
            Please change the bedsheet as it is dirty and not been changed
          </p>
        </div>
      </div>
    </aside>
  );
};

export default RightPanel;
