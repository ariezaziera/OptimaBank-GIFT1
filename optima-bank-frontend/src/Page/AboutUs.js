import React from 'react';

export default function AboutUs() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-center text-blue-800 mb-6">
        About Optima Bank
      </h1>
      <p className="text-center text-gray-600 text-lg mb-10">
        "Empowering your financial future — smart, simple, secure."
      </p>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-blue-700 mb-2">Who We Are</h2>
        <p className="text-gray-700">
          Optima Bank is a next-generation digital bank committed to redefining the way you manage your finances. 
          Founded with the belief that financial literacy and savings should be accessible to everyone, we strive to make banking simpler, safer, and more rewarding.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-blue-700 mb-2">Our Mission</h2>
        <p className="text-gray-700">
          To provide a seamless and secure banking experience that encourages smart financial habits, empowers customers to save, and supports them in achieving their financial goals.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-blue-700 mb-2">Our Vision</h2>
        <p className="text-gray-700">
          To become the most trusted and innovative digital bank in the region, enabling every individual to take control of their financial journey with confidence.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-blue-700 mb-2">Our Values</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>Integrity – We build trust through transparency and honesty.</li>
          <li>Innovation – We embrace technology to deliver smarter banking.</li>
          <li>Customer First – We design everything with you in mind.</li>
          <li>Financial Wellness – We promote smart saving and spending habits.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-blue-700 mb-2">Our Story</h2>
        <p className="text-gray-700">
          Optima Bank was born out of a simple realization: people want more control over their money, but traditional banking often falls short. 
          We believe that saving money shouldn't be complicated or boring — it should be rewarding. 
          That's why we created a platform that makes saving easy, intuitive, and beneficial for everyone.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-blue-700 mb-2">What Makes Us Different</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>Zero monthly fees – because your money belongs to you.</li>
          <li>Smart savings plans – tailored to your goals and income.</li>
          <li>24/7 digital support – we're always just a tap away.</li>
          <li>Real-time notifications – full control, no surprises.</li>
          <li>Secure and encrypted platform – your data is safe with us.</li>
        </ul>
      </section>
    </div>
  );
}
