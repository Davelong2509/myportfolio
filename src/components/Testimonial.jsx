import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FaQuoteLeft } from 'react-icons/fa';
import { client } from '../client';

// Animation Variants
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const cardVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: (i) => ({
    y: 0,
    opacity: 1,
    transition: { delay: i * 0.2, type: 'spring', stiffness: 100, damping: 15 },
  }),
};

const iconVariants = {
  hover: { scale: 1.2, color: '#14b8a6' },
};

const Testimonial = () => {
  const shouldReduceMotion = useReducedMotion();
  const [testimonialsData, setTestimonialsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Testimonials Data from Sanity
  useEffect(() => {
    client
      .fetch(
        `*[_type == "testimonials"][0]{
          title,
          description,
          testimonialsList[]{
            quote,
            author,
            role,
            company
          }
        }`
      )
      .then(data => {
        if (!data) {
          throw new Error('No testimonials data found in Sanity');
        }
        // Add id to each testimonial for React keys
        const enrichedData = {
          ...data,
          testimonialsList: data.testimonialsList.map((testimonial, index) => ({
            ...testimonial,
            id: index + 1,
          })),
        };
        setTestimonialsData(enrichedData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching testimonials data:', err);
        setError(err.message || 'Failed to load testimonials content');
        setLoading(false);
      });
  }, []);

  // Loading State
  if (!testimonialsData) return null;
  // Error State
  if (error || !testimonialsData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <span className="text-red-400 text-lg">{error || 'No testimonials content available'}</span>
      </div>
    );
  }

  return (
    <motion.section
      id="testimonials"
      className="relative w-full bg-gradient-to-br from-gray-900 via-indigo-900 to-cyan-800 py-20 px-10 md:px-20"
      // initial={{  opacity: 0, y: 30}}
      // whileInView={{  opacity: 1, y:0 }}
      // transition={{ duration: 1.7,
      //   ease: "easeIn", // Custom cubic-bezier for smooth, snappy feel
      //   when: 'beforeChildren',}}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-12"
          variants={shouldReduceMotion ? {} : sectionVariants}
          initial={{  opacity: 0, y: 30}}
        whileInView={{  opacity: 1, y:0 }}
        transition={{ duration: 1,
        ease: "easeIn", // Custom cubic-bezier for smooth, snappy feel
        when: 'beforeChildren',}}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-400">
            {testimonialsData.title}
          </h2>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            {testimonialsData.description}
          </p>
        </motion.div>

        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:px-20"
        initial={{  opacity: 0, y: 30}}
        whileInView={{  opacity: 1, y:0 }}
        transition={{ duration: 1,
        ease: "easeIn", // Custom cubic-bezier for smooth, snappy feel
        when: 'beforeChildren',}}
        >
          {testimonialsData.testimonialsList.map(({ id, quote, author, role, company }, index) => (
            <motion.div
              key={id}
              className="relative rounded-2xl border border-indigo-600/20 bg-indigo-950/80 p-6 shadow-2xl backdrop-blur-lg transition-all duration-300 hover:shadow-teal-400/20"
              variants={shouldReduceMotion ? {} : cardVariants}
              custom={index}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="absolute top-4 left-4 text-teal-400 text-2xl"
                variants={shouldReduceMotion ? {} : iconVariants}
                whileHover="hover"
              >
                <FaQuoteLeft />
              </motion.div>
              <blockquote className="mt-8 text-gray-300 italic text-base">
                "{quote}"
              </blockquote>
              <div className="mt-6">
                <p className="text-teal-300 font-medium">{author}</p>
                <p className="text-gray-400 text-sm">
                  {role} {company && `at ${company}`}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Testimonial;