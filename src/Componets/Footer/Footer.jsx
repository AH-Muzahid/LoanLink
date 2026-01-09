import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import ftbg from '../../assets/footer bg.png';
import car from '../../assets/car.gif';
import cycle from '../../assets/cycle.gif';

import Reveal from '../../Componets/Shared/Reveal';

const Footer = () => {
    const footerLinks = [
        {
            title: 'Services',
            links: [
                { name: 'Loan Products', path: '/all-loans' },
                { name: 'EMI Calculator', path: '/' }, // Anchored to calculator section usually, or stay on home
                { name: 'Support', path: '/contact' }
            ]
        },
        {
            title: 'Company',
            links: [
                { name: 'Home', path: '/' },
                { name: 'About us', path: '/about' },
                { name: 'Contact', path: '/contact' }
            ]
        }
    ];

    const socialLinks = [
        { icon: FaFacebook, label: 'Facebook', url: 'https://facebook.com' },
        { icon: FaXTwitter, label: 'Twitter', url: 'https://twitter.com' },
        { icon: FaLinkedin, label: 'LinkedIn', url: 'https://linkedin.com' }
    ];

    return (
        <footer
            className="mb-1 bg-[#dddddd] md:h-120 relative overflow-hidden"
            style={{ backgroundImage: `url(${ftbg})`, backgroundSize: "fit", backgroundRepeat: "no-repeat", backgroundPosition: "bottom" }}
        >
            <div className="footer-content py-10 sm:py-15 px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-5">
                        {/* Brand Section */}
                        <Reveal>
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">LoanLink</h2>
                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                Providing reliable microloans since 2024. Your trusted financial partner for growth.
                            </p>
                        </Reveal>

                        {/* Links Sections */}
                        {footerLinks.map((section, idx) => (
                            <Reveal key={idx} delay={idx * 0.1}>
                                <div>
                                    <h6 className="text-lg font-bold text-gray-900 mb-4">{section.title}</h6>
                                    <ul className="space-y-2">
                                        {section.links.map((link, i) => (
                                            <li key={i}>
                                                <Link
                                                    to={link.path}
                                                    className="text-gray-600 hover:text-[#cf2829] transition-colors text-sm sm:text-base font-medium flex items-center gap-1 group"
                                                >
                                                    <span className="w-0 group-hover:w-1.5 h-1.5 rounded-full bg-[#cf2829] transition-all opacity-0 group-hover:opacity-100"></span>
                                                    {link.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </Reveal>
                        ))}

                        {/* Social Section */}
                        <Reveal delay={0.2}>
                            <h6 className="text-lg font-bold text-gray-900 mb-4">Follow Us</h6>
                            <div className="flex gap-4">
                                {socialLinks.map((social, i) => {
                                    const Icon = social.icon;
                                    return (
                                        <motion.a
                                            key={i}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ scale: 1.2, rotate: 8 }}
                                            className="w-12 h-12 rounded-full bg-indigo-100  flex items-center justify-center text-[#cf2829] hover:bg-[#cf2829] hover:text-white transition-all shadow-md"
                                            title={social.label}
                                        >
                                            <Icon className="text-xl" />
                                        </motion.a>
                                    );
                                })}
                            </div>
                        </Reveal>
                    </div>

                    {/* Divider */}
                    <div className="">
                        <p className="text-center text-sm sm:text-base">
                            © 2024 LoanLink. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>

            {/* Car and Cycle Animation */}
            <motion.div className="absolute bottom-0 left-0 w-full">
                {/* Car Image */}
                <motion.img
                    className="w-fit h-32 sm:h-40"
                    animate={{ x: ['-100%', '120vw'] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    src={car}
                    alt="Car"
                />

                {/* Cycle Image */}
                <motion.img
                    className="w-20 sm:w-24 h-auto -mt-24 sm:-mt-31.5"
                    animate={{ x: ['-100%', '120vw'] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    src={cycle}
                    alt="Cycle"
                />
            </motion.div>
        </footer>
    );
};

export default Footer;
