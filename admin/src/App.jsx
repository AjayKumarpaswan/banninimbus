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
          <ProtectedAdminRoute>
            <DashboardLayout>
              <BookingCard />
            </DashboardLayout>
          </ProtectedAdminRoute>
        }
      />

      <Route
        path="/calendar"
        element={
          <ProtectedAdminRoute>
            <DashboardLayout>
              <Calender />
            </DashboardLayout>
          </ProtectedAdminRoute>
        }
      />

      <Route
        path="/listing"
        element={
          <ProtectedAdminRoute>
            <DashboardLayout>
              <Listing />
            </DashboardLayout>
          </ProtectedAdminRoute>
        }
      />

      <Route
        path="/messages"
        element={
          <ProtectedAdminRoute>
            <DashboardLayout>
              <Message />
            </DashboardLayout>
          </ProtectedAdminRoute>
        }
      />

      <Route
        path="/guests"
        element={
          <ProtectedAdminRoute>
            <DashboardLayout>
              <Guest />
            </DashboardLayout>
          </ProtectedAdminRoute>
        }
      />

      <Route
        path="/help"
        element={
          <ProtectedAdminRoute>
            <DashboardLayout>
              <Help />
            </DashboardLayout>
          </ProtectedAdminRoute>
        }
      />

      <Route
        path="/logout"
        element={
          <ProtectedAdminRoute>
            <DashboardLayout>
              <SignOut />
            </DashboardLayout>
          </ProtectedAdminRoute>
        }
      />

      <Route
        path="/account"
        element={
          <ProtectedAdminRoute>
            <DashboardLayout>
              <MyAccount />
            </DashboardLayout>
          </ProtectedAdminRoute>
        }
      />

    </Routes>
  );
};

export default App;
