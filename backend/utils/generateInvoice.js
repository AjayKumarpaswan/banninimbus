// utils/generateInvoice.js
import PDFDocument from "pdfkit";
import fs from "fs";

export const generateInvoice = (booking, filePath) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40 });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      doc.fontSize(20).text("Baan Nimbus - Invoice", { align: "center" });
      doc.moveDown();
      doc.fontSize(12).text(`Invoice for booking: ${booking._id}`);
      doc.moveDown();
      doc.text(`Guest: ${booking.guest_id.name || booking.guest_id}`);
      doc.text(`Room: ${booking.room_id.name || booking.room_id}`);
      doc.text(`Check-in: ${booking.checkin}`);
      doc.text(`Check-out: ${booking.checkout}`);
      doc.moveDown();
      doc.text(`Total: ₹${booking.amount_total}`);
      doc.text(`Paid: ₹${booking.amount_paid}`);
      doc.end();

      stream.on("finish", () => resolve(filePath));
      stream.on("error", (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
};
