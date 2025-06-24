import React, { useState, useEffect, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FaEnvelope, FaMapMarkerAlt, FaLink, FaCode } from 'react-icons/fa';
import { MdCode, MdDashboardCustomize, MdPerson2, MdOutlineDesktopMac } from 'react-icons/md';
import { client } from '../client';

// Constants (Static Sidebar Items)
const SIDEBAR_ITEMS = [
  { id: 0, name: 'dashboard', label: 'Dashboard', icons: <MdDashboardCustomize className="text-teal-400 text-lg" /> },
  { id: 1, name: 'about', label: 'About', icons: <MdPerson2 className="text-teal-400 text-lg" /> },
  { id: 2, name: 'skills', label: 'Skills', icons: <FaCode className="text-teal-400 text-lg" /> },
  { id: 3, name: 'projects', label: 'Projects', icons: <MdOutlineDesktopMac className="text-teal-400 text-lg" /> },
  { id: 4, name: 'blog', label: 'Blog', icons: <MdCode className="text-teal-400 text-lg" /> },
  { id: 5, name: 'contact', label: 'Contact', icons: <FaEnvelope className="text-teal-400 text-lg" /> },
];

// Animation Variants
const sidebarVariants = {
  hidden: { x: -100, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 15 } },
};

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: (i) => ({
    x: 0,
    opacity: 1,
    transition: { delay: i * 0.1, type: 'spring', stiffness: 120 },
  }),
};

const cardVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

const textVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

const badgeVariants = {
  hidden: { scale: 0.8, rotate: -10 },
  visible: (i) => ({
    scale: 1,
    rotate: 0,
    transition: { delay: i * 0.08, type: 'spring', stiffness: 150, damping: 12 },
  }),
};

const Hero = () => {
  const shouldReduceMotion = useReducedMotion();
  const sidebarItems = useMemo(() => SIDEBAR_ITEMS, []);
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Hero Data from Sanity
  useEffect(() => {
    client
      .fetch(
        `*[_type == "hero"][0]{
          name,
          title,
          contactInfo[]{
            title,
            href
          },
          techStack[]{
            name,
            level
          },
          cvFile{
            asset->{
              url
            }
          },
          headline,
          subheading,
          description,
          ctaText,
          ctaLink,
          stats[]{
            title,
            value,
            unit
          }
        }`
      )
      .then(data => {
        setHeroData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching hero data:', err);
        setError('Failed to load hero content');
        setLoading(false);
      });
  }, []);
   // Loading State
  if (!heroData) return null;
  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-64">
  //       <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
  //     </div>
  //   );
  // }

  // Fallback Data
  const fallbackData = {
    name: 'Dave',
    title: 'Senior Frontend Developer',
    contactInfo: [
      { title: 'davidetalong00@gmail.com', href: 'mailto:davidetalong00@gmail.com' },
      { title: 'Nigeria' },
      { title: 'www.davelong.com', href: 'https://www.davelong.com' },
    ],
    techStack: [
      { name: 'HTML', level: 90 },
      { name: 'CSS', level: 85 },
      { name: 'JavaScript', level: 80 },
      { name: 'React', level: 88 },
      { name: 'Solidity', level: 70 },
    ],
    cvFile: { asset: { url: '/cv.pdf' } },
    headline: 'Crafting Dynamic Web Experiences',
    subheading: "Hey, I'm Dave",
    description: "I transform ideas into pixel-perfect, performant interfaces. Let's build something unforgettable together!",
    ctaText: 'Start a Project',
    ctaLink: '#contact',
    stats: [
      { title: 'Languages', value: 3, unit: 'Years' },
      { title: 'Tools', value: 4, unit: 'Years' },
      { title: 'Experience', value: 3, unit: 'Years' },
    ],
  };

  // Use heroData if available, otherwise fallback
  const data = heroData || fallbackData;

  // Map Contact Info to Icons
  const contactInfoWithIcons = data.contactInfo.map((item, index) => ({
    ...item,
    icon: item.href?.includes('mailto') ? (
      <FaEnvelope className="text-teal-400" />
    ) : item.href?.includes('www') ? (
      <FaLink className="text-teal-400" />
    ) : (
      <FaMapMarkerAlt className="text-teal-400" />
    ),
    id: index,
  }));

  return (
    <section
      className="relative min-h-screen w-full bg-gradient-to-br from-gray-900 via-indigo-900 to-cyan-800 font-sans text-white overflow-hidden px-10"
      id="dashboard"
    >
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(6,182,212,0.15),transparent_70%)] opacity-80" />
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(79,70,229,0.1)_25%,transparent_25%,transparent_50%,rgba(79,70,229,0.1)_50%,rgba(79,70,229,0.1)_75%,transparent_75%)] bg-[size:40px_40px] opacity-15 animate-subtle-move" />

      {/* Sidebar (Hidden on mobile, visible on lg+) */}
      <motion.aside
        className="hidden lg:block fixed left-6 top-1/2 z-30 w-24 -translate-y-1/2 rounded-2xl border border-indigo-600/20 bg-indigo-950/80 p-6 shadow-2xl backdrop-blur-lg"
        variants={shouldReduceMotion ? {} : sidebarVariants}
        initial={{opacity: 0}}
        animate= {{opacity: 1}}
        transition={{ duration: 1,
          ease: "easeIn"}}
        aria-label="Navigation menu"
      >
        <nav className="space-y-2">
          {sidebarItems.map(({ id, name, label, icons }) => (
            <motion.a
              key={id}
              href={`#${name}`}
              className="group relative flex items-center rounded-lg py-3 pl-4 text-base font-medium capitalize transition-all duration-200 hover:bg-indigo-800/50 hover:text-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
              variants={shouldReduceMotion ? {} : itemVariants}
              custom={id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              aria-label={`Navigate to ${label}`}
            >
              <span className="absolute left-0 h-6 w-1 bg-teal-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
              {icons}
            </motion.a>
          ))}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div className="container mx-auto flex flex-col items-center justify-center gap-12 px-4 py-20 md:flex-row md:gap-16 lg:pl-80">
        {/* Profile Card */}
        <motion.div
          className="relative w-full max-w-sm rounded-2xl border border-indigo-600/20 bg-indigo-950/90 p-8 shadow-xl backdrop-blur-lg transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          variants={shouldReduceMotion ? {} : cardVariants}
          initial={{  x: -100}}
          animate={{  x: 0 }}
          transition={{ duration: 1,
            ease: "easeIn", // Custom cubic-bezier for smooth, snappy feel
            when: 'beforeChildren',
            staggerChildren: 0.1, }}
          whileHover={{ y: -5 }}
        >
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-400">
            {data.name}
          </h2>
          <p className="mt-3 text-sm font-medium text-gray-300">{data.title}</p>
          <ul className="mt-8 space-y-4">
            {contactInfoWithIcons.map(({ id, icon, title, href }) => (
              <li key={id} className="flex items-center text-sm text-gray-200">
                <span className="mr-4 text-lg">{icon}</span>
                {href ? (
                  <a
                    href={href}
                    className="hover:text-teal-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
                    aria-label={title}
                  >
                    {title}
                  </a>
                ) : (
                  <span>{title}</span>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-white mb-4">Tech Stack</h3>
            <ul className="flex flex-wrap gap-3">
              {data.techStack.map(({ name, level }, index) => (
                <motion.li
                  key={name}
                  className="relative rounded-full bg-indigo-800/60 px-4 py-2 text-xs font-semibold text-teal-300 transition-all hover:bg-indigo-700/80 hover:shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                  variants={shouldReduceMotion ? {} : badgeVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  whileHover={{ scale: 1.1, rotate: 3 }}
                >
                  {name}
                  <span className="absolute -top-2 -right-2 text-[10px] bg-teal-400 text-gray-900 rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                    {level}%
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
          <a
            href={data.cvFile?.asset?.url || '/cv.pdf'}
            download
            className="mt-8 inline-block w-full rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 px-6 py-3 text-center text-sm font-semibold text-gray-900 transition-all hover:from-teal-500 hover:to-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2"
            aria-label="Download CV"
          >
            Download CV
          </a>
        </motion.div>

        {/* Content and Stats */}
        <div className="flex w-full max-w-md flex-col items-center md:items-start">
          {/* Main Content */}
          <motion.div
            className="text-center md:text-left z-10"
            variants={shouldReduceMotion ? {} : textVariants}
            initial={{  x: 100}}
            animate={{  x: 0 }}
            transition={{ duration: 1,
            ease: "easeIn", // Custom cubic-bezier for smooth, snappy feel
            when: 'beforeChildren',
            staggerChildren: 0.1, }}
          >
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              {data.headline.split('Dynamic')[0]}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-400">Dynamic</span>
              {data.headline.split('Dynamic')[1] || ' Web Experiences'}
            </h1>
            <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">
              {data.subheading.split('Dave')[0]}
              <span className="text-purple-300">Dave</span>
              {data.subheading.split('Dave')[1] || ''}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-gray-300 sm:text-lg">
              {data.description.split('unforgettable')[0]}
              <span className="font-semibold text-teal-300">unforgettable</span>
              {data.description.split('unforgettable')[1] || ' together!'}
            </p>
            <a
              href={data.ctaLink}
              className="mt-6 inline-block rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 px-8 py-3 text-sm font-semibold text-gray-900 transition-all hover:from-purple-500 hover:to-indigo-500 hover:shadow-[0_0_20px_rgba(192,132,252,0.6)] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
              aria-label="Contact me"
            >
              {data.ctaText}
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3"
            variants={shouldReduceMotion ? {} : cardVariants}
            initial = {{  y: 30 }}
            animate = {{  y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } }}
          >
            {data.stats.map(({ title, value, unit }) => (
              <motion.div
                key={title}
                className="rounded-lg bg-indigo-950/80 p-5 text-center shadow-lg backdrop-blur-sm transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                whileHover={{ y: -3 }}
              >
                <span className="text-3xl font-bold text-teal-300">{value}</span>
                <p className="mt-1 text-xs text-gray-400">{unit}</p>
                <p className="mt-2 text-sm font-medium text-gray-200">{title}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Error Notification (Optional) */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-600/80 text-white px-4 py-2 rounded-lg shadow-lg">
          {error}. Using fallback content.
        </div>
      )}
    </section>
  );
};

export default Hero;