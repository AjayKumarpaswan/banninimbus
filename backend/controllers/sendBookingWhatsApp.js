import twilio from "twilio";

export const sendBookingWhatsApp = async (req, res, skipResponse = false) => {
  try {
    const booking = req.body;
    const selectedRooms = booking.selectedRooms || [];

    // Room names separated by commas
    const roomNames = selectedRooms.map(r => r.roomName).join(", ");

    const checkinDate = new Date(booking.checkin).toLocaleDateString("en-IN");
    const checkoutDate = new Date(booking.checkout).toLocaleDateString("en-IN");

    const nights = Math.max(
      1,
      Math.ceil(
        (new Date(booking.checkout) - new Date(booking.checkin)) /
        (1000 * 60 * 60 * 24)
      )
    );

    // Total base rate for all rooms
    const baseTotal = selectedRooms.reduce(
      (sum, room) => sum + (Number(room.price?.replace(/[^0-9]/g, "")) || 0),
      0
    );

    const extraChildCharge = booking.extraChildCharge || 0;
    const gstRate = 0.18;
    const seasonalDiscount = 0;

    const totalBaseAmount = nights * baseTotal + nights * extraChildCharge;
    const taxes = totalBaseAmount * gstRate;
    const totalAmount = totalBaseAmount + taxes;

    // Create WhatsApp message
    const messageBody = `
📢 *Booking Confirmation*

Hello *${booking.name}*,  
Thank you for booking *${roomNames}* with *Baan Nimbus*! 🌿  

📅 *Check-in:* ${checkinDate}  
📅 *Check-out:* ${checkoutDate}  
🛏️ *Rooms:* ${roomNames}  
👨‍👩‍👧 *Guests:* ${booking.adults} Adults, ${booking.kids} Kids  
🐾 *Pets:* ${booking.pets || "No"}  
🧾 *Special Request:* ${booking.specialRequest || "None"}  

💰 *Price Summary:*  
- Rooms: ₹${(nights * baseTotal).toLocaleString("en-IN")}  
- Extra Child Charges: ₹${(nights * extraChildCharge).toLocaleString("en-IN")}  
- Taxes & Fees (18% GST): ₹${taxes.toLocaleString("en-IN", { minimumFractionDigits: 2 })}  
*Total Amount:* ₹${totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}  

*Policies:*  
- Non-cancellable and non-refundable  
- Dates can be changed once (subject to availability)  

For support, contact us at +91 8800990063.  
We look forward to hosting you! 🌴
`;

    // Initialize Twilio client
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    // Send WhatsApp message
    const response = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER, // Twilio sandbox number
      to: `whatsapp:+91${booking.phone}`, // customer's phone number with country code
      body: messageBody,
    });

    console.log("WhatsApp message sent:", response.sid);

    if (!skipResponse) {
      return res.status(200).json({ message: "Booking WhatsApp message sent successfully!" });
    }
  } catch (error) {
    console.error("WhatsApp send error:", error);
    res.status(500).json({ message: "Failed to send WhatsApp message", error });
  }
};
