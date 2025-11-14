import nodemailer from "nodemailer";

export const sendBookingEmail = async (req, res, skipResponse = false) => {
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

    // Total price calculation for all rooms combined
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

    const priceDetailsHtml = `
      <h3 style="margin-top:20px; font-size:16px;">Price Details</h3>
      <table style="width:100%; border-collapse:collapse; font-size:14px; border:1px solid #ddd;" cellpadding="8">
        <tbody>
          <tr>
  <td style="border-bottom:1px solid #eee;">
    ${nights} Nights × ₹${baseTotal.toLocaleString()}
  </td>
  <td style="text-align:right; border-bottom:1px solid #eee;">
    ₹${(nights * baseTotal).toLocaleString()}
  </td>
</tr>
          <tr>
            <td style="border-bottom:1px solid #eee;">${nights} Nights × ₹${extraChildCharge.toLocaleString()}</td>
            <td style="text-align:right; border-bottom:1px solid #eee;">₹${(nights * extraChildCharge).toLocaleString()}</td>
          </tr>
          <tr>
            <td style="border-bottom:1px solid #eee;">Seasonal Discount</td>
            <td style="text-align:right; border-bottom:1px solid #eee;">-₹${seasonalDiscount.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="border-bottom:1px solid #eee;">Taxes & Fees (18% GST)</td>
            <td style="text-align:right; border-bottom:1px solid #eee;">₹${taxes.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
          </tr>
          <tr style="font-weight:bold; background:#f6f6f6;">
            <td>Total INR</td>
            <td style="text-align:right;">₹${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
          </tr>
        </tbody>
      </table>
    `;

    const mailOptions = {
      from: `"Baan Nimbus" <${process.env.EMAIL_USER}>`,
      to: booking.email,
      subject: `Booking Confirmation - ${roomNames}`,
      html: `
        <div style="font-family:Arial, sans-serif; color:#333; line-height:1.6; padding:20px;">
          <h2 style="color:#063D2C;">Booking Confirmation</h2>
          <p>Hello <strong>${booking.name}</strong>,</p>
          <p>
            Thank you for booking <strong>${roomNames}</strong> with us.
            Below are your booking details.
          </p>

          <h3 style="font-size:16px; margin-top:15px;">Booking Details:</h3>
          <ul style="list-style:none; padding:0; margin:0; font-size:14px;">
            <li><strong>Check-in:</strong> ${checkinDate}</li>
            <li><strong>Check-out:</strong> ${checkoutDate}</li>
            <li><strong>Adults:</strong> ${booking.adults}</li>
            <li><strong>Kids:</strong> ${booking.kids} (Ages: ${booking.kidsAges?.join(", ") || "-"})</li>
            <li><strong>Pets:</strong> ${booking.pets}</li>
            <li><strong>Special Requests:</strong> ${booking.specialRequest || "None"}</li>
          </ul>

          ${priceDetailsHtml}

          <h3 style="margin-top:25px; font-size:16px;">Policies</h3>
          <ul style="font-size:13px; color:#555; padding-left:18px;">
            <li>This booking is non-cancellable and non-refundable.</li>
            <li>You may change your booking dates once, subject to availability.</li>
          </ul>

          <p style="margin-top:20px; font-size:14px;">
            For support, contact
            <a href="mailto:support@baannimbus.in">support@baannimbus.in</a>
            or call <strong>8800990063</strong>.
          </p>
          <p>We look forward to hosting you!</p>
        </div>
      `,
    };

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail(mailOptions);

    if (!skipResponse) {
      return res.status(200).json({ message: "Booking email sent successfully!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send email", error });
  }
};
