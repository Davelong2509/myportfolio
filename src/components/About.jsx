import { useState, useEffect  } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { client,urlFor } from '../client';


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

const imageVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.5, ease: 'easeOut', delay: 0.3 } },
};

const About = () => {
  const shouldReduceMotion = useReducedMotion();
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch About Data from Sanity
  useEffect(() => {
    client
      .fetch(
        `*[_type == "about"][0]{
          title,
          subtitle,
          description,
          cta,
          ctaLink,
          image
        }`
      )
      .then(data => {
        if (!data) {
          throw new Error('No about data found in Sanity');
        }
        setAboutData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching about data:', err);
        setError(err.message || 'Failed to load about content');
        setLoading(false);
      });
  }, []);

  // Loading State
  if (!aboutData) return null;
//  if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
//       </div>
//     );
//   }
  // Error State
  if (error || !aboutData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <span className="text-red-400 text-lg">{error || 'No about content available'}</span>
      </div>
    );
  }

  return (
    <section
      id="about"
      className="relative w-full bg-gradient-to-br from-gray-900 via-indigo-950 to-cyan-900 py-20 font-sans text-white overflow-hidden px-10 md:px-20"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_70%,rgba(6,182,212,0.15),transparent_75%)] opacity-80" />
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(79,70,229,0.1)_25%,transparent_25%,transparent_50%,rgba(79,70,229,0.1)_50%,rgba(79,70,229,0.1)_75%,transparent_75%)] bg-[size:40px_40px] opacity-15 animate-subtle-move" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-20 flex flex-col lg:flex-row lg:items-center lg:justify-center w-full   lg:gap-16">
        {/* Text Content */}
        <motion.div
          className="lg:w-1/2"
          variants={shouldReduceMotion ? {} : sectionVariants}
          initial={{  x: -100, y: 30}}
          whileInView={{  x: 0, y:0 }}
          transition={{ duration: 1,
            ease: "easeIn", // Custom cubic-bezier for smooth, snappy feel
            when: 'beforeChildren',
            staggerChildren: 0.1, }}
          // whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.h2
            className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-400"
            variants={shouldReduceMotion ? {} : textVariants}
            custom={0}
          >
            {aboutData.title}
          </motion.h2>
          <motion.h3
            className="mt-6 text-2xl sm:text-3xl font-semibold text-purple-300"
            variants={shouldReduceMotion ? {} : textVariants}
            custom={1}
          >
            {aboutData.subtitle}
          </motion.h3>
          {aboutData.description.map((paragraph, index) => (
            <motion.p
              key={index}
              className="mt-4 text-base sm:text-lg leading-relaxed text-gray-200"
              variants={shouldReduceMotion ? {} : textVariants}
              custom={index + 2}
              dangerouslySetInnerHTML={{ __html: paragraph }}
            />
          ))}
          <motion.a
            href={aboutData.ctaLink}
            className="mt-8 inline-block rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 px-8 py-3 text-sm font-semibold text-gray-900 transition-all hover:from-teal-500 hover:to-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2"
            variants={shouldReduceMotion ? {} : textVariants}
            custom={aboutData.description.length + 2}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={aboutData.cta}
          >
            {aboutData.cta}
          </motion.a>
        </motion.div>

        {/* Image */}
        <motion.div
          className="mt-12 lg:mt-0 lg:w-1/2 flex justify-center"
          variants={shouldReduceMotion ? {} : imageVariants}
          initial={{  x: 100, y: 30}}
          whileInView={{  x: 0, y:0 }}
          transition={{ duration: 1.7,
            ease: "easeIn", // Custom cubic-bezier for smooth, snappy feel
            when: 'beforeChildren',}}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="relative w-full max-w-sm overflow-hidden rounded-2xl shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]">
            <img
              src={urlFor(aboutData.image).width(400).height(400).url()}
              alt="Dave, Frontend Developer"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/60 to-transparent" />
            <div className="absolute bottom-4 left-4 text-sm font-medium text-gray-200 bg-indigo-950/80 px-3 py-1 rounded-full backdrop-blur-sm">
              Frontend Developer
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;