// controllers/notificationController.js
import { sendEmail } from "../utils/sendEmail.js";

/**
 * Basic notification endpoints (email only for now). You can plug Twilio/WhatsApp later.
 */
export const notify = async (req, res) => {
  try {
    const { to, subject, text, html } = req.body;
    if (!to || !subject) return res.status(400).json({ message: "Missing fields" });
    await sendEmail(to, subject, text || subject, html || "");
    res.json({ message: "Sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
