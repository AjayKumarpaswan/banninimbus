import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
const Confirmbooking = () => {
    const location = useLocation();
    const bookingData = location.state || {};
    console.log("Confirmbooking data:", bookingData);

    const user = JSON.parse(localStorage.getItem("user")) || {};
    const selectedRooms = bookingData.selectedRooms || [];

    const roomNames = selectedRooms.map((r) => r.roomName).join(", ");

    // First room's first image for display
    const roomImage =
        selectedRooms[0]?.images?.[0]
            ? `${apiUrl}${selectedRooms[0].images[0]}`
            : "/assets/default-room.jpg";

    const checkinDate = new Date(bookingData.checkin);
    const checkoutDate = new Date(bookingData.checkout);
    const nights = Math.max(
        1,
        Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24))
    );

    // ✅ Calculate total base rate & extra child charges
    const baseTotal = selectedRooms.reduce(
        (sum, room) => sum + (Number(room.price?.replace(/[^0-9]/g, "")) || 0),
        0
    );

    // Total extra child charges from bookingData
    // Use bookingData.rooms which contains the correct extraChildCharge
    // Total extra child charges from bookingData
    const totalExtraChildCharge = bookingData.extraChildCharge || 0;
    console.log("totalExtraChildCharge", totalExtraChildCharge);




    const totalBaseAmount = nights * baseTotal + nights * totalExtraChildCharge;
    const taxes = totalBaseAmount * 0.18;
    const totalAmount = totalBaseAmount + taxes;

    bookingData.totalAmount = totalAmount;




    // Send booking email & mark rooms unavailable
    useEffect(() => {
        const markRoomUnavailable = async (roomId) => {
            try {
                await axios.put(`${apiUrl}/api/rooms/${roomId}/status`, {
                    status: "unavailable",
                });
                console.log(`✅ Room ${roomId} marked unavailable`);
            } catch (err) {
                console.error("Error updating room status:", err);
            }
        };

        if (bookingData.email) {
            axios
                .post(`${apiUrl}/api/send-booking-confirmation`, bookingData)
                .then((res) => {
                    console.log("📩 Booking confirmation email sent!");
                    selectedRooms.forEach((room) => markRoomUnavailable(room.roomId));
                })
                .catch((err) => console.error(err));
        }
    }, [bookingData.email, selectedRooms]);

    // Save booking to backend
    useEffect(() => {
        const saveBooking = async () => {
            if (!selectedRooms.length) return;

            const bookingPayload = {
                name: bookingData.name || user.name,
                email: bookingData.email || user.email,
                phone: bookingData.phone || user.phone,
                avatar: user.avatar || "",
                checkin: bookingData.checkin,
                checkout: bookingData.checkout,
                nights,
                paymentId: bookingData.paymentId,
                specialRequest: bookingData.specialRequest || "",
                totalAmount,
                advanceAmount: bookingData.advanceAmount || 0,       // ✅ ADD THIS
                remainingAmount: bookingData.remainingAmount || 0,   // ✅ ADD THIS

                adults: bookingData.adults || 0,
                kids: bookingData.kids || 0,
                kidsAges: bookingData.kidsAges || [],
                pets: bookingData.pets || 0,
                extraChildCharge: bookingData.extraChildCharge || 0,
                roomNames: selectedRooms.map(r => r.roomName).join(", "),
                selectedRooms: selectedRooms.map((r) => ({
                    roomId: r.roomId,
                    roomName: r.roomName,
                    price: Number(r.price?.replace(/[^0-9]/g, "")) || 0,
                    images: r.images || [],
                    extraChildCharge: r.extraChildCharge || 0,
                })),
                status: "confirmed",
            };


            console.log("Saving booking with payload:", bookingPayload);
            try {
                const res = await axios.post(
                    `${apiUrl}/api/bookings`,
                    bookingPayload
                );
                console.log("✅ Booking saved successfully:", res.data);
            } catch (err) {
                console.error("❌ Error saving booking:", err);
            }
        };

        saveBooking();
    }, [selectedRooms, totalAmount]);

    return (
        <section className="min-h-screen bg-[#F8F8F8] py-10 px-5 flex justify-center font-sans">
            <div className="max-w-5xl w-full bg-white border border-gray-300 rounded-[36px] overflow-hidden shadow-sm">
                {/* SUCCESS HEADER */}
                <div className="bg-[#063D2C] relative text-center text-white py-10 rounded-t-[36px]">
                    <div className="flex justify-center mb-4">
                        <div className="bg-white rounded-full p-2">
                            <CheckCircle2 size={40} className="text-[#063D2C]" />
                        </div>
                    </div>
                    <h2 className="text-[22px] font-semibold text-white">
                        Booking was completed successfully!
                    </h2>
                    <p className="text-sm mt-3 leading-relaxed max-w-2xl mx-auto text-gray-200 px-4">
                        Your reservation has been successfully confirmed. We've sent a
                        detailed confirmation email to{" "}
                        <a href={`mailto:${bookingData.email}`} className="text-white underline">
                            {bookingData.email}
                        </a>{" "}
                        with your booking details and receipt. Please check your inbox. Didn’t
                        receive the email? Feel free to contact us at{" "}
                        <a href="tel:8800990063" className="text-white underline">
                            8800990063
                        </a>{" "}
                        or{" "}
                        <a
                            href="mailto:support@baannimbus.in"
                            className="text-white underline"
                        >
                            support@baannimbus.in
                        </a>
                        .
                    </p>
                </div>

                {/* BOOKING SUMMARY */}
                <div className="p-10 space-y-6">
                    <h3 className="text-[20px] font-semibold text-gray-800 mb-3">
                        Booking Summary
                    </h3>

                    <div className="flex flex-col md:flex-row justify-between gap-8 border border-gray-300 rounded-[26px] p-6">
                        {/* LEFT SIDE: Image + Guest Info */}
                        <div className="flex flex-col md:flex-row gap-5 w-full md:w-1/2">
                            <img
                                src={roomImage}
                                alt={roomNames}
                                className="w-40 h-36 object-cover rounded-[10px] border border-gray-200"
                            />
                            <div className="flex flex-col justify-center space-y-2 text-[14px] text-gray-800">
                                <h4 className="text-lg font-bold text-gray-900">{roomNames}</h4>
                                <p>
                                    <span className="font-medium">Adults</span> | {bookingData.adults.toString().padStart(2, "0")}{" "}
                                    <span className="ml-2 font-medium">Kids</span> | {bookingData.kids.toString().padStart(2, "0")}{" "}
                                    <span className="ml-2 font-medium">Pets</span> | {bookingData.pets.toString().padStart(2, "0")}
                                </p>
                                <p>
                                    <span className="font-medium">Guest Details</span> | {bookingData.name || user.name}
                                </p>
                                <p>
                                    <span className="font-medium">Phone No.</span> | {bookingData.phone || user.phone}
                                </p>
                                <p>
                                    <span className="font-medium">Email Id.</span> | {bookingData.email || user.email}
                                </p>
                            </div>
                        </div>

                        {/* RIGHT SIDE: Price + Dates */}
                        <div className="w-full md:w-1/2 text-[14px] text-gray-800">
                            <div className="flex justify-between items-center mb-3">
                                <p>
                                    <span className="font-medium">Check-in</span> |{" "}
                                    {checkinDate.toLocaleDateString("en-IN")}
                                </p>
                                <p>
                                    <span className="font-medium">Check-Out</span> |{" "}
                                    {checkoutDate.toLocaleDateString("en-IN")}
                                </p>
                            </div>

                            <div>
                                <h5 className="font-semibold mb-2">Price details</h5>
                                <div className="space-y-1">
                                    {/* Base Room Charges */}
                                    <div className="flex justify-between">
                                        <p>{nights} Nights × ₹{baseTotal.toLocaleString()}</p>
                                        <p>₹{(nights * baseTotal).toLocaleString()}</p>
                                    </div>

                                    {/* Extra Child Charges */}
                                    {/* Extra Child Charges */}
                                    <div className="flex justify-between">
                                        <p>{nights} Nights × {totalExtraChildCharge}</p>
                                        <p>₹{(nights * totalExtraChildCharge).toLocaleString()}</p>
                                    </div>


                                    {/* Seasonal discount (static for now) */}
                                    <div className="flex justify-between">
                                        <p>Seasonal discount</p>
                                        <p>-₹0.00</p>
                                    </div>

                                    {/* Taxes */}
                                    <div className="flex justify-between">
                                        <p>Taxes & fees (18% GST)</p>
                                        <p>₹{taxes.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between font-medium text-blue-800">
                                    <p>Advance Amount</p>
                                    <p>₹{(bookingData.advanceAmount || 0).toLocaleString()}</p>
                                </div>

                                {/* Remaining Amount */}
                                <div className="flex justify-between font-medium text-red-800">
                                    <p>Remaining Amount</p>
                                    <p>₹{(bookingData.remainingAmount || 0).toLocaleString()}</p>
                                </div>

                                <hr className="my-2 border-gray-300" />

                                {/* Total Amount */}
                                <div className="flex justify-between font-semibold text-[15px]">
                                    <p>Total INR</p>
                                    <p>₹{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* POLICY SECTION */}
                    <div className="pt-6 space-y-3 text-[13px] text-gray-700 leading-relaxed">
                        <h4 className="font-semibold text-[14px]">
                            Change & Cancellation Policy
                        </h4>
                        <p>1. This booking is non-cancellable and non-refundable.</p>
                        <p>2. You may change your booking dates once, subject to availability.</p>

                        <h4 className="font-semibold text-[14px] pt-3">
                            Essential Guest Policies
                        </h4>
                        <ol className="list-decimal list-inside space-y-1">
                            <li>
                                Check-In / Check-Out: Check-in begins at 1:00 PM, and check-out is by 11:00 AM.
                            </li>
                            <li>
                                Payment: Full payment is required at booking. We accept all major credit cards,
                                UPI, and net banking.
                            </li>
                            <li>
                                Booking Changes: Bookings are non-refundable and non-cancellable. You may request
                                one date change up to 7 days before arrival.
                            </li>
                            <li>
                                Children & Pets: Children under 8 stay free. Pets are welcome with prior approval.
                            </li>
                            <li>
                                Conduct: Quiet hours are observed from 10 PM to 7 AM. Please respect fellow guests
                                and property rules.
                            </li>
                            <li>Damage & Liability: Guests are responsible for any damages during their stay.</li>
                            <li>No Smoking: Smoking inside rooms is not permitted.</li>
                        </ol>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Confirmbooking;
