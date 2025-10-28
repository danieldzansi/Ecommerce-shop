import React from 'react'
import Title from '../components/Title'

const Contact = () => {
  return (
    <div className="border-t pt-16 text-gray-700">
      
      <div className="text-2xl mb-6">
        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-10">
       
        <div className="space-y-5">
          <h2 className="text-xl font-semibold text-gray-900">Get in Touch</h2>
          <p>
            Have a question, feedback, or partnership inquiry?  
            We’d love to hear from you! Our team is always ready to assist you.
          </p>

          <div className="space-y-3 text-sm">
            <p><span className="font-semibold text-gray-900">📍 Address:</span> 12 Spintex Road, Accra, Ghana</p>
            <p><span className="font-semibold text-gray-900">📞 Phone:</span> +233 55 123 4567</p>
            <p><span className="font-semibold text-gray-900">✉️ Email:</span> support@bitsend.com</p>
            <p><span className="font-semibold text-gray-900">🕒 Working Hours:</span> Mon – Fri, 9:00am – 6:00pm</p>
          </div>

          <div className="flex gap-4 mt-4">
            <a href="#" className="hover:opacity-70">
              <img src="" alt="Facebook" className="w-6 h-6" />
            </a>
            <a href="#" className="hover:opacity-70">
              <img src="" alt="Twitter" className="w-6 h-6" />
            </a>
            <a href="#" className="hover:opacity-70">
              <img src="" alt="Instagram" className="w-6 h-6" />
            </a>
          </div>
        </div>

       
        <form className="space-y-4 bg-gray-50 p-6 rounded-xl shadow-sm">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              placeholder="Your name"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea
              rows="4"
              placeholder="Write your message here..."
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  )
}

export default Contact
