import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      
      {/* 1. Simple Navbar (Consistent with Home) */}
      <nav className="w-full bg-white/70 backdrop-blur-lg border-b border-gray-100 py-4 px-6 fixed top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 font-extrabold text-2xl text-blue-600">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-lg">A</div>
            AskDoc
          </Link>
          <Link to="/" className="text-gray-500 hover:text-blue-600 font-medium transition">
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-16">
        <div className="flex flex-col md:flex-row items-center gap-16">
          
          {/* Text Content */}
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
              Bridging the Gap Between <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                Patients & Providers.
              </span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              AskDoc was founded with a simple mission: to make high-quality healthcare accessible to everyone, everywhere. We believe that distance shouldn't prevent you from getting the care you deserve.
            </p>
            <div className="flex gap-8 pt-4">
              <div>
                <p className="text-3xl font-bold text-blue-600">10k+</p>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Patients Served</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-600">50+</p>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Specialists</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-600">24/7</p>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Support</p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="md:w-1/2 relative">
            <div className="absolute inset-0 bg-blue-100 rounded-3xl transform rotate-3"></div>
            <img 
              src="https://img.freepik.com/free-photo/doctors-day-curly-handsome-cute-guy-medical-uniform-holding-hands-together-smiling_140725-162876.jpg" 
              alt="Our Mission" 
              className="relative rounded-3xl shadow-2xl transform -rotate-2 hover:rotate-0 transition-all duration-500"
            />
          </div>
        </div>
      </div>

      {/* 3. "Why Choose Us" Grid */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why AskDoc?</h2>
            <p className="text-gray-500 mt-2">We prioritize your health and privacy above all else.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Certified Specialists",
                desc: "Every doctor on our platform is vetted, verified, and highly experienced in their field.",
                icon: "👨‍⚕️"
              },
              {
                title: "Secure & Private",
                desc: "Your medical data is encrypted with enterprise-grade security. Your privacy is our priority.",
                icon: "🔒"
              },
              {
                title: "Affordable Care",
                desc: "Transparent pricing with no hidden fees. Quality healthcare shouldn't break the bank.",
                icon: "💳"
              }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default About;