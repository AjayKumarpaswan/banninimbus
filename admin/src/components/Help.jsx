import React from "react";
import { Phone, Mail, Info } from "lucide-react";

const Help = () => {
  return (
    <main className="min-h-screen md:ml-50 bg-gray-50 py-16 px-4 md:px-12 lg:px-24">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Need Help? We're Here for You
        </h1>
        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
          Whether you have questions about bookings, payments, or any other service,
          our support team is ready to assist you.
        </p>
      </section>

      {/* Contact Info Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-white rounded-2xl p-8 shadow-lg flex flex-col items-center text-center hover:shadow-2xl transition">
          <Phone className="w-12 h-12 text-green-900 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Call Us</h3>
          <p className="text-gray-600">+91 8800990063</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg flex flex-col items-center text-center hover:shadow-2xl transition">
          <Mail className="w-12 h-12 text-green-900 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Email Support</h3>
          <p className="text-gray-600">support@baannimbus.in</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg flex flex-col items-center text-center hover:shadow-2xl transition">
          <Info className="w-12 h-12 text-green-900 mb-4" />
          <h3 className="text-xl font-semibold mb-2">FAQs</h3>
          <p className="text-gray-600">Find answers to common questions instantly.</p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="max-w-3xl mx-auto bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">
          Send Us a Message
        </h2>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-900 focus:outline-none"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-900 focus:outline-none"
            />
          </div>
          <input
            type="text"
            placeholder="Subject"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-900 focus:outline-none"
          />
          <textarea
            placeholder="Your Message"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 h-32 focus:ring-2 focus:ring-green-900 focus:outline-none"
          />
          <div className="text-center">
            <button
              type="submit"
              className="bg-green-900 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-800 transition"
            >
              Send Message
            </button>
          </div>
        </form>
      </section>

      {/* Footer Note */}
      <section className="mt-16 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} Baannimbus. All rights reserved.</p>
      </section>
    </main>
  );
};

export default Help;
