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
import Signup from "./components/Signup";
import Login from "./components/Login";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

// Layout WITH Sidebar
const DashboardLayout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 mt-14 md:mt-0 p-4">{children}</div>
    </div>
  );
};

// Layout WITHOUT Sidebar
const NoSidebarLayout = ({ children }) => {
  return <div className="p-4">{children}</div>;
};

const App = () => {
  return (
    <Routes>

      {/* =====================
          PUBLIC ROUTES
      ====================== */}
      <Route
        path="/signup"
        element={
          <NoSidebarLayout>
            <Signup />
          </NoSidebarLayout>
        }
      />

      <Route
        path="/"
        element={
          <NoSidebarLayout>
            <Login />
          </NoSidebarLayout>
        }
      />

      {/* =====================
          ADMIN PROTECTED ROUTES
      ====================== */}
      <Route
        path="/booking"
        element={
   
            <DashboardLayout>
              <BookingCard />
            </DashboardLayout>
      
        }
      />

      <Route
        path="/calendar"
        element={
          
            <DashboardLayout>
              <Calender />
            </DashboardLayout>
        
        }
      />

      <Route
        path="/listing"
        element={
        
            <DashboardLayout>
              <Listing />
            </DashboardLayout>
        
        }
      />

      <Route
        path="/messages"
        element={
         
            <DashboardLayout>
              <Message />
            </DashboardLayout>
       
        }
      />

      <Route
        path="/guests"
        element={
         
            <DashboardLayout>
              <Guest />
            </DashboardLayout>
          
        }
      />

      <Route
        path="/help"
        element={
         
            <DashboardLayout>
              <Help />
            </DashboardLayout>
       
        }
      />

      <Route
        path="/logout"
        element={
       
            <DashboardLayout>
              <SignOut />
            </DashboardLayout>
         
        }
      />

      <Route
        path="/account"
        element={
         
            <DashboardLayout>
              <MyAccount />
            </DashboardLayout>
         
        }
      />

    </Routes>
  );
};

export default App;
