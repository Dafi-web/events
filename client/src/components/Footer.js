import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import DafiTechLogo from './DafiTechLogo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' },
  ];

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Events', href: '/events' },
    { name: 'News', href: '/news' },
    { name: 'Directory', href: '/directory' },
    { name: 'Join Us', href: '/join' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <span className="text-2xl font-bold text-primary-400">DafiTech</span>
            </Link>
            <p className="text-gray-300 mb-6">
              Connecting members around the world — celebrating culture, unity, and progress.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="text-gray-400 hover:text-primary-400 transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-primary-400 mr-3" />
                <span className="text-gray-300">contact@dafitech.org</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-primary-400 mr-3" />
                <span className="text-gray-300">+31686371240</span>
              </div>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-primary-400 mr-3 mt-1" />
                <span className="text-gray-300">
                  Global Community<br />
                  Connecting Worldwide
                </span>
              </div>
            </div>
          </div>

          {/* Mission */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Mission</h3>
            <p className="text-gray-300 mb-4">
              To unite, empower, and represent our community globally through culture, collaboration, and shared values.
            </p>
            <Link
              to="/join"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Join Our Community
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
              <p className="text-gray-400 text-sm">
                © {currentYear} DafiTech. All rights reserved.
              </p>
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <span>Website by</span>
                <a
                  href="https://dev.dafitech.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 hover:text-orange-400 transition-colors"
                  title="Visit Dawit Abrha's portfolio"
                >
                  <DafiTechLogo size="h-4" showName={true} />
                  <span className="font-semibold">Dawit Abrha</span>
                  <span className="hidden sm:inline text-xs text-gray-500">(Founder)</span>
                  <span className="hidden md:inline text-xs text-orange-300">dev.dafitech.org</span>
                </a>
              </div>
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

