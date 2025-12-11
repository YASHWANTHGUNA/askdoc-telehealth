import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      
      {/* 1. Navbar: Glassmorphism Effect */}
      <nav className="fixed w-full z-50 top-0 transition-all duration-300 bg-white/70 backdrop-blur-lg border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
             <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-500">
               AskDoc
             </span>
          </div>
          <div className="hidden md:flex gap-8 items-center font-medium text-gray-600">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <Link to="/about" className="hover:text-blue-600 transition-colors">About</Link>
            <Link to="/signup" className="px-6 py-2.5 bg-blue-600 text-white rounded-full font-semibold shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all duration-300">
              Join Now
            </Link>
            <Link to="/login" className="px-6 py-2.5 text-blue-600 border-2 border-blue-100 rounded-full font-semibold hover:bg-blue-50 transition-all">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section: Modern & Clean */}
      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-0 left-0 -ml-20 -mt-20 w-[600px] h-[600px] bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            
            {/* Left Content */}
            <div className="md:w-1/2 space-y-8 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-bold tracking-wide uppercase shadow-sm">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                24/7 Online Consultation
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight">
                Healthcare <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                  Reimagined.
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-500 max-w-lg mx-auto md:mx-0 leading-relaxed">
                Experience the future of medicine. Connect with top-tier specialists instantly via secure video calls, right from your home.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link to="/signup" className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-xl shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-1 transition-all">
                  Get Started
                </Link>
                <a href="#services" className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold text-lg shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all text-center">
                  Learn More
                </a>
              </div>

              <div className="pt-6 flex items-center justify-center md:justify-start gap-4 text-sm text-gray-400 font-semibold">
                <span>TRUSTED BY</span>
                <div className="h-px w-12 bg-gray-200"></div>
                <div className="flex gap-4 opacity-60 grayscale hover:grayscale-0 transition-all">
                   <span>Health+</span>
                   <span>MediCare</span>
                   <span>Doc.io</span>
                </div>
              </div>
            </div>

            {/* Right Image with Decor */}
            <div className="md:w-1/2 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-[2rem] transform rotate-3 scale-95 opacity-20 blur-lg"></div>
              <img 
                src="https://img.freepik.com/free-photo/team-young-specialist-doctors-standing-corridor-hospital_1303-21199.jpg" 
                alt="Doctors Team" 
                className="relative rounded-[2rem] shadow-2xl border-4 border-white transform hover:scale-[1.02] transition-transform duration-500"
              />
              
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl flex items-center gap-3 animate-bounce-slow">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  ✓
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Patients Served</p>
                  <p className="text-xl font-bold text-gray-900">10k+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Services Section: Lift-up Cards */}
      <section id="services" className="py-24 bg-white relative"></section>
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">World-Class Services</h2>
            <p className="text-gray-500 text-lg">Comprehensive care that brings the hospital to your living room.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: "Virtual Consultation", 
                desc: "HD Video calls with specialists.",
                icon: "🎥",
                color: "bg-blue-50 text-blue-600"
              },
              { 
                title: "Instant Appointments", 
                desc: "Book in seconds, skip the wait.",
                icon: "📅",
                color: "bg-purple-50 text-purple-600"
              },
              { 
                title: "Digital Pharmacy", 
                desc: "Prescriptions delivered to you.",
                icon: "💊",
                color: "bg-green-50 text-green-600"
              }
            ].map((service, index) => (
              <div key={index} className="group p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                <div className={`w-14 h-14 ${service.color} rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-500 leading-relaxed mb-6">{service.desc}</p>
                <span className="text-sm font-bold text-blue-600 group-hover:underline">Learn more →</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer (Simple) */}
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">AskDoc</h2>
          <p className="text-gray-400 mb-8">Making healthcare accessible for everyone.</p>
          <div className="flex justify-center gap-6 text-gray-500">
            <span className="hover:text-white cursor-pointer transition">Twitter</span>
            <span className="hover:text-white cursor-pointer transition">LinkedIn</span>
            <span className="hover:text-white cursor-pointer transition">Instagram</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;