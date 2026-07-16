import React from 'react'

const Contact = () => {
  return (
    <section className="page-x section-y">
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow">Contact</p>
        <h1 className="editorial-serif mt-3 text-5xl font-semibold">Need a hand with your order?</h1>
        <p className="mt-4 leading-7 text-[#6f5860]">
          Ask about sizing, delivery, styling, or order support. We will help you get it sorted.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-5xl gap-8 md:grid-cols-[0.85fr_1.15fr]">
       
        <div className="border border-[#DBCCB7] bg-white p-6">
          <h2 className="editorial-serif text-2xl font-semibold">Customer care</h2>
          <p className="mt-4 leading-7 text-[#6f5860]">
            Send a note and we will reply as soon as possible during working hours.
          </p>

          <div className="mt-8 space-y-4 text-sm text-[#6f5860]">
            <p><span className="font-bold text-[#5A0019]">Address:</span> Accra, Ghana</p>
            <p><span className="font-bold text-[#5A0019]">Phone:</span> +233 55 297 3298</p>
            <p><span className="font-bold text-[#5A0019]">Email:</span> danieldzansi96@gmail.com</p>
            <p><span className="font-bold text-[#5A0019]">Hours:</span> Mon - Fri, 9:00am - 6:00pm</p>
          </div>
        </div>

       
        <form className="space-y-5 border border-[#DBCCB7] p-6">
          <div>
            <label className="mb-2 block text-sm font-bold">Name</label>
            <input
              type="text"
              placeholder="Your name"
              className="form-field"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="form-field"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold">Message</label>
            <textarea
              rows="4"
              placeholder="How can we help?"
              className="form-field"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="btn-primary w-full"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  )
}

export default Contact
