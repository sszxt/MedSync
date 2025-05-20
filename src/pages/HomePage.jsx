import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaHeartbeat,
  FaCalendarAlt,
  FaUserMd,
  FaFileAlt,
  FaLock,
  FaDatabase,
  FaChartLine,
  FaUsers,
  FaChevronRight,
  FaCheckCircle,
  FaQuoteLeft,
  FaHome,
  FaQuestionCircle,
  FaComments,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";

// Main Homepage Component
export default function Homepage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("patientLogin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regName, setRegName] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [error, setError] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePatientLogin = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/auth/login", { email, password })
      .then((res) => {
        if (res.data.token) {
          localStorage.setItem("token", res.data.token); // Store JWT token in localStorage
          localStorage.setItem("user", JSON.stringify(res.data.user));
          navigate("/patientdashboard"); // Redirect to patient dashboard
        }
      })
      .catch((err) => {
        console.log(err);
        setError("Login failed. Please check your credentials.");
      });
  };

  const handlePatientRegister = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/auth/register", {
        name: regName,
        email: regEmail,
        password: regPassword,
      })
      .then((res) => {
        if (res.data.message === "User registered successfully") {
          window.alert("Successfully registered!");
          navigate("/"); // Navigate to login page
        }
      })
      .catch((err) => {
        console.log(err);
        setError("Registration failed. Please try again.");
      });
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminEmail === "abcd@gmail.com" && adminPassword === "123") {
      navigate("/Dashboard");
    } else {
      setError("Invalid admin email or password.");
    }
  };

  const openAuthModal = (tab = "patientLogin") => {
    setActiveTab(tab);
    setShowAuthModal(true);
    setError("");
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-2"
            >
              <div className="p-2 rounded-full bg-indigo-100 text-indigo-600">
                <FaHeartbeat className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
                MedSync
              </span>
            </motion.div>

            <nav className="hidden md:flex items-center space-x-8">
              {["features", "how-it-works", "testimonials", "faq"].map(
                (item) => (
                  <motion.button
                    key={item}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => scrollToSection(item)}
                    className="text-gray-700 hover:text-indigo-600 font-medium capitalize"
                  >
                    {item.replace("-", " ")}
                  </motion.button>
                )
              )}
            </nav>

            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/login")}
                className="px-4 py-2 rounded-lg text-indigo-600 font-medium hover:bg-indigo-50 transition-colors"
              >
                Login/Signup
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:w-1/2"
              >
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Your Medical Records,{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500">
                    Secured
                  </span>{" "}
                  with Blockchain
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Safely store and access your medical records anytime,
                  anywhere. Enhanced with AI assistance and seamless appointment
                  booking.
                </p>
                <div className="flex flex-wrap gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openAuthModal("patientRegister")}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-500 text-white font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    Get Started
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => scrollToSection("features")}
                    className="px-6 py-3 rounded-lg border border-indigo-600 text-indigo-600 font-medium hover:bg-indigo-50 transition-colors"
                  >
                    Learn More
                  </motion.button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:w-1/2"
              >
                <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 transform hover:scale-[1.02] transition-transform duration-300">
                  <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <FaHeartbeat className="text-indigo-600" />
                      <span className="font-medium text-gray-800">
                        MedSync Dashboard
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <span className="h-3 w-3 rounded-full bg-red-400"></span>
                      <span className="h-3 w-3 rounded-full bg-yellow-400"></span>
                      <span className="h-3 w-3 rounded-full bg-green-400"></span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 rounded-lg bg-indigo-100 text-indigo-600">
                          <FaFileAlt className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            Medical Records
                          </h3>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                              className="bg-indigo-600 h-2 rounded-full"
                              style={{ width: "75%" }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
                          <FaCalendarAlt className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            Decentralized File Vault
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Your files are always available and tamper-proof.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="p-3 rounded-lg bg-pink-100 text-pink-600">
                          <FaComments className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            AI Health Assistant
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Ask me anything about your health!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Key Features
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our platform combines blockchain security with AI-powered
                healthcare solutions to provide a comprehensive medical records
                management system.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <FaLock className="h-6 w-6" />,
                  title: "Blockchain Security",
                  description:
                    "Your medical records are encrypted and stored securely, ensuring privacy and protection against unauthorized access.",
                  color: "indigo",
                },
                {
                  icon: <FaComments className="h-6 w-6" />,
                  title: "AI Medical Chatbot",
                  description:
                    "Get instant answers to your health questions with our AI-powered medical assistant, available 24/7.",
                  color: "pink",
                },
                {
                  icon: <FaFileAlt className="h-6 w-6" />,
                  title: "Decentralized File Vault",
                  description:
                    "Upload, store, and access your medical documents securely on IPFS and blockchain. Your files are always available and tamper-proof.",
                  color: "purple",
                },
                {
                  icon: <FaDatabase className="h-6 w-6" />,
                  title: "Complete Record Access",
                  description:
                    "Access your entire medical history in one place, from any device, anytime you need it.",
                  color: "blue",
                },
                {
                  icon: <FaChartLine className="h-6 w-6" />,
                  title: "Health Monitoring",
                  description:
                    "Track your health metrics and receive personalized insights and recommendations.",
                  color: "green",
                },
                {
                  icon: <FaUsers className="h-6 w-6" />,
                  title: "Provider Network",
                  description:
                    "Connect with healthcare providers who use our platform for seamless sharing of medical information.",
                  color: "yellow",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className={`bg-white rounded-xl shadow-md overflow-hidden p-6 border-l-4 border-${feature.color}-500`}
                >
                  <div
                    className={`p-3 rounded-full bg-${feature.color}-100 text-${feature.color}-600 mb-4 inline-block`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-purple-50"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our platform makes managing your medical records simple, secure,
                and accessible in just a few steps.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  number: "1",
                  title: "Create Your Secure Account",
                  description:
                    "Sign up with your email and create a secure password. We'll verify your identity to ensure your medical data stays protected.",
                },
                {
                  number: "2",
                  title: "Upload Your Medical Records",
                  description:
                    "Upload existing medical records or connect with healthcare providers who can share your records directly to our platform.",
                },
                {
                  number: "3",
                  title: "Access Anywhere, Anytime",
                  description:
                    "Your records are encrypted and stored securely. Access them from any device whenever you need them.",
                },
                {
                  number: "4",
                  title: "Use AI Assistant & Secure Vault",
                  description:
                    "Ask health questions to our AI chatbot and manage your medical files in a decentralized, secure vault powered by blockchain and IPFS.",
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden p-6"
                >
                  <div className="flex items-center mb-4">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 font-bold text-lg mr-4">
                      {step.number}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 pl-14">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section
          id="testimonials"
          className="py-16 px-4 sm:px-6 lg:px-8 bg-white"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                What Our Users Say
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Don't just take our word for it. Here's what our users have to
                say about their experience with MedSync.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Johnson",
                  role: "Patient",
                  content:
                    "Having all my medical records in one secure place has been life-changing. The AI chatbot is incredibly helpful when I have quick health questions.",
                },
                {
                  name: "Dr. Michael Chen",
                  role: "Cardiologist",
                  content:
                    "As a healthcare provider, this platform has streamlined how I access patient records. The security gives both me and my patients peace of mind.",
                },
                {
                  name: "Emma Rodriguez",
                  role: "Healthcare Administrator",
                  content:
                    "The appointment booking system has reduced our no-show rates by 40%. Patients love the reminders and easy rescheduling options.",
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden p-6 border border-gray-100"
                >
                  <div className="text-indigo-400 mb-4">
                    <FaQuoteLeft className="h-6 w-6" />
                  </div>
                  <p className="text-gray-600 italic mb-6">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold mr-4">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section
          id="faq"
          className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-purple-50"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Find answers to common questions about our platform and how it
                works.
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto">
              {[
                {
                  question: "How secure is the technology used?",
                  answer:
                    "We use advanced encryption and security protocols to ensure your medical records are protected. Our system complies with all healthcare data protection regulations including HIPAA.",
                },
                {
                  question: "Can I control who sees my medical records?",
                  answer:
                    "Yes, you have complete control over who can access your records. You can grant and revoke access permissions to healthcare providers as needed.",
                },
                {
                  question: "How accurate is the AI medical chatbot?",
                  answer:
                    "Our AI chatbot is trained on verified medical information and is designed to provide general guidance. It's not a replacement for professional medical advice, but it can help with basic questions and information.",
                },
                {
                  question: "Is there a mobile app available?",
                  answer:
                    "Yes, we offer mobile apps for both iOS and Android devices, allowing you to access your medical records on the go.",
                },
                {
                  question: "How do I upload my existing medical records?",
                  answer:
                    "You can upload documents directly through our secure interface, or you can request your healthcare providers to share records directly to your account.",
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="mb-4 last:mb-0"
                >
                  <FAQItem question={faq.question} answer={faq.answer} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-purple-500">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-white mb-6">
                Take Control of Your Medical Records Today
              </h2>
              <p className="text-lg text-indigo-100 mb-8">
                Join thousands of users who have secured their medical data with
                our platform.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openAuthModal("patientRegister")}
                className="px-8 py-3 rounded-lg bg-white text-indigo-600 font-medium shadow-lg hover:shadow-xl transition-all"
              >
                Get Started For Free
              </motion.button>
              <p className="text-indigo-100 mt-4">
                No credit card required. Start with our free plan.
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <FaHeartbeat className="text-indigo-400 h-6 w-6" />
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-300 bg-clip-text text-transparent">
                  MedSync
                </span>
              </div>
              <p className="text-gray-400">
                Secure platform for storing and managing your medical records
                with blockchain technology and AI assistance.
              </p>
            </div>

            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Security", "Providers"],
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Contact"],
              },
              {
                title: "Resources",
                links: [
                  "Help Center",
                  "Documentation",
                  "API",
                  "Privacy Policy",
                ],
              },
            ].map((group, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold text-white mb-4">
                  {group.title}
                </h3>
                <ul className="space-y-2">
                  {group.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} MedSync. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {activeTab === "patientLogin"
                    ? "Patient Login"
                    : activeTab === "patientRegister"
                    ? "Register"
                    : "Admin Login"}
                </h2>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>

              <div className="flex border-b border-gray-200 mb-6">
                <button
                  className={`flex-1 py-2 font-medium ${
                    activeTab === "patientLogin"
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => {
                    setActiveTab("patientLogin");
                    setError("");
                  }}
                >
                  Login
                </button>
                <button
                  className={`flex-1 py-2 font-medium ${
                    activeTab === "patientRegister"
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => {
                    setActiveTab("patientRegister");
                    setError("");
                  }}
                >
                  Register
                </button>
                <button
                  className={`flex-1 py-2 font-medium ${
                    activeTab === "adminLogin"
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => {
                    setActiveTab("adminLogin");
                    setError("");
                  }}
                >
                  Admin
                </button>
              </div>

              {activeTab === "patientLogin" && (
                <form onSubmit={handlePatientLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="your@email.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="******"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                  >
                    Login
                  </button>
                </form>
              )}

              {activeTab === "patientRegister" && (
                <form onSubmit={handlePatientRegister} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Your Name"
                      required
                      value={regName} // Ensure regName is set in your state
                      onChange={(e) => setRegName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="your@email.com"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="******"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                    />
                  </div>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                  >
                    Create Account
                  </button>
                </form>
              )}

              {activeTab === "adminLogin" && (
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Admin Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="admin@email.com"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="******"
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                    />
                  </div>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                  >
                    Admin Login
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// FAQ Item Component
function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-4 text-left flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900">{question}</span>
        <FaChevronRight
          className={`h-4 w-4 text-indigo-600 transition-transform ${
            isOpen ? "transform rotate-90" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-4 py-3 bg-gray-50 text-gray-600 border-t border-gray-200">
          {answer}
        </div>
      )}
    </div>
  );
}
