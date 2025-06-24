import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FaInstagram, FaGithub, FaDiscord, FaTwitter } from 'react-icons/fa';
import { client } from '../client'; // Adjust path to your Sanity client

// Map Sanity icon strings to React components
const iconMap = {
  FaInstagram: <FaInstagram className="text-teal-400" />,
  FaGithub: <FaGithub className="text-teal-400" />,
  FaDiscord: <FaDiscord className="text-teal-400" />,
  FaTwitter: <FaTwitter className="text-teal-400" />,
};

// Animation Variants
const footerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

const textVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: (i) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut', delay: i * 0.2 },
  }),
};

const iconVariants = {
  hover: { scale: 1.2, rotate: 5, color: '#14b8a6' },
  tap: { scale: 0.9 },
};

const Footer = () => {
  const shouldReduceMotion = useReducedMotion();
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Footer Data from Sanity
  useEffect(() => {
    client
      .fetch(
        `*[_type == "footer"][0]{
          socialLinks[]{
            id,
            name,
            icon,
            link,
            ariaLabel
          },
          legalLinks[]{
            id,
            name,
            link,
            ariaLabel
          }
        }`
      )
      .then((data) => {
        if (!data) {
          throw new Error('No footer data found in Sanity');
        }
        setFooterData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching footer data:', err);
        setError(err.message || 'Failed to load footer content');
        setLoading(false);
      });
  }, []);

  // Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
      </div>
    );
  }

  // Error State
  if (error || !footerData) {
    return (
      <div className="w-full bg-gray-900 text-white py-12 flex items-center justify-center">
        <span className="text-red-400">{error || 'No footer content available'}</span>
      </div>
    );
  }

  return (
    <footer className="relative w-full bg-gradient-to-br from-gray-900 via-indigo-950 to-cyan-900 py-12 font-sans text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.25),transparent_70%)] opacity-80" />
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(79,70,229,0.1)_25%,transparent_25%,transparent_50%,rgba(79,70,229,0.1)_50%,rgba(79,70,229,0.1)_75%,transparent_75%)] bg-[size:40px_40px] opacity-15 animate-subtle-move" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex flex-col items-center gap-8"
          variants={shouldReduceMotion ? {} : footerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Social Links */}
          <motion.div
            className="flex flex-wrap justify-center gap-6"
            variants={shouldReduceMotion ? {} : textVariants}
            custom={0}
          >
            {footerData.socialLinks.map(({ id, name, icon, link, ariaLabel }) => (
              <motion.a
                key={id}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-800/50 text-2xl text-teal-400 transition-all hover:bg-indigo-700/70 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer z-10"
                variants={shouldReduceMotion ? {} : iconVariants}
                whileHover="hover"
                whileTap="tap"
                aria-label={ariaLabel}
              >
                {iconMap[icon]}
                <span className="sr-only">{name}</span>
              </motion.a>
            ))}
          </motion.div>

          {/* Glowing Divider */}
          <motion.div
            className="w-24 h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent"
            variants={shouldReduceMotion ? {} : textVariants}
            custom={1}
          />

          {/* Legal Links */}
          <motion.div
            className="flex flex-wrap justify-center gap-6 text-sm text-gray-300"
            variants={shouldReduceMotion ? {} : textVariants}
            custom={2}
          >
            {footerData.legalLinks.map(({ id, name, link, ariaLabel }) => (
              <a
                key={id}
                href={link}
                className="hover:text-teal-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer z-10"
                aria-label={ariaLabel}
              >
                {name}
              </a>
            ))}
          </motion.div>

          {/* Copyright */}
          <motion.p
            className="text-sm text-gray-400 text-center z-10"
            variants={shouldReduceMotion ? {} : textVariants}
            custom={3}
          >
            © 2025{' '}
            <a
              href="mailto:davidetalong@gmail.com"
              className="hover:text-teal-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400 z-10"
              aria-label="Email Dave"
            >
              <span className="text-teal-400">Dave.codes</span>
            </a>
            . All rights reserved.
          </motion.p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;