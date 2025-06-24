import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { client, urlFor } from '../client';

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

const cardVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut', delay: 0.1 } },
  exit: { y: 50, opacity: 0, transition: { duration: 0.3, ease: 'easeIn' } },
};

const imageVariants = {
  hidden: { scale: 1.1, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.6, ease: 'easeOut', delay: 0.2 } },
};

const Works = () => {
  const shouldReduceMotion = useReducedMotion();
  const [projectsData, setProjectsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');

  // Derive Tags and Filtered Projects (Moved to top level)
  const tags = useMemo(
    () => (projectsData ? ['All', ...new Set(projectsData.projectsList.flatMap(p => p.tags))] : ['All']),
    [projectsData]
  );
  const filteredProjects = useMemo(
    () =>
      projectsData && filter === 'All'
        ? projectsData.projectsList
        : projectsData
        ? projectsData.projectsList.filter(p => p.tags.includes(filter))
        : [],
    [filter, projectsData]
  );

  // Fetch Projects Data from Sanity
  useEffect(() => {
    client
      .fetch(
        `*[_type == "projects"][0]{
          title,
          description,
          projectsList[]{
            title,
            description,
            image,
            tags,
            link
          }
        }`
      )
      .then(data => {
        if (!data) {
          throw new Error('No projects data found in Sanity');
        }
        // Add id to each project for React keys
        const enrichedData = {
          ...data,
          projectsList: data.projectsList.map((project, index) => ({
            ...project,
            id: index + 1,
          })),
        };
        setProjectsData(enrichedData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching projects data:', err);
        setError(err.message || 'Failed to load projects content');
        setLoading(false);
      });
  }, []);

  // Loading State
  if (!projectsData) return null;

  // Error State
  if (error || !projectsData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <span className="text-red-400 text-lg">{error || 'No projects content available'}</span>
      </div>
    );
  }

  return (
    <motion.section
      id="projects"
      className="relative w-full bg-gradient-to-br from-gray-900 via-indigo-950 to-cyan-900 py-20 font-sans text-white overflow-hidden px-10 md:px-20"
      // initial={{  opacity: 0, y: 30}}
      // whileInView={{  opacity: 1, y:0 }}
      // transition={{ duration: 1.7,
      //   ease: "easeIn", // Custom cubic-bezier for smooth, snappy feel
      //   when: 'beforeChildren',}}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.25),transparent_70%)] opacity-80" />
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(79,70,229,0.1)_25%,transparent_25%,transparent_50%,rgba(79,70,229,0.1)_50%,rgba(79,70,229,0.1)_75%,transparent_75%)] bg-[size:40px_40px] opacity-15 animate-subtle-move" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center"
          variants={shouldReduceMotion ? {} : sectionVariants}
          initial={{  opacity: 0, y: 30}}
          whileInView={{  opacity: 1, y:0 }}
          transition={{ duration: 1.7,
          ease: "easeIn", // Custom cubic-bezier for smooth, snappy feel
          when: 'beforeChildren',}}
        >
          <motion.h2
            className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-400 animate-pulse"
            variants={shouldReduceMotion ? {} : textVariants}
            custom={0}
          >
            {projectsData.title}
          </motion.h2>
          <motion.p
            className="mt-4 text-base sm:text-lg leading-relaxed text-gray-200 max-w-2xl mx-auto"
            variants={shouldReduceMotion ? {} : textVariants}
            custom={1}
          >
            {projectsData.description}
          </motion.p>
        </motion.div>

        {/* Tag Filters (Mobile Slider) */}
        <motion.div
          className="mt-8 flex md:flex-wrap justify-start sm:justify-center gap-3 overflow-hidden lg:overflow-x-hidden scrollbar-hide snap-x snap-mandatory pb-4 sm:pb-0"
          variants={shouldReduceMotion ? {} : sectionVariants}
          initial={{  opacity: 0, y: 30}}
          whileInView={{  opacity: 1, y:0 }}
          transition={{ duration: 1.7,
          ease: "easeIn", // Custom cubic-bezier for smooth, snappy feel
          when: 'beforeChildren',}}
        >
          {tags.map((tag, index) => (
            <motion.button
              key={tag}
              className={`flex-shrink-0 px-5 py-2.5 text-sm font-medium rounded-full transition-all snap-center z-10 ${
                filter === tag
                  ? 'bg-gradient-to-r from-teal-400 to-cyan-400 text-gray-900 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                  : 'bg-indigo-800/50 text-gray-200 hover:bg-indigo-700/70'
              }`}
              onClick={() => setFilter(tag)}
              variants={shouldReduceMotion ? {} : textVariants}
              custom={index + 2}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-pressed={filter === tag}
              aria-label={`Filter projects by ${tag}`}
            >
              {tag}
            </motion.button>
          ))}
        </motion.div>

        {/* Project Grid */}
        <motion.div
          className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:px-20"
          layout
          transition={{ layout: { duration: 0.4, ease: 'easeOut' } }}
        >
          <AnimatePresence>
            {filteredProjects.map(({ id, title, description, image, tags, link }) => (
              <motion.div
                key={id}
                className="relative bg-gradient-to-br from-indigo-900/90 to-cyan-900/90 p-6 rounded-2xl shadow-lg border border-indigo-600/20 overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                variants={shouldReduceMotion ? {} : cardVariants}
                initial={{  opacity: 0, y: 30}}
                whileInView={{  opacity: 1, y:0 }}
                transition={{ duration: 1,
                  ease: "easeIn", // Custom cubic-bezier for smooth, snappy feel
                  when: 'beforeChildren',}}
                viewport={{ once: true, amount: 0.2 }}
                layout
              >
                {/* Project Image */}
                <motion.div
                  className="relative w-full h-48 overflow-hidden rounded-xl"
                  variants={shouldReduceMotion ? {} : imageVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <img
                    src={urlFor(image).width(600).height(400).url()}
                    alt={`${title} preview`}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/30 to-transparent" />
                </motion.div>

                {/* Project Content */}
                <div className="mt-4">
                  <h3 id={`project-${id}`} className="text-lg font-semibold text-gray-100">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-300 leading-relaxed line-clamp-3">
                    {description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <span
                        key={tag}
                        className="text-xs font-medium text-teal-300 bg-indigo-800/40 px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block text-sm font-semibold text-teal-400 hover:text-teal-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2"
                    aria-label={`View ${title} project`}
                  >
                    View Project →
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Works;