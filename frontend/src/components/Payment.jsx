import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { User } from "lucide-react";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { paymentData, totals } = location.state;
  console.log("Payment Data:", paymentData);
  const [user] = useState(JSON.parse(localStorage.getItem("user")) || null);

  if (!paymentData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        <p>No booking details found. Please go back and fill the reservation form.</p>
      </div>
    );
  }

  // --- MULTI-ROOM LOGIC ---
  const roomNames = totals.roomNames; // already comma-separated

  // Calculate totals
 const checkinDate = new Date(paymentData.checkin);
const checkoutDate = new Date(paymentData.checkout);

const nights = Math.max(
  1,
  Math.ceil((checkoutDate.getTime() - checkinDate.getTime()) / (1000 * 60 * 60 * 24))
);


  // ✅ Fix extraChildCharge
const extraChildCharge = paymentData.extraChildCharge || 0;

const numericBaseRate = paymentData.selectedRooms.reduce((acc, room) => {
  const price = Number(room.price.replace(/[^0-9]/g, "")) || 0;
  return acc + price;
}, 0);

  console.log("extraChildCharge:", extraChildCharge);

  const gstRate = 0.18;
  const baseTotal = nights * numericBaseRate + nights * extraChildCharge;
  const taxes = baseTotal * gstRate;
  const totalAmount = baseTotal + taxes;

  // Images: show first room's first image
  const images =
    paymentData.selectedRooms[0]?.images || ["/assets/default-room.jpg"];

  const roomImage = images[0]
    ? `http://localhost:5000${images[0]}`
    : "/assets/default-room.jpg";

 

  // Load Razorpay script dynamically
  const loadScript = (src) =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  // Handle Razorpay payment
  const handlePayment = async (amount) => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!res) return alert("Razorpay SDK failed to load.");

    try {
      const orderRes = await fetch(
        "http://localhost:5000/api/payment/create-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount }),
        }
      );
      const data = await orderRes.json();
      if (!data.success) return alert("Failed to create Razorpay order");

      const options = {
        key: "rzp_test_RbAGuaW8eICYMe",
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Baan Nimbus",
        description: `Payment for ${roomNames}`,
        order_id: data.order.id,
        prefill: {
          name: user?.name || paymentData.name,
          email: user?.email || paymentData.email,
          contact: user?.phone || paymentData.phone,
          avatar: user?.avatar || paymentData.avatar,
        },
        theme: { color: "#063D2C" },
        handler: async (response) => {
          const verifyRes = await fetch(
            "http://localhost:5000/api/payment/verify",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            }
          );
          const verify = await verifyRes.json();
          if (verify.success) {
            alert("✅ Payment Successful!");
            navigate("/booking-confirm", {
              state: { ...paymentData, paymentId: response.razorpay_payment_id,totalAmount} // ✅ Add this line },
            });
          } else {
            alert("❌ Payment verification failed.");
          }
        },
      };
      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  return (
    <section className="min-h-screen bg-[#F2F2F2] py-10 px-6 flex justify-center font-sans">
      <div className="max-w-6xl w-full flex flex-col md:flex-row bg-white border border-gray-300 rounded-[40px] overflow-hidden shadow-sm">

        {/* LEFT SECTION */}
        <div className="md:w-[60%] w-full p-10 space-y-8">
          {/* STEP 1 */}
          <div className="flex items-center gap-3">
            <p className="text-[20px] font-semibold text-gray-900 leading-none">1.</p>
            <div className="flex items-center gap-2 text-gray-800 text-[15px] font-medium">
              <User className="text-gray-800" size={18} />
              <span>{paymentData.name}</span>
              <span className="text-gray-500">{paymentData.phone}</span>
            </div>
          </div>

          {/* STEP 2 */}
          <div>
            <p className="text-[20px] font-semibold text-gray-900 mb-4">2. YOUR RESERVATION</p>
            <div className="border border-gray-300 rounded-2xl p-5 space-y-4 text-gray-800 text-sm">
              <p>
                Guest Details for{" "}
                <span className="underline text-[#063D2C] font-medium">{roomNames}</span>
              </p>

              <p>
                Guest Details | <span className="text-gray-700">{paymentData.name}</span>
              </p>

              <div className="flex flex-wrap gap-2">
                <span className="border border-gray-400 px-3 py-1 rounded-md text-sm">
                  Adults | {totals.totalAdults.toString().padStart(2, "0")}
                </span>
                <span className="border border-gray-400 px-3 py-1 rounded-md text-sm">
                  Kids | {totals.totalKids.toString().padStart(2, "0")}
                </span>
                <span className="border border-gray-400 px-3 py-1 rounded-md text-sm">
                  Pets | {totals.totalPets.toString().padStart(2, "0")}
                </span>
              </div>

              <p>
                Special Request |{" "}
                <span className="text-gray-700">{paymentData.specialRequest || "None"}</span>
              </p>
              <p>Phone No. | {paymentData.phone}</p>
              <p>Email Id. | {paymentData.email}</p>
            </div>
          </div>

          {/* STEP 3 */}
          <div>
            <p className="text-[20px] font-semibold text-gray-900 mb-4">3. PAYMENT</p>
            <div className="border border-gray-300 rounded-2xl p-5 text-sm text-gray-800 space-y-6 relative">
              <p>Razor Pay</p>
              <div className="flex justify-center">
                <button
                  onClick={() => handlePayment(totalAmount)}
                  className="bg-[#063D2C] text-white text-[15px] px-12 py-2 rounded-md font-medium tracking-wide"
                >
                  Pay ₹{totalAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </button>
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-white rounded-full border border-gray-400 w-3 h-3"></div>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="md:w-[40%] w-full bg-white border-l border-gray-300 p-10 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[20px] font-semibold text-gray-900">{roomNames}</h2>
              <button className="bg-[#063D2C] text-white px-4 py-1 rounded-md text-sm">
                UPDATE
              </button>
            </div>

            <img
              src={roomImage}
              alt={roomNames}
              className="w-full h-auto object-cover rounded-lg mb-4"
            />

            <div className="text-gray-800 text-[13px] space-y-1">
              <p>Adults | {totals.totalAdults.toString().padStart(2, "0")}</p>
              <p>Kids | {totals.totalKids.toString().padStart(2, "0")}</p>
              <p>Pets | {totals.totalPets.toString().padStart(2, "0")}</p>

              <div className="flex justify-between mt-3 text-[13px]">
                <p>
                  Check-in |{" "}
                  {checkinDate.toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
                <p>
                  Check-Out |{" "}
                  {checkoutDate.toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-300 my-4"></div>

            <div className="text-sm text-gray-800 space-y-1">
              <div className="flex justify-between">
                <p>{nights} Nights × ₹{numericBaseRate.toLocaleString()}</p>
                <p>₹{(nights * numericBaseRate).toLocaleString()}</p>
              </div>
              <div className="flex justify-between">
                <p>{nights} Nights × ₹{extraChildCharge.toLocaleString()}</p>
                <p>₹{(nights * extraChildCharge).toLocaleString()}</p>
              </div>
              <div className="flex justify-between">
                <p>Seasonal discount</p>
                <p>–₹0.00</p>
              </div>
              <div className="flex justify-between">
                <p>Taxes & fees (18% GST)</p>
                <p>₹{taxes.toLocaleString()}</p>
              </div>

              <div className="border-t border-gray-300 my-3"></div>

              <div className="flex justify-between font-semibold text-gray-900 text-[15px]">
                <p>Total INR</p>
                <p>₹{totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-[11px] text-gray-700 leading-relaxed">
            <h3 className="font-semibold mb-1">Change & Cancellation Policy</h3>
            <p>1. This booking is non-cancellable and non-refundable.</p>
            <p>2. You may change your booking dates once, subject to availability.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Payment;
