import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FaCode, FaEnvelope } from 'react-icons/fa';
import { MdCode, MdDashboardCustomize, MdPerson2, MdOutlineDesktopMac } from 'react-icons/md';
import { CgMenuRightAlt, CgClose } from 'react-icons/cg';

// Constants
const NAV_ITEMS = [
  { id: 0, name: 'dashboard', label: 'Dashboard', icons: <MdDashboardCustomize className="text-teal-400 text-lg" /> },
  { id: 1, name: 'about', label: 'About', icons: <MdPerson2 className="text-teal-400 text-lg" /> },
  { id: 2, name: 'skills', label: 'Skills', icons: <FaCode className="text-teal-400 text-lg" /> },
  { id: 3, name: 'projects', label: 'Projects', icons: <MdOutlineDesktopMac className="text-teal-400 text-lg" /> },
  { id: 4, name: 'blog', label: 'Blog', icons: <MdCode className="text-teal-400 text-lg" /> },
  { id: 5, name: 'contact', label: 'Contact', icons: <FaEnvelope className="text-teal-400 text-lg" /> },
];

// Animation Variants
const navbarVariants = {
  hidden: { y: -50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 15 } },
};



const hamburgerVariants = {
  hover: { scale: 1.1, rotate: 10 },
  tap: { scale: 0.9 },
};

const NavMenu = () => {
  const shouldReduceMotion = useReducedMotion();
  const navItems = useMemo(() => NAV_ITEMS, []);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  return (
    <>
      {/* Desktop Navbar (Visible on lg+) - Logo Only */}
      <motion.nav
        className="hidden pl-10 lg:block fixed top-0 left-0 z-50  p-4"
        variants={shouldReduceMotion ? {} : navbarVariants}
        initial="hidden"
        animate="visible"
        aria-label="Main navigation"
      >
        <motion.h1
          className="animate-pulse text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Dave.codes
        </motion.h1>
      </motion.nav>

      {/* Mobile Top Bar (Visible on mobile) - Logo and Hamburger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-indigo-950/90 backdrop-blur-lg p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <motion.h1
            className="animate-pulse text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Dave.codes
          </motion.h1>
          <motion.button
            className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-800/50 text-teal-400 text-2xl transition-all hover:bg-indigo-700/70 focus:outline-none focus:ring-2 focus:ring-teal-400"
            onClick={toggleMobileMenu}
            variants={shouldReduceMotion ? {} : hamburgerVariants}
            whileHover="hover"
            whileTap="tap"
            aria-label={isMobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <CgClose className="w-6 h-6 transform transition-all duration-300" />
            ) : (
              <CgMenuRightAlt className="w-6 h-6 transform transition-all duration-300" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isMobileMenuOpen && (
      <motion.nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-indigo-950/90 p-4 shadow-lg backdrop-blur-lg"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 15 }}
      aria-label="Mobile navigation"
    >
      <ul className="flex justify-around">
        {navItems.map(({ id, name, label, icons }) => (
          <li key={id}>
            <a
              href={`#${name}`}
              className="flex flex-col items-center text-xs font-medium text-gray-300 hover:text-teal-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400 "
              aria-label={`Navigate to ${label}`}
            >
              {icons}
              <span>{label}</span>
            </a>
          </li>
        ))}
      </ul>
    </motion.nav>
      )}
    </>
  );
};

export default NavMenu;