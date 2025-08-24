// src/Page/AboutUs.js
import React, {useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../Navbar';

export default function AboutUs() {

  const [user, setUser] = useState(null);

  useEffect(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat py-16 px-4"
      style={{ backgroundImage: `url('/bg-bank.png')` }} // Make sure this image exists in public folder
    >
      
      <Navbar user={user} />

      <motion.div
        className="relative max-w-5xl mx-auto px-6 py-16 z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0 }}
      >
        <div className="bg-white bg-opacity-90 backdrop-blur-md p-10 rounded-2xl shadow-2xl">
          <motion.h1
            className="text-5xl font-bold text-center text-[#183444] mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            About Us
          </motion.h1>
          <motion.p
            className="text-center text-gray-600 text-xl mb-10 italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Empowering your financial future — smart, simple, secure.
          </motion.p>

          {[
            {
              title: 'Who We Are',
              content: `Optima Bank is a next-generation digital bank committed to redefining the way you manage your finances. Founded with the belief that financial literacy and savings should be accessible to everyone, we strive to make banking simpler, safer, and more rewarding.`
            },
            {
              title: 'Our Mission',
              content: `To provide a seamless and secure banking experience that encourages smart financial habits, empowers customers to save, and supports them in achieving their financial goals.`
            },
            {
              title: 'Our Vision',
              content: `To become the most trusted and innovative digital bank in the region, enabling every individual to take control of their financial journey with confidence.`
            },
            {
              title: 'Our Values',
              list: [
                'Integrity – We build trust through transparency and honesty.',
                'Innovation – We embrace technology to deliver smarter banking.',
                'Customer First – We design everything with you in mind.',
                'Financial Wellness – We promote smart saving and spending habits.'
              ]
            },
            {
              title: 'Our Story',
              content: `Optima Bank was born out of a simple realization: people want more control over their money, but traditional banking often falls short. We believe that saving money shouldn't be complicated or boring — it should be rewarding. That's why we created a platform that makes saving easy, intuitive, and beneficial for everyone.`
            },
            {
              title: 'What Makes Us Different',
              list: [
                'Zero monthly fees – Because your money belongs to you.',
                'Smart savings plans – Tailored to your goals and income.',
                '24/7 digital support – We\'re always just a tap away.',
                'Real-time notifications – Full control, no surprises.',
                'Secure and encrypted platform – Your data is safe with us.'
              ]
            }
          ].map((section, index, array) => (
  <motion.section
    key={index}
    className={`${index === array.length - 1 ? '' : 'mb-10'}`}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.2 }}
  >
    <h2
      className={`text-2xl font-semibold text-[#668032] text-center ${
        index === array.length - 1 ? '' : 'mb-2'
      }`}
    >
      {section.title}
    </h2>

    {section.content && (
      <p className="text-gray-700 text-center">{section.content}</p>
    )}

    {section.list && (
      <ul className="list-none list-inside text-center text-gray-700">
        {section.list.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    )}
            </motion.section>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
