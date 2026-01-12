import React from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebook, FaLinkedin, FaGithub, FaPaperPlane } from 'react-icons/fa';
import Reveal from '../../Componets/Shared/Reveal';
import SEO from '../../Componets/Shared/SEO';

const Contact = () => {
    return (
        <div className="min-h-screen max-w-8xl mx-auto bg-base-100">
            <SEO
                title="Contact Support"
                description="Get in touch with AH Muzahid. Available for freelance projects and full-time opportunities."
                keywords="Contact AH Muzahid, Web Developer Contact, Hire React Developer, LoanLinks Support"
            />
            {/* Hero Section */}
            <div className="relative pt-32 pb-20 bg-[#B91116] text-white overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <Reveal>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Let's Connect
                        </h1>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <p className="text-lg text-white/80 max-w-2xl mx-auto">
                            Open for opportunities, collaborations, and discussions.
                        </p>
                    </Reveal>
                </div>
            </div>

            <div className="container max-w-6xl mx-auto px-4 py-16 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

                    {/* Contact Info */}
                    <div className="lg:col-span-1 space-y-8">
                        <Reveal>
                            <div>
                                <h3 className="text-2xl font-bold mb-6 text-[#B91116]">Contact Details</h3>
                                <p className="text-base-content/70 mb-8">
                                    Feel free to reach out directly via email or phone.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-[#B91116]/10 rounded-full flex items-center justify-center text-[#B91116] text-xl shrink-0">
                                        <FaPhoneAlt />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">Phone</h4>
                                        <p className="text-base-content/70">+880 1312-009084</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-[#B91116]/10 rounded-full flex items-center justify-center text-[#B91116] text-xl shrink-0">
                                        <FaEnvelope />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">Email</h4>
                                        <p className="text-base-content/70">ahmuzahid40@gmail.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-[#B91116]/10 rounded-full flex items-center justify-center text-[#B91116] text-xl shrink-0">
                                        <FaMapMarkerAlt />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">Location</h4>
                                        <p className="text-base-content/70">
                                            Rajshahi, Bangladesh
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-base-200">
                                <h4 className="font-bold text-lg mb-4">Social Profiles</h4>
                                <div className="flex gap-4">
                                    <a href="https://github.com/AH-Muzahid" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center hover:bg-[#B91116] hover:text-white transition-all duration-300">
                                        <FaGithub />
                                    </a>
                                    <a href="https://www.linkedin.com/in/ali-hasan-muzahid/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center hover:bg-[#0077B5] hover:text-white transition-all duration-300">
                                        <FaLinkedin />
                                    </a>
                                    <a href="https://www.facebook.com/ah.muzahid.2025" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all duration-300">
                                        <FaFacebook />
                                    </a>
                                </div>
                            </div>
                        </Reveal>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <Reveal delay={0.2}>
                            <div className="bg-base-100 p-8 md:p-10 rounded-3xl shadow-xl border border-base-200">
                                <h3 className="text-2xl font-bold mb-8">Send us a Message</h3>
                                <form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">First Name</span>
                                            </label>
                                            <input type="text" placeholder="Rahim" className="input input-bordered focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116] w-full" />
                                        </div>
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">Last Name</span>
                                            </label>
                                            <input type="text" placeholder="Ahmed" className="input input-bordered focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116] w-full" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">Email Address</span>
                                            </label>
                                            <input type="email" placeholder="rahim@example.com" className="input input-bordered focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116] w-full" />
                                        </div>
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">Phone Number</span>
                                            </label>
                                            <input type="tel" placeholder="+880 1700-000000" className="input input-bordered focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116] w-full" />
                                        </div>
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium">Subject</span>
                                        </label>
                                        <select className="select select-bordered focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116] w-full">
                                            <option disabled selected>Select a topic</option>
                                            <option>Loan Application</option>
                                            <option>Repayment Query</option>
                                            <option>Technical Support</option>
                                            <option>Partnership</option>
                                            <option>Other</option>
                                        </select>
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium">Message</span>
                                        </label>
                                        <textarea className="textarea textarea-bordered h-32 focus:border-[#B91116] focus:ring-1 focus:ring-[#B91116] w-full" placeholder="How can we help you?"></textarea>
                                    </div>

                                    <button className="btn bg-[#B91116] hover:bg-[#900d11] text-white w-full md:w-auto px-8 gap-2 h-12 text-base shadow-lg shadow-[#B91116]/20">
                                        <FaPaperPlane /> Send Message
                                    </button>
                                </form>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </div>

            {/* Map Section */}
            <div className="h-110 w-full bg-base-200 relative">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58144.97576596356!2d88.57095034863281!3d24.374649733232!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fb24671e935495%3A0x2f8774066315c8ba!2sRajshahi!5e0!3m2!1sen!2sbd!4v1708320000000!5m2!1sen!2sbd"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    title="Google Maps"
                    className="grayscale hover:grayscale-0 transition-all duration-500"
                ></iframe>
            </div>
        </div>
    );
};

export default Contact;