import React, { useMemo, useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FaEnvelope, FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa';
import { client } from '../client'; // Assuming you have a Sanity client setup

// Map icon strings to React components
const iconMap = {
  FaEnvelope: FaEnvelope,
  FaTwitter: FaTwitter,
  FaGithub: FaGithub,
  FaLinkedin: FaLinkedin,
};

// Animation Variants (unchanged)
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
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut', delay: 0.2 } },
};

const inputVariants = {
  focus: { scale: 1.02, borderColor: '#14b8a6', boxShadow: '0 0 10px rgba(6, 182, 212, 0.5)' },
  blur: { scale: 1, borderColor: 'rgba(79, 70, 229, 0.2)', boxShadow: 'none' },
};

const buttonVariants = {
  hover: { scale: 1.05, boxShadow: '0 0 15px rgba(6, 182, 212, 0.5)' },
  tap: { scale: 0.95 },
};

const Contact = () => {
  const shouldReduceMotion = useReducedMotion();
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ submitting: false, success: null, error: null });

  // Fetch Contact Data from Sanity
  useEffect(() => {
    client
      .fetch(
        `*[_type == "contact"][0]{
          title,
          description,
          socialLinks[]{
            name,
            link,
            icon,
            ariaLabel
          },
          formspreeEndpoint
        }`
      )
      .then((data) => {
        setContactData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching contact data:', err);
        setLoading(false);
      });
  }, []);

  // Fallback Data
  const fallbackData = {
    title: 'Get in Touch',
    description: 'Let’s collaborate to bring your ideas to life. Drop me a message or connect with me online!',
    socialLinks: [
      {
        id: 1,
        name: 'Email',
        icon: 'FaEnvelope',
        link: 'mailto:davidetalong@gmail.com',
        ariaLabel: 'Email Dave',
      },
      {
        id: 2,
        name: 'Twitter',
        icon: 'FaTwitter',
        link: 'https://twitter.com/dave',
        ariaLabel: 'Visit Dave on Twitter',
      },
      {
        id: 3,
        name: 'GitHub',
        icon: 'FaGithub',
        link: 'https://github.com/dave',
        ariaLabel: 'Visit Dave on GitHub',
      },
      {
        id: 4,
        name: 'LinkedIn',
        icon: 'FaLinkedin',
        link: 'https://linkedin.com/in/dave',
        ariaLabel: 'Visit Dave on LinkedIn',
      },
    ],
    formspreeEndpoint: 'https://formspree.io/f/mwpolkno',
  };

  const data = contactData || fallbackData;
  const socialLinks = useMemo(() => data.socialLinks, [data.socialLinks]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setStatus({ submitting: false, success: null, error: null });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', email: '', message: '' };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setStatus({ submitting: true, success: null, error: null });

    try {
      const response = await fetch(data.formspreeEndpoint || fallbackData.formspreeEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus({ submitting: false, success: 'Message sent successfully!', error: null });
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      setStatus({ submitting: false, success: null, error: 'An error occurred. Please try again later.' });
    }
  };

  // Loading State
  if (!contactData) return null;
  return (
    <motion.section
      id="contact"
      className="relative w-full bg-gradient-to-br from-gray-900 via-indigo-950 to-cyan-900 py-20 font-sans text-white overflow-hidden px-10 md:px-20"
      // initial={{ opacity: 0, y: 30 }}
      // whileInView={{ opacity: 1, y: 0 }}
      // transition={{
      //   duration: 1.7,
      //   ease: 'easeIn',
      //   when: 'beforeChildren',
      // }}
      // viewport={{ once: true, amount: 0.2 }}
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
          transition={{ duration: 1,
          ease: "easeIn", // Custom cubic-bezier for smooth, snappy feel
          when: 'beforeChildren',}}
        >
          <motion.h2
            className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-400"
            variants={shouldReduceMotion ? {} : textVariants}
            custom={0}
          >
            {data.title}
          </motion.h2>
          <motion.p
            className="mt-4 text-base sm:text-lg leading-relaxed text-gray-200 max-w-2xl mx-auto"
            variants={shouldReduceMotion ? {} : textVariants}
            custom={1}
          >
            {data.description}
          </motion.p>
        </motion.div>

        {/* Contact Form and Social Links */}
        <motion.div className="mt-12 flex flex-col lg:flex-row lg:gap-12 md:px-20"
        initial={{  opacity: 0, y: 30}}
        whileInView={{  opacity: 1, y:0 }}
        transition={{ duration: 1,
        ease: "easeIn", // Custom cubic-bezier for smooth, snappy feel
        when: 'beforeChildren',}}
        >
          {/* Contact Form */}
          <motion.div
            className="lg:w-2/3 bg-indigo-950/80 p-8 rounded-2xl shadow-lg backdrop-blur-sm border border-indigo-600/20 transition-all hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]"
            variants={shouldReduceMotion ? {} : cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -5 }}
          >
            <form onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-200">
                    Name
                  </label>
                  <motion.input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`mt-2 w-full p-3 bg-indigo-900/50 border border-indigo-600/20 rounded-lg text-gray-200 focus:outline-none transition-all ${
                      errors.name ? 'border-red-400' : ''
                    }`}
                    variants={inputVariants}
                    whileFocus="focus"
                    animate="blur"
                    aria-invalid={errors.name ? 'true' : 'false'}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-1 text-xs text-red-400">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                    Email
                  </label>
                  <motion.input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`mt-2 w-full p-3 bg-indigo-900/50 border border-indigo-600/20 rounded-lg text-gray-200 focus:outline-none transition-all ${
                      errors.email ? 'border-red-400' : ''
                    }`}
                    variants={inputVariants}
                    whileFocus="focus"
                    animate="blur"
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-1 text-xs text-red-400">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-200">
                  Message
                </label>
                <motion.textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className={`mt-2 w-full p-3 bg-indigo-900/50 border border-indigo-600/20 rounded-lg text-gray-200 focus:outline-none transition-all ${
                    errors.message ? 'border-red-400' : ''
                  }`}
                  variants={inputVariants}
                  whileFocus="focus"
                  animate="blur"
                  aria-invalid={errors.message ? 'true' : 'false'}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                />
                {errors.message && (
                  <p id="message-error" className="mt-1 text-xs text-red-400">
                    {errors.message}
                  </p>
                )}
              </div>
              {status.success && (
                <p className="mt-4 text-sm text-teal-400" role="alert">
                  {status.success}
                </p>
              )}
              {status.error && (
                <p className="mt-4 text-sm text-red-400" role="alert">
                  {status.error}
                </p>
              )}
              <motion.button
                type="submit"
                disabled={status.submitting}
                className={`mt-6 w-full rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 px-6 py-3 text-sm font-semibold text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 ${
                  status.submitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                variants={buttonVariants}
                whileHover={status.submitting ? {} : 'hover'}
                whileTap={status.submitting ? {} : 'tap'}
                aria-label="Submit contact form"
                aria-disabled={status.submitting}
              >
                {status.submitting ? 'Sending...' : 'Send Message'}
              </motion.button>
            </form>
          </motion.div>

          {/* Social Links */}
          <motion.div
            className="mt-8 lg:mt-0 lg:w-1/3 sm:flex flex-col items-center lg:items-start hidden"
            variants={shouldReduceMotion ? {} : sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.h3
              className="text-2xl font-semibold text-gray-100"
              variants={shouldReduceMotion ? {} : textVariants}
              custom={2}
            >
              Connect with Me
            </motion.h3>
            <motion.div
              className="mt-6 flex flex-wrap justify-center lg:justify-start gap-4"
              variants={shouldReduceMotion ? {} : textVariants}
              custom={3}
            >
              {socialLinks.map(({ name, link, icon, ariaLabel }, index) => {
                const IconComponent = iconMap[icon];
                return (
                  <motion.a
                    key={name}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-800/50 text-2xl text-teal-400 transition-all hover:bg-indigo-700/70 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] focus:outline-none focus:ring-2 focus:ring-teal-400 z-10"
                    variants={shouldReduceMotion ? {} : textVariants}
                    custom={index + 4}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={ariaLabel}
                  >
                    {IconComponent ? <IconComponent className="text-teal-400" /> : null}
                    <span className="sr-only">{name}</span>
                  </motion.a>
                );
              })}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Contact;