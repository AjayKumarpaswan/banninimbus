import React from 'react'
import { Route,Routes, useLocation } from 'react-router-dom'
import Home from './components/Home'
import Header from './components/Header'
import Rooms from './components/Rooms'
import Login from './components/Login'
import Register from './components/Register'
import Booking from './components/Booking'
import Reservation from './components/Reservation'
import Roomheader from './components/Roomheader'
import PaymentButton from './components/PaymentButton'
import BookingStep from './components/BookingStep'
import Nextstep from './components/Nextstep'
import Payment from './components/Payment'
import Confirmbooking from './components/Confirmbooking'

 
const App = () => {
  return (
   <>
<Header/>
    <Routes>
      {/* <Route path="/" element={<PaymentButton/>} /> */}
      {/* <Route path="/" element={<Home/>} /> */}
      <Route path="/" element={<Rooms/>} />

    {/* <Route path="/rooms" element={<Rooms/>}/> */}
    <Route path="/roomheader" element={<Roomheader />} />
       {/* <Route path="/login" element={<Login />} />*/}
        <Route path="/register" element={<Register />} /> 
        <Route path="/booking" element={<Booking/>}/>
        <Route path="/reservation" element={<Reservation/>}/>
        <Route path="/booking-step" element={<BookingStep />} />
        <Route path="/next-step" element={<Nextstep />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/booking-confirm" element={<Confirmbooking />} />
        


    </Routes>
  
    </>
  )
}

export default App