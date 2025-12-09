import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-neutral text-neutral-content p-10 mt-12">
            <div className="container mx-auto footer">
                <aside>
                   <h2 className="text-3xl font-bold">LoanLink</h2>
                    <p>
                        Providing reliable microloans since 2024.<br />
                        Your trusted financial partner.
                    </p>
                </aside>
                <nav>
                    <h6 className="footer-title">Services</h6>
                    <a className="link link-hover">Branding</a>
                    <a className="link link-hover">Design</a>
                    <a className="link link-hover">Marketing</a>
                    <a className="link link-hover">Advertisement</a>
                </nav>
                <nav>
                    <h6 className="footer-title">Company</h6>
                    <a className="link link-hover">About us</a>
                    <a className="link link-hover">Contact</a>
                    <a className="link link-hover">Jobs</a>
                </nav>
                <nav>
                    <h6 className="footer-title">Social</h6>
                    <div className="grid grid-flow-col gap-4 text-2xl">
                        <a><FaFacebook /></a>
                        <a><FaTwitter /></a>
                        <a><FaLinkedin /></a>
                    </div>
                </nav>
            </div>
            <div className="footer footer-center p-4 border-t border-gray-600 mt-10">
                <aside>
                    <p>Copyright © 2024 - All right reserved by LoanLink Industries Ltd</p>
                </aside>
            </div>
        </footer>
    );
};

export default Footer;