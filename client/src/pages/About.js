import React from 'react';
import { Heart, Globe, Lightbulb, Users, Target, Eye, Award, Shield, Code, Monitor, Smartphone, Database, Building2, BookOpen, Calendar, Zap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import DafiTechLogo from '../components/DafiTechLogo';
import TeamMembers from '../components/TeamMembers';

const About = () => {
  const { t } = useLanguage();
  const values = [
    {
      icon: Building2,
      title: 'Business Growth',
      description: 'We empower entrepreneurs and businesses to reach their full potential through our comprehensive platform.'
    },
    {
      icon: Calendar,
      title: 'Community Events',
      description: 'Connecting professionals through networking events, workshops, and collaborative opportunities.'
    },
    {
      icon: BookOpen,
      title: 'Continuous Learning',
      description: 'Providing access to quality education and skill development programs for career advancement.'
    },
    {
      icon: Users,
      title: 'Professional Network',
      description: 'Building strong connections between professionals across industries and geographical boundaries.'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'Embracing cutting-edge technology and modern solutions to drive business success.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Striving for the highest standards in everything we do, from platform features to user experience.'
    }
  ];

  const teamMembers = [
    {
      name: 'Dawit Abrha',
      role: 'Founder & CEO',
      bio: 'M.Sc. in Electrical & Computer Engineering, MERN Full Stack Expert. University lecturer and entrepreneur passionate about technology and business growth. Founder of DafiTech with a vision to connect the Ethiopian diaspora through technology.',
      bioAmharic: 'በኤሌክትሪክ እና ኮምፒውተር ምህንድስና ውስጥ M.Sc.፣ MERN ፉል ስታክ ሙያዊ። የዩኒቨርሲቲ አስተማሪ እና ተገቢያ ሰው። የDafiTech መስራች።',
      image: '/api/placeholder/300/300'
    },
    {
      name: 'Fikadu Shewit',
      role: 'Program Manager & Telecommunications Engineer',
      bio: 'Telecommunications Engineer with extensive experience in lecturing and advising student projects. University lecturer with expertise in program development and educational management, passionate about connecting people through technology and education.',
      bioAmharic: 'የቴሌኮሙኒኬሽን ምህንድስና፣ በማስተማር እና በተማሪ ፕሮጀክቶች ምክር ሰጪነት በርካታ ልምድ ያለው። የዩኒቨርሲቲ አስተማሪ በፕሮግራም ልማት እና በትምህርት አያያዝ ሙያዊ።',
      image: '/api/placeholder/300/300'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative text-white py-20 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-purple-700/90 to-indigo-800/90"></div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-4 h-4 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0s', animationDuration: '2s'}}></div>
          <div className="absolute top-20 right-20 w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '1s', animationDuration: '2.5s'}}></div>
          <div className="absolute bottom-20 left-20 w-5 h-5 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '2s', animationDuration: '3s'}}></div>
          <div className="absolute bottom-10 right-10 w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.5s', animationDuration: '2.2s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6 animate-fade-in-up">
              <DafiTechLogo size="h-16" showName={true} animated={true} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up" style={{animationDelay: '0.2s'}}>About DafiTech</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              Your comprehensive platform for business growth, professional networking, and continuous learning.
            </p>
          </div>
        </div>
      </section>

      {/* Platform Overview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Zap className="w-16 h-16 text-blue-600 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">What is DafiTech?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              DafiTech is a comprehensive digital platform designed to empower professionals, entrepreneurs, 
              and learners in today's competitive business environment.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Platform</h3>
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong>Business Directory:</strong> Showcase your business to a global audience<br/>
                  <strong>Event Management:</strong> Host and discover professional events<br/>
                  <strong>Learning Platform:</strong> Access expert-led courses and training<br/>
                  <strong>Networking:</strong> Connect with like-minded professionals
                </p>
                <p>
                  DafiTech serves as a one-stop solution for professionals looking to grow their business, 
                  expand their network, and advance their careers through continuous learning.
                </p>
                <p>
                  Our platform combines modern technology with user-friendly design to create an 
                  engaging experience for all users.
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h3>
              <div className="space-y-4 text-gray-600">
                <p>
                  To democratize access to business opportunities, professional development, and 
                  educational resources for individuals and organizations worldwide.
                </p>
                <p>
                  We believe that everyone deserves access to the tools and connections needed to 
                  succeed in today's digital economy, regardless of their background or location.
                </p>
                <p>
                  By fostering a supportive community and providing cutting-edge technology, 
                  we help our users achieve their professional and personal goals.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Vision</h3>
              <div className="space-y-4 text-gray-600">
                <p>
                  To become the leading global platform that connects professionals, empowers businesses, 
                  and facilitates continuous learning across all industries.
                </p>
                <p>
                  We envision a world where geographical boundaries don't limit professional growth, 
                  where knowledge is freely shared, and where every business has the opportunity to thrive.
                </p>
                <p>
                  Our goal is to create a sustainable ecosystem that benefits all stakeholders 
                  while driving innovation and economic growth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Target className="w-16 h-16 text-blue-600 mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                To empower professionals and businesses worldwide by providing a comprehensive platform 
                that combines business networking, event management, and educational resources.
              </p>
              <p className="text-lg text-gray-600">
                We strive to break down barriers to professional success by creating an inclusive 
                environment where everyone can learn, grow, and connect with opportunities that 
                match their ambitions and skills.
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-8">
              <div className="text-center">
                <Globe className="w-20 h-20 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Global Impact</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-blue-600">500+</div>
                    <div className="text-gray-600">Businesses</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600">10K+</div>
                    <div className="text-gray-600">Users</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600">1000+</div>
                    <div className="text-gray-600">Events</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600">50+</div>
                    <div className="text-gray-600">Courses</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Eye className="w-16 h-16 text-purple-600 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Vision</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-gray-600 mb-6">
                A world where every professional has access to the tools, connections, and knowledge 
                needed to achieve their full potential, regardless of their background or location.
              </p>
              <p className="text-lg text-gray-600">
                We envision DafiTech as the central hub where businesses grow, professionals connect, 
                and learners advance their careers through a seamless, integrated platform that 
                adapts to the evolving needs of the modern workforce.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Award className="w-16 h-16 text-indigo-600 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Platform Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive tools and resources designed to support your professional journey
            </p>
          </div>
          
          <div className="space-y-8">
            {/* Business Directory */}
            <div className="bg-white rounded-lg p-8 shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Business Directory</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-blue-600 mb-2">Business Listings</h4>
                  <p className="text-gray-600">
                    Create detailed business profiles with services, contact information, and customer reviews. 
                    Reach a global audience and increase your visibility.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-blue-600 mb-2">Search & Discovery</h4>
                  <p className="text-gray-600">
                    Advanced search filters help customers find exactly what they're looking for, 
                    while businesses get discovered by their target audience.
                  </p>
                </div>
              </div>
            </div>

            {/* Events & Networking */}
            <div className="bg-white rounded-lg p-8 shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Events & Networking</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-purple-600 mb-2">Event Management</h4>
                  <p className="text-gray-600">
                    Host professional events, workshops, and networking sessions. Manage attendees, 
                    collect feedback, and track engagement metrics.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-purple-600 mb-2">Professional Networking</h4>
                  <p className="text-gray-600">
                    Connect with industry peers, potential clients, and business partners. 
                    Build meaningful relationships that drive career and business growth.
                  </p>
                </div>
              </div>
            </div>

            {/* Learning Platform */}
            <div className="bg-white rounded-lg p-8 shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Learning Platform</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-indigo-600 mb-2">Expert Courses</h4>
                  <p className="text-gray-600">
                    Access high-quality courses taught by university lecturers with Master's degrees. 
                    From technical skills to business development, advance your career with structured learning paths.
                    <br /><br />
                    <span className="text-amharic">በማስተርስ ዲግሪ ያላቸው የዩኒቨርሲቲ ፕሮፌሰሮች የሚሰጡ ከፍተኛ ጥራት ያላቸው ኮርሶችን ይደርሱ። 
                    ከቴክኒካል ክህሎቶች እስከ የንግድ ልማት፣ በዋና ዋና የትምህርት መንገዶች ተሳትፎ ያድርጉ።</span>
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-indigo-600 mb-2">Certification Programs</h4>
                  <p className="text-gray-600">
                    Earn recognized certificates upon course completion. Showcase your skills 
                    and stand out in the competitive job market.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Shield className="w-16 h-16 text-green-600 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide our platform and shape our commitment to user success.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div 
                  key={index} 
                  className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-2 hover:scale-105 animate-fade-in-up"
                  style={{animationDelay: `${index * 0.2}s`}}
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce" style={{animationDelay: `${index * 0.2 + 0.5}s`}}>
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Users className="w-16 h-16 text-purple-600 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the dedicated professionals who are building the future of professional networking and learning.
            </p>
          </div>
          
          <TeamMembers />
        </div>
      </section>

      {/* Community Impact */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Platform Impact</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Together, we're creating a more connected and empowered professional community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600 font-medium">Business Listings</div>
              <div className="text-sm text-gray-500 mt-1">Supporting entrepreneurs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">1000+</div>
              <div className="text-gray-600 font-medium">Events Hosted</div>
              <div className="text-sm text-gray-500 mt-1">Building connections</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">50+</div>
              <div className="text-gray-600 font-medium">Learning Courses</div>
              <div className="text-sm text-gray-500 mt-1">Advancing careers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">10K+</div>
              <div className="text-gray-600 font-medium">Active Users</div>
              <div className="text-sm text-gray-500 mt-1">Growing community</div>
            </div>
          </div>
        </div>
      </section>

      {/* Web Development Services */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <DafiTechLogo size="h-12" showName={true} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Web Development Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              This platform was built by <strong>Dawit Abrha</strong> - Professional Full-Stack Developer
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Monitor className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Responsive Websites</h3>
              <p className="text-gray-600">Modern, mobile-friendly websites that work perfectly on all devices</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Custom Development</h3>
              <p className="text-gray-600">Tailored solutions built with React, Node.js, and modern technologies</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Database Integration</h3>
              <p className="text-gray-600">MongoDB, file storage, and backend systems for your business needs</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Mobile Apps</h3>
              <p className="text-gray-600">Cross-platform mobile applications for iOS and Android</p>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Need a Website or App?</h3>
              <p className="text-gray-600 mb-6">
                Contact <strong>Dawit Abrha</strong> for professional web development services. 
                From simple websites to complex applications, I can help bring your ideas to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:contact@dafitech.org"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Get a Quote
                </a>
                <a
                  href="mailto:contact@dafitech.org"
                  className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors"
                >
                  View Portfolio
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join DafiTech Today</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Be part of a growing community that's transforming how professionals connect, 
            learn, and grow their businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/join"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Get Started
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;