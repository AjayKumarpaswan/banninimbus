import React from "react";
import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import BookingCard from "./components/BookingCard";
import Calender from "./components/Calender";
import Listing from "./components/Listing";
import Message from "./components/Message";
import Guest from "./components/Guest";
import MyAccount from "./components/MyAccount";
import SignOut from "./components/SignOut";
import Help from "./components/Help";

const App = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
     <Sidebar /> 

      {/* Main Content Area */}
      <div className="flex-1  mt-14 md:mt-0 p-4">
        <Routes>
         <Route path="/" element={<BookingCard />} />
        <Route path="/calendar" element={<Calender/>} />
          <Route path="/listing" element={<Listing/>} />
          <Route path="/messages" element={<Message/>} />
          <Route path="/guests" element={<Guest/>} />
          <Route path="/account" element={<MyAccount/>}/>
          <Route path="/logout"element={<SignOut/>}/> 
          <Route path="/help" element={<Help/>} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
