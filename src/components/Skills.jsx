import React, { useState, useEffect, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FaHtml5, FaCss3, FaJs, FaReact } from 'react-icons/fa';
import { client } from '../client';

// Icon Mapping
const ICON_MAP = {
  html5: <FaHtml5 className="text-orange-500" />,
  css3: <FaCss3 className="text-blue-500" />,
  js: <FaJs className="text-yellow-400" />,
  react: <FaReact className="text-cyan-400" />,
};

// Animation Variants
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

const textVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: (i) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut', delay: i * 0.2 },
  }),
};

const hexVariants = {
  hidden: { scale: 0.8, opacity: 0, rotate: -10 },
  visible: (i) => ({
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: { duration: 0.5, ease: 'easeOut', delay: i * 0.15 },
  }),
};

const ringVariants = {
  hidden: { strokeDashoffset: 283 },
  visible: (level) => ({
    strokeDashoffset: 283 * (1 - level / 100),
    transition: { duration: 1, ease: 'easeOut', delay: 0.4 },
  }),
};

const Skills = () => {
  const shouldReduceMotion = useReducedMotion();
  const [skillsData, setSkillsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Skills Data from Sanity
  useEffect(() => {
    client
      .fetch(
        `*[_type == "skills"][0]{
          title,
          description,
          skillsList[]{
            title,
            icon,
            level
          }
        }`
      )
      .then(data => {
        if (!data) {
          throw new Error('No skills data found in Sanity');
        }
        setSkillsData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching skills data:', err);
        setError(err.message || 'Failed to load skills content');
        setLoading(false);
      });
  }, []);

  // Memoize skills with icon mapping
  const skills = useMemo(() => {
    if (!skillsData || !skillsData.skillsList) return [];
    return skillsData.skillsList.map(skill => ({
      ...skill,
      icon: ICON_MAP[skill.icon] || <FaJs className="text-gray-400" />, // Fallback icon
    }));
  }, [skillsData]);

  // Loading State
  if (!skillsData) return null;

  // Error State
  if (error || !skillsData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <span className="text-red-400 text-lg">{error || 'No skills content available'}</span>
      </div>
    );
  }

  return (
    <motion.section
      id="skills"
      className="relative w-full bg-gradient-to-br from-gray-900 via-indigo-950 to-cyan-900 py-20 font-sans text-white overflow-hidden px-10 md:px-10"
      // initial={{  opacity: 0, y: 30}}
      // whileInView={{  opacity: 1, y:0 }}
      // transition={{ duration: 1.7,
      //   ease: "easeIn", // Custom cubic-bezier for smooth, snappy feel
      //   when: 'beforeChildren',}}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,rgba(6,182,212,0.2),transparent_70%)] opacity-80" />
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(79,70,229,0.1)_25%,transparent_25%,transparent_50%,rgba(79,70,229,0.1)_50%,rgba(79,70,229,0.1)_75%,transparent_75%)] bg-[size:40px_40px] opacity-15 animate-subtle-move" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center"
          variants={shouldReduceMotion ? {} : sectionVariants}
          initial={{  opacity: 0, y: 30}}
      whileInView={{  opacity: 1, y:0 }}
      transition={{ duration: 1,
        ease: "easeIn", // Custom cubic-bezier for smooth, snappy feel
        when: 'beforeChildren',}}
        >
          <motion.div
            className="inline-block text-3xl font-mono text-teal-400 animate-pulse"
            variants={shouldReduceMotion ? {} : textVariants}
            custom={0}
          >
            <span>&lt;Skills /&gt;</span>
          </motion.div>
          <motion.h2
            className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-400"
            variants={shouldReduceMotion ? {} : textVariants}
            custom={1}
          >
            {skillsData.title}
          </motion.h2>
          <motion.p
            className="mt-4 text-base sm:text-lg leading-relaxed text-gray-200 max-w-2xl mx-auto"
            variants={shouldReduceMotion ? {} : textVariants}
            custom={2}
          >
            {skillsData.description}
          </motion.p>
        </motion.div>

        {/* Hexagonal Skill Grid */}
        <motion.div
          className="mt-12 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 justify-items-center"
          variants={shouldReduceMotion ? {} : sectionVariants}
          initial={{  opacity: 0, y: 30}}
      whileInView={{  opacity: 1, y:0 }}
      transition={{ duration: 1,
        ease: "easeIn", // Custom cubic-bezier for smooth, snappy feel
        when: 'beforeChildren',}}
        >
          {skills.map(({ title, icon, level }, index) => (
            <motion.div
              key={title}
              className="relative w-32 h-36 sm:w-40 sm:h-44 flex items-center justify-center bg-indigo-950/80 rounded-[20px] clip-hexagon shadow-lg backdrop-blur-sm transition-all hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]"
              variants={shouldReduceMotion ? {} : hexVariants}
              custom={index}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              role="article"
              aria-labelledby={`skill-${title}`}
            >
              {/* SVG Progress Ring */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid meet"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="rgba(6, 182, 212, 0.2)"
                  strokeWidth="4"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#14b8a6"
                  strokeWidth="4"
                  strokeDasharray="283"
                  strokeDashoffset={283}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                  variants={shouldReduceMotion ? {} : ringVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={level}
                  aria-label={`${title} proficiency: ${level}%`}
                />
              </svg>
              {/* Skill Content */}
              <div className="text-center">
                <div className="text-3xl sm:text-4xl">{icon}</div>
                <h3
                  id={`skill-${title}`}
                  className="mt-2 text-sm sm:text-base font-semibold text-gray-200"
                >
                  {title}
                </h3>
                <span className="text-xs text-gray-400">{level}%</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Skills;