"use client";
import { useState } from "react";
import {submitContactForm} from '../lib/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await submitContactForm(formData);
      setShowSuccess(true);
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 pt-20 pb-0 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      {/* Centered Heading */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          We'd love to hear from you
        </h1>
        <p className="text-gray-300 text-lg sm:text-xl">
          Whether you're curious about features, a demo, or anything else — we're ready to answer all your questions.
        </p>
      </div>

      {/* Cards Layout */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Let's Connect Form Card */}
        <div className="bg-white/10 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-500">
          <h2 className="text-2xl font-semibold text-white mb-4">Let's Connect</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Name"
              required
              className="w-full p-3 rounded-lg bg-white/20 placeholder-white text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              required
              className="w-full p-3 rounded-lg bg-white/20 placeholder-white text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Message"
              rows={4}
              required
              className="w-full p-3 rounded-lg bg-white/20 placeholder-white text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
            {showSuccess && <p className="text-green-400 text-sm pt-2">Message sent successfully!</p>}
            {error && <p className="text-red-400 text-sm pt-2">{error}</p>}
          </form>
        </div>

        {/* Contact Info Card */}
        <div className="bg-white/10 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-500">
          <h2 className="text-2xl font-semibold text-white mb-4">Contact Information</h2>
          <div className="text-gray-300 space-y-4 text-lg">
            <p>
              📧 Email:{" "}
              <a href="mailto:you@example.com" className="text-blue-400 hover:underline">
                you@example.com
              </a>
            </p>
            <p>
              📞 Phone:{" "}
              <a href="tel:+1234567890" className="text-blue-400 hover:underline">
                +1 234 567 890
              </a>
            </p>
            <p>📍 Address: 123 Street Name, City, Country</p>
          </div>

          {/* Google Map Embed */}
          <div className="mt-6">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.0512321654443!2d85.30956277530676!3d27.71101717619325!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1909ce8b070e%3A0xd5f3fbd021c684de!2sKathmandu%20Durbar%20Square!5e0!3m2!1sen!2snp!4v1691490193246!5m2!1sen!2snp"
              width="100%"
              height="200"
              allowFullScreen
              loading="lazy"
              className="rounded-lg border-0"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
