import { useState, useEffect } from 'react';
import { 
  Coffee, 
  Users, 
  Calendar, 
  Building, 
  Code, 
  Home as HomeIcon,
  Facebook,
  Instagram,
  Video,
  Zap,
  Shield,
  Plus,
  Sparkles,
  Dot,
  // UserCircle,
} from 'lucide-react';

import KAHITSAN_LOGO from './assets/logo.png';


export default function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);
  // const [showAccountMenu, setShowAccountMenu] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    // Observe all sections
    const sections = ['hero', 'services', 'pricing', 'coming-soon', 'community', 'connect'];
    sections.forEach(id => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // Handle scroll detection for mobile bottom nav
  useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      setIsScrolling(true);
      
      // Clear existing timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      // Set new timeout to hide scrolling state
      const newTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 500); // Hide after 1.5 seconds of no scrolling
      
      setScrollTimeout(newTimeout);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [isMobile, scrollTimeout]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Adjust scroll position for mobile to account for bottom nav
      const offset = isMobile ? -80 : -80;
      const elementPosition = element.offsetTop + offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  const sections = [
    { id: 'hero', label: 'Home', icon: <HomeIcon className="w-4 h-4" /> },
    { id: 'services', label: 'Services', icon: <Building className="w-4 h-4" /> },
    { id: 'pricing', label: 'Pricing', icon: <Coffee className="w-4 h-4" /> },
    { id: 'coming-soon', label: 'Soon', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'community', label: 'Community', icon: <Users className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ks-bg-main)' }}>
      {/* Background Effects */}
      <div className="fixed inset-0 opacity-3 pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(rgba(201, 169, 97, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(201, 169, 97, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px'
      }}></div>

      {/* Header - Fixed on Desktop, Clean on Mobile */}
      <header className={`${isMobile ? 'relative' : 'fixed top-0 left-0 right-0'} z-50 hud-glass`} style={{borderRight: 'none', borderLeft: 'none', borderTop: 'none'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div>
                <img src={KAHITSAN_LOGO} alt="KahitSan Solutions Corp" className="h-10 mr-2" />
              </div>
            </div>

            {/* Table of Contents - Desktop Only */}
            <div className="hidden lg:flex items-center gap-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded transition-all duration-200 text-xs"
                  style={{
                    backgroundColor: activeSection === section.id 
                      ? 'rgba(201, 169, 97, 0.15)' 
                      : 'transparent',
                    color: activeSection === section.id 
                      ? 'var(--ks-hud-primary)' 
                      : 'var(--ks-hud-secondary)',
                    border: activeSection === section.id 
                      ? '1px solid rgba(201, 169, 97, 0.3)' 
                      : '1px solid transparent'
                  }}
                >
                  {section.icon}
                  <span className="hud-mono">{section.label}</span>
                  {activeSection === section.id && (
                    <div className="w-1 h-1 rounded-full" 
                      style={{ backgroundColor: 'var(--ks-hud-primary)' }} />
                  )}
                </button>
              ))}
              {/* Connect section for desktop */}
              <button
                onClick={() => scrollToSection('connect')}
                className="flex items-center gap-2 px-3 py-1.5 rounded transition-all duration-200 text-xs"
                style={{
                  backgroundColor: activeSection === 'connect' 
                    ? 'rgba(201, 169, 97, 0.15)' 
                    : 'transparent',
                  color: activeSection === 'connect' 
                    ? 'var(--ks-hud-primary)' 
                    : 'var(--ks-hud-secondary)',
                  border: activeSection === 'connect' 
                    ? '1px solid rgba(201, 169, 97, 0.3)' 
                    : '1px solid transparent'
                }}
              >
                <Video className="w-4 h-4" />
                <span className="hud-mono">Connect</span>
                {activeSection === 'connect' && (
                  <div className="w-1 h-1 rounded-full" 
                    style={{ backgroundColor: 'var(--ks-hud-primary)' }} />
                )}
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              {/* <button className="px-4 py-2 rounded border hud-scan-line transition-all duration-200"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: 'rgba(201, 169, 97, 0.4)',
                  color: 'var(--ks-hud-primary)'
                }}>
                Login
              </button>
              <button className="px-4 py-2 hud-clip-button hud-scan-line transition-all duration-200"
                style={{
                  backgroundColor: 'rgba(201, 169, 97, 0.2)',
                  border: '1px solid var(--ks-hud-primary)',
                  color: 'var(--ks-hud-primary)'
                }}>
                Signup
              </button> */}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Top Padding only for Desktop Fixed Header */}
      <main className={`relative z-10 ${isMobile ? '' : 'pt-16'}`}>
        {/* Hero Section with Enhanced Background */}
        <section id="hero" className="py-16 px-4 text-center relative overflow-hidden">
          {/* Enhanced Background */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Primary color gradient overlay */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                background: `radial-gradient(ellipse at center, rgba(201, 169, 97, 0.4) 0%, rgba(201, 169, 97, 0.1) 40%, transparent 70%)`
              }}
            ></div>
            
            {/* Geometric patterns */}
            <div 
              className="absolute top-1/4 left-1/4 w-32 h-32 opacity-5 rotate-45"
              style={{
                background: 'linear-gradient(45deg, var(--ks-hud-primary), transparent)',
                clipPath: 'polygon(0 0, 80% 0, 100% 20%, 100% 100%, 20% 100%, 0 80%)'
              }}
            ></div>
            
            <div 
              className="absolute top-1/3 right-1/4 w-24 h-24 opacity-5 -rotate-12"
              style={{
                background: 'linear-gradient(135deg, var(--ks-hud-blue), transparent)',
                clipPath: 'polygon(0 0, 70% 0, 100% 30%, 100% 100%, 30% 100%, 0 70%)'
              }}
            ></div>

            {/* Subtle scan lines */}
            <div 
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 2px,
                  rgba(201, 169, 97, 0.1) 2px,
                  rgba(201, 169, 97, 0.1) 4px
                )`
              }}
            ></div>
          </div>

          <div className="max-w-4xl mx-auto relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6" 
              style={{ 
                color: 'var(--ks-hud-text)',
                lineHeight: 1.2,
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
              }}>
              Productivity starts{' '}
              <span style={{ color: 'var(--ks-hud-primary)' }}>anywhere</span>.
            </h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto" 
              style={{ 
                color: 'var(--ks-hud-secondary)',
                textShadow: '0 1px 5px rgba(0, 0, 0, 0.3)'
              }}>
              Your comfy study tambayan. KahitSan man pinanggalingan mo.
            </p>
          </div>
        </section>

        {/* Our Services Section with Distinct Background */}
        <section id="services" className="py-16 px-4 relative overflow-hidden" 
          style={{ 
            background: `
              linear-gradient(135deg, rgba(74, 158, 255, 0.03) 0%, rgba(74, 158, 255, 0.01) 50%, transparent 100%),
              linear-gradient(45deg, rgba(15, 15, 20, 0.4) 0%, rgba(20, 20, 25, 0.6) 100%)
            `
          }}>
          {/* Different Background Pattern for Visual Separation */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
            backgroundImage: `
              linear-gradient(rgba(74, 158, 255, 0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(74, 158, 255, 0.02) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px'
          }}></div>

          {/* Subtle Blue Accent Pattern */}
          <div 
            className="absolute top-1/4 right-1/3 w-20 h-20 opacity-3 rotate-12"
            style={{
              background: 'linear-gradient(45deg, var(--ks-hud-blue), transparent)',
              clipPath: 'polygon(0 0, 80% 0, 100% 20%, 100% 100%, 20% 100%, 0 80%)'
            }}
          ></div>

          <div className="max-w-4xl mx-auto relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-2 text-center" 
              style={{ color: 'var(--ks-hud-text)' }}>
              Our Services
            </h3>
            <p className="text-center mb-12" style={{ color: 'var(--ks-hud-secondary)' }}>
              Growing network of solutions for your productivity needs
            </p>

            <div className="p-8 relative overflow-hidden">
              {/* Background Text */}
              <div 
                className="absolute -top-3 -right-3 text-6xl font-black opacity-5 -rotate-12 pointer-events-none"
                style={{ 
                  color: 'var(--ks-hud-primary)',
                  fontFamily: 'var(--ks-font-digital)',
                  letterSpacing: '3px'
                }}
              >
                NETWORK
              </div>

              <div className="relative z-10">
                {/* Services Grid - Simplified without locations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  {/* Coworking Spaces - Live */}
                  <div className="hud-panel p-4 rounded">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div style={{ color: 'var(--ks-hud-primary)' }}>
                          <Coffee className="w-5 h-5" />
                        </div>
                        <div>
                          <h6 className="font-semibold text-sm" style={{ color: 'var(--ks-hud-text)' }}>
                            Coworking Spaces
                          </h6>
                          <p className="text-xs" style={{ color: 'var(--ks-hud-secondary)' }}>
                            Workspace Solutions
                          </p>
                        </div>
                      </div>
                      <div 
                        className="px-2 py-1 rounded text-xs hud-mono uppercase"
                        style={{ 
                          backgroundColor: 'rgba(0, 204, 136, 0.2)',
                          border: '1px solid rgba(0, 204, 136, 0.4)',
                          color: 'var(--ks-hud-green)'
                        }}
                      >
                        LIVE
                      </div>
                    </div>
                  </div>

                  {/* Future Services - Soon */}
                  <div className="hud-panel p-4 rounded">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div style={{ color: 'var(--ks-hud-primary)' }}>
                          <Plus className="w-5 h-5" />
                        </div>
                        <div>
                          <h6 className="font-semibold text-sm" style={{ color: 'var(--ks-hud-text)' }}>
                            Future Services
                          </h6>
                          <p className="text-xs" style={{ color: 'var(--ks-hud-secondary)' }}>
                            Expanding Network
                          </p>
                        </div>
                      </div>
                      <div 
                        className="px-2 py-1 rounded text-xs hud-mono uppercase"
                        style={{ 
                          backgroundColor: 'rgba(74, 158, 255, 0.2)',
                          border: '1px solid rgba(74, 158, 255, 0.4)',
                          color: 'var(--ks-hud-blue)'
                        }}
                      >
                        SOON
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Coworking Pricing Section with Service Indicator */}
        <section id="pricing" className="py-16 px-4 bg-white/5">
          <div className="max-w-6xl mx-auto">
            {/* Service Indicator Header */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <Coffee className="w-6 h-6" style={{ color: 'var(--ks-hud-primary)' }} />
              <div 
                className="px-3 py-1 rounded-full border text-sm hud-mono uppercase tracking-wider"
                style={{ 
                  backgroundColor: 'rgba(201, 169, 97, 0.1)',
                  borderColor: 'rgba(201, 169, 97, 0.3)',
                  color: 'var(--ks-hud-primary)'
                }}
              >
                Coworking Service
              </div>
            </div>

            <h3 className="text-2xl md:text-3xl font-bold mb-2 text-center" 
              style={{ color: 'var(--ks-hud-text)' }}>
              Workspace Pricing
            </h3>
            <p className="text-center mb-6" style={{ color: 'var(--ks-hud-secondary)' }}>
              Available at Panganiban Drive location
            </p>

            {/* Lightweight Availability Status */}
            <div className="flex items-center justify-center gap-6 mb-12 text-sm">
              <div className="flex items-center gap-2">
                <Dot className="w-4 h-4" style={{ color: 'var(--ks-hud-green)' }} />
                <span style={{ color: 'var(--ks-hud-text)' }}>Panganiban Drive: Open</span>
              </div>
              <div className="flex items-center gap-2">
                <Dot className="w-4 h-4" style={{ color: 'var(--ks-hud-red)' }} />
                <span style={{ color: 'var(--ks-hud-secondary)' }}>Diversion Road: Closed</span>
              </div>
            </div>

            {/* Info Panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <InfoPanel
                icon={<Zap className="w-6 h-6" />}
                title="Fair Use System"
                description="We use 8-hour access instead of day passes to ensure everyone gets their turn to enjoy our space — no reservations needed!"
                bgText="8HR"
              />
              
              <InfoPanel
                icon={<Shield className="w-6 h-6" />}
                title="All Plans Include"
                features={["Automatic Membership", "High-Speed WiFi", "Pantry Access*", "No Reservation Fees"]}
                bgText="INCL"
              />
            </div>

            {/* Main Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <PricingCard
                badge={{ text: "Popular", type: "primary" }}
                icon="🪑"
                title="Entrance Area"
                price="₱99"
                duration="8 hours / seat"
                extension="+₱15/hour extension"
                features={[
                  "Perfect for trying us out",
                  "Casual work environment", 
                  "Easy access location"
                ]}
              />

              <PricingCard
                icon="💺"
                title="Inner Area"
                price="₱149"
                duration="8 hours / seat"
                extension="+₱15/hour extension"
                features={[
                  "Ergonomic chairs",
                  "Faster dedicated WiFi",
                  "Quieter atmosphere"
                ]}
              />

              <PricingCard
                badge={{ text: "Most Value", type: "danger" }}
                icon="📞"
                title="Call Booth"
                price="₱250"
                duration="5 hours"
                extension="+₱50/hour extension"
                features={[
                  "Fits 2 people comfortably",
                  "Semi-soundproof space",
                  "Perfect for calls & interviews"
                ]}
              />
            </div>

            {/* Special Section */}
            <SpecialSection />
          </div>
        </section>

        {/* Coming Soon Services Section */}
        <section id="coming-soon" className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Sparkles className="w-6 h-6" style={{ color: 'var(--ks-hud-blue)' }} />
                <div 
                  className="px-3 py-1 rounded-full border text-sm hud-mono uppercase tracking-wider"
                  style={{ 
                    backgroundColor: 'rgba(74, 158, 255, 0.1)',
                    borderColor: 'rgba(74, 158, 255, 0.3)',
                    color: 'var(--ks-hud-blue)'
                  }}
                >
                  Expanding Soon
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-2" 
                style={{ color: 'var(--ks-hud-text)' }}>
                More Services Coming Soon
              </h3>
              <p style={{ color: 'var(--ks-hud-secondary)' }}>
                Building a comprehensive ecosystem for your productivity and business needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ComingSoonCard
                icon={<Building className="w-8 h-8" />}
                title="Business Support"
                subtitle="Registration & Documentation"
                description="Business registration, permits, and legal documentation services"
              />
              
              <ComingSoonCard
                icon={<Calendar className="w-8 h-8" />}
                title="Event Management"
                subtitle="Full Event Services"
                description="Complete event planning, coordination, and execution services"
              />
              
              <ComingSoonCard
                icon={<Code className="w-8 h-8" />}
                title="Software Development"
                subtitle="Custom Solutions"
                description="Web and mobile app development for businesses and startups"
              />
              
              <ComingSoonCard
                icon={<HomeIcon className="w-8 h-8" />}
                title="Real Estate"
                subtitle="Buy, Sell, Rent"
                description="Property listings, consultations, and real estate transactions"
              />
            </div>

            {/* Call to Action */}
            <div className="mt-12 text-center">
              <div className="hud-glass hud-clip-card p-8 max-w-2xl mx-auto">
                <h4 className="text-xl font-semibold mb-4" style={{ color: 'var(--ks-hud-text)' }}>
                  Interested in Our Upcoming Services?
                </h4>
                <p className="mb-6" style={{ color: 'var(--ks-hud-secondary)' }}>
                  Be the first to know when we launch new services. Get early access and special offers.
                </p>
                <button className="hud-clip-button hud-scan-line px-6 py-3 transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: 'rgba(74, 158, 255, 0.15)',
                    border: '1px solid var(--ks-hud-blue)',
                    color: 'var(--ks-hud-blue)',
                    fontFamily: 'var(--ks-font-digital)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                  Notify Me
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Community Engagement Section */}
        <section id="community" className="py-16 px-4 bg-white/5">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-12 text-center" 
              style={{ color: 'var(--ks-hud-text)' }}>
              Community Engagement
            </h3>

            <div className="space-y-6">
              <EventCard
                date="April 2025"
                title="CE BLAZE: Civil Engineering Days 2025"
                description="Showcasing the flagship event at BISCAST Pavilion featuring educational showcases, innovation competitions, and academic festivities."
                organizer="Association of Civil Engineering Students"
              />
            </div>
          </div>
        </section>

        {/* Connect With Us Section */}
        <section id="connect" className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-8" 
              style={{ color: 'var(--ks-hud-text)' }}>
              Connect With Us
            </h3>

            <div className="flex justify-center gap-6">
              <SocialButton
                icon={<Facebook className="w-6 h-6" />}
                label="Facebook"
                href="https://www.facebook.com/KahitSan"
              />
              <SocialButton
                icon={<Instagram className="w-6 h-6" />}
                label="Instagram"
                href="https://www.instagram.com/kahitsan_com/"
              />
              <SocialButton
                icon={<Video className="w-6 h-6" />}
                label="TikTok"
                href="https://www.tiktok.com/@kahitsan21"
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={`border-t border-white/20 py-12 px-4 ${isMobile ? 'pb-20' : ''}`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            <FooterLink href="#" text="About" />
            <FooterLink href="#" text="Contact" />
            <FooterLink href="#" text="Terms" />
            <FooterLink href="#" text="Privacy" />
          </div>
          <div className="text-center">
            <p className="text-sm hud-mono mb-2" style={{ color: 'var(--ks-hud-secondary)' }}>
              © 2025 KahitSan Solutions Corp
            </p>
            <p className="text-xs hud-mono" style={{ color: 'var(--ks-hud-secondary)' }}>
              *Pantry access available when no events in the inner area
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation with Live TOC Tracking + Account */}
      {isMobile && (
        <div 
          className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300 ${
            isScrolling ? 'translate-y-full' : 'translate-y-0'
          }`}
        >
          <div className="hud-glass border-white/20 relative" style={{ borderBottom: 'none', borderLeft: 'none', borderRight: 'none' }}>
            <div className="flex items-center justify-around">
              {sections.map((section) => (
                <MobileNavButton 
                  key={section.id}
                  label={section.label}
                  icon={section.icon}
                  active={activeSection === section.id}
                  onClick={() => scrollToSection(section.id)}
                />
              ))}
              
              {/* Account Section */}
              {/* <MobileAccountButton 
                active={showAccountMenu}
                onClick={() => setShowAccountMenu(!showAccountMenu)}
              /> */}
            </div>

            {/* Account Menu Overlay */}
            {/* {showAccountMenu && (
              <div className="absolute bottom-full left-0 right-0 hud-glass border border-white/20 mx-2 mb-2 rounded-lg overflow-hidden">
                <div className="p-4 space-y-3">
                  <div className="text-center mb-3">
                    <h4 className="font-semibold text-sm" style={{ color: 'var(--ks-hud-text)' }}>
                      Account Access
                    </h4>
                    <p className="text-xs" style={{ color: 'var(--ks-hud-secondary)' }}>
                      Sign in to book workspaces
                    </p>
                  </div>
                  
                  <button 
                    className="w-full p-3 rounded border hud-scan-line text-center transition-all duration-200"
                    style={{
                      backgroundColor: 'transparent',
                      borderColor: 'rgba(201, 169, 97, 0.4)',
                      color: 'var(--ks-hud-primary)'
                    }}
                    onClick={() => setShowAccountMenu(false)}
                  >
                    <span className="text-sm">Login</span>
                  </button>
                  
                  <button 
                    className="w-full p-3 hud-clip-button hud-scan-line text-center transition-all duration-200"
                    style={{
                      backgroundColor: 'rgba(201, 169, 97, 0.2)',
                      border: '1px solid var(--ks-hud-primary)',
                      color: 'var(--ks-hud-primary)'
                    }}
                    onClick={() => setShowAccountMenu(false)}
                  >
                    <span className="text-sm">Signup</span>
                  </button>
                </div>
              </div>
            )} */}
          </div>
        </div>
      )}

      {/* Ambient Lighting */}
      <div 
        className="fixed top-20 right-20 w-64 h-64 rounded-full blur-3xl opacity-5 pointer-events-none"
        style={{ backgroundColor: 'var(--ks-hud-primary)' }}
      ></div>
      <div 
        className="fixed bottom-20 left-20 w-64 h-64 rounded-full blur-3xl opacity-5 pointer-events-none"
        style={{ backgroundColor: 'var(--ks-hud-blue)' }}
      ></div>
    </div>
  );
}

interface ComingSoonCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
}

function ComingSoonCard({ icon, title, subtitle, description }: ComingSoonCardProps) {
  return (
    <div className="hud-panel hud-scan-line p-6 text-center relative transition-all duration-200 hover:scale-105">
      {/* Coming Soon Badge */}
      <div className="absolute top-3 right-3 px-2 py-1 text-xs rounded"
        style={{ 
          backgroundColor: 'rgba(255, 136, 51, 0.2)',
          border: '1px solid rgba(255, 136, 51, 0.4)',
          color: 'var(--ks-hud-orange)',
          fontFamily: 'var(--ks-font-digital)'
        }}>
        SOON
      </div>

      <div className="mb-4 flex justify-center" style={{ color: 'var(--ks-hud-primary)' }}>
        {icon}
      </div>
      
      <h4 className="font-semibold mb-2" style={{ color: 'var(--ks-hud-text)' }}>
        {title}
      </h4>
      <p className="text-sm mb-3" style={{ color: 'var(--ks-hud-primary)' }}>
        {subtitle}
      </p>
      <p className="text-xs leading-relaxed" style={{ color: 'var(--ks-hud-secondary)' }}>
        {description}
      </p>
    </div>
  );
}

interface InfoPanelProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  features?: string[];
  bgText: string;
}

function InfoPanel({ icon, title, description, features, bgText }: InfoPanelProps) {
  return (
    <div className="hud-glass hud-accent-border p-6 relative overflow-hidden">
      {/* Background Text */}
      <div 
        className="absolute -top-2 -right-2 text-4xl font-black opacity-5 rotate-12 pointer-events-none"
        style={{ 
          color: 'var(--ks-hud-blue)',
          fontFamily: 'var(--ks-font-digital)',
          letterSpacing: '4px'
        }}
      >
        {bgText}
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-blue-500/40">
          <div style={{ color: 'var(--ks-hud-blue)' }}>{icon}</div>
          <h4 className="font-semibold text-lg hud-mono uppercase tracking-wider"
            style={{ color: 'var(--ks-hud-blue)' }}>
            {title}
          </h4>
        </div>

        {description && (
          <p className="text-sm leading-relaxed" style={{ color: 'var(--ks-hud-text)' }}>
            {description}
          </p>
        )}

        {features && (
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-xs"
                  style={{ 
                    backgroundColor: 'rgba(201, 169, 97, 0.2)',
                    color: 'var(--ks-hud-primary)'
                  }}>
                  ✓
                </span>
                <span style={{ color: 'var(--ks-hud-text)' }}>{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

interface PricingCardProps {
  badge?: { text: string; type: 'primary' | 'danger' };
  icon: string;
  title: string;
  price: string;
  duration: string;
  extension: string;
  features: string[];
}

function PricingCard({ badge, icon, title, price, duration, extension, features }: PricingCardProps) {
  return (
    <div className="hud-glass hud-clip-card p-6 relative hud-interactive">
      {/* Badge */}
      {badge && (
        <div 
          className={`absolute -top-2 -right-2 px-3 py-1 text-xs rounded z-10 hud-mono uppercase tracking-wide ${
            badge.type === 'primary' 
              ? 'border border-primary-400/40' 
              : 'border border-red-400/40'
          }`}
          style={{ 
            backgroundColor: badge.type === 'primary' 
              ? 'rgba(201, 169, 97, 0.15)' 
              : 'rgba(255, 68, 68, 0.1)',
            color: badge.type === 'primary' 
              ? 'var(--ks-hud-primary)' 
              : 'var(--ks-hud-red)'
          }}
        >
          {badge.text}
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <div 
          className="text-3xl mb-3"
          style={{ filter: 'drop-shadow(0 0 8px rgba(201, 169, 97, 0.3))' }}
        >
          {icon}
        </div>
        <h4 className="text-xl font-semibold" 
          style={{ color: 'var(--ks-hud-text)' }}>
          {title}
        </h4>
      </div>

      {/* Price */}
      <div className="text-center mb-6">
        <div 
          className="text-4xl font-bold hud-mono tracking-wide mb-2"
          style={{ color: 'var(--ks-hud-primary)' }}
        >
          {price}
        </div>
        <div 
          className="text-sm mb-2"
          style={{ color: 'var(--ks-hud-secondary)' }}
        >
          {duration}
        </div>
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3 text-sm">
            <span 
              className="mt-1 font-bold"
              style={{ color: 'var(--ks-hud-blue)' }}
            >
              →
            </span>
            <span style={{ color: 'var(--ks-hud-text)' }}>{feature}</span>
          </li>
        ))}
      </ul>

      {/* Extension Pricing */}
      <div 
        className="text-center p-3 rounded mb-4"
        style={{
          backgroundColor: 'rgba(201, 169, 97, 0.1)',
          border: '1px solid rgba(201, 169, 97, 0.3)',
          color: 'var(--ks-hud-primary)'
        }}
      >
        <span className="text-sm font-medium">{extension}</span>
      </div>

      {/* Button */}
      {/* <button className="w-full hud-clip-button hud-scan-line p-3 transition-all duration-200 hover:scale-105"
        style={{
          backgroundColor: badge?.type === 'primary' 
            ? 'rgba(201, 169, 97, 0.15)' 
            : 'rgba(201, 169, 97, 0.08)',
          border: '1px solid rgba(201, 169, 97, 0.4)',
          color: 'var(--ks-hud-primary)',
          fontFamily: 'var(--ks-font-digital)',
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--ks-hud-primary)';
          e.currentTarget.style.textShadow = '0 0 8px var(--ks-hud-primary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(201, 169, 97, 0.4)';
          e.currentTarget.style.textShadow = 'none';
        }}
      >
        Book Now
      </button> */}
    </div>
  );
}

function SpecialSection() {
  return (
    <div className="hud-glass hud-accent-border p-8 relative overflow-hidden">
      {/* Background Text */}
      <div 
        className="absolute -top-3 -right-3 text-5xl font-black opacity-5 -rotate-12 pointer-events-none"
        style={{ 
          color: 'var(--ks-hud-primary)',
          fontFamily: 'var(--ks-font-digital)',
          letterSpacing: '3px'
        }}
      >
        EXCLUSIVE
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div 
            className="text-5xl filter drop-shadow-lg"
            style={{ filter: 'drop-shadow(0 0 15px rgba(201, 169, 97, 0.5))' }}
          >
            🏠
          </div>
          <div>
            <h4 className="text-2xl font-semibold" 
              style={{ color: 'var(--ks-hud-primary)' }}>
              Whole Inner Area
            </h4>
            <p className="text-sm" 
              style={{ color: 'var(--ks-hud-secondary)' }}>
              Exclusive Access
            </p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Features */}
          <div className="lg:col-span-2">
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <span style={{ color: 'var(--ks-hud-blue)' }}>•</span>
                <span className="text-sm" style={{ color: 'var(--ks-hud-text)' }}>
                  Exclusive space access
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ color: 'var(--ks-hud-blue)' }}>•</span>
                <span className="text-sm" style={{ color: 'var(--ks-hud-text)' }}>
                  Team meetings & workshops
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ color: 'var(--ks-hud-blue)' }}>•</span>
                <span className="text-sm" style={{ color: 'var(--ks-hud-text)' }}>
                  Flexible setup
                </span>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="text-center lg:text-right">
            <div 
              className="text-3xl font-bold hud-mono tracking-wide mb-2"
              style={{ color: 'var(--ks-hud-primary)' }}
            >
              ₱500
            </div>
            <div 
              className="text-sm mb-2"
              style={{ color: 'var(--ks-hud-secondary)' }}
            >
              first 2 hours
            </div>
            <div 
              className="text-sm"
              style={{ color: 'var(--ks-hud-primary)' }}
            >
              +₱250/hour extension
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface EventCardProps {
  date: string;
  title: string;
  description: string;
  organizer: string;
}

function EventCard({ date, title, description, organizer }: EventCardProps) {
  return (
    <div className="hud-glass hud-clip-card p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(201, 169, 97, 0.2)' }}>
            <Calendar className="w-6 h-6" style={{ color: 'var(--ks-hud-primary)' }} />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm hud-mono px-2 py-1 rounded"
              style={{ 
                backgroundColor: 'rgba(74, 158, 255, 0.2)',
                color: 'var(--ks-hud-blue)'
              }}>
              {date}
            </span>
          </div>
          
          <h4 className="font-semibold mb-2" style={{ color: 'var(--ks-hud-text)' }}>
            {title}
          </h4>
          
          <p className="text-sm mb-3" style={{ color: 'var(--ks-hud-secondary)' }}>
            {description}
          </p>
          
          <p className="text-sm" style={{ color: 'var(--ks-hud-primary)' }}>
            {organizer}
          </p>
        </div>
      </div>
    </div>
  );
}

interface SocialButtonProps {
  icon: React.ReactNode;
  label: string;
  href: string;
}

function SocialButton({ icon, label, href }: SocialButtonProps) {
  return (
    <a 
      href={href}
      className="flex flex-col items-center gap-2 p-4 rounded hud-scan-line transition-all duration-200 hover:scale-105"
      style={{ color: 'var(--ks-hud-text)' }}
    >
      <div className="w-12 h-12 rounded-full flex items-center justify-center hud-panel">
        {icon}
      </div>
      <span className="text-sm">{label}</span>
    </a>
  );
}

function FooterLink({ href, text }: { href: string; text: string }) {
  return (
    <a 
      href={href} 
      className="text-sm hover:opacity-80 transition-opacity duration-200"
      style={{ color: 'var(--ks-hud-secondary)' }}
    >
      {text}
    </a>
  );
}

interface MobileNavButtonProps {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick: () => void;
}

function MobileNavButton({ label, icon, active = false, onClick }: MobileNavButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center gap-1 p-2 transition-all duration-200 min-w-0 flex-1"
      style={{ color: active ? 'var(--ks-hud-primary)' : 'var(--ks-hud-secondary)' }}
    >
      <div className="relative">
        <div className="w-5 h-5 flex items-center justify-center">
          {icon}
        </div>
        {active && (
          <div 
            className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full"
            style={{ backgroundColor: 'var(--ks-hud-primary)' }}
          />
        )}
      </div>
      <span className="text-xs font-medium truncate w-full text-center">{label}</span>
      {active && (
        <div 
          className="w-4 h-0.5 rounded-full"
          style={{ backgroundColor: 'var(--ks-hud-primary)' }}
        />
      )}
    </button>
  );
}

// interface MobileAccountButtonProps {
//   active: boolean;
//   onClick: () => void;
// }

// function MobileAccountButton({ active, onClick }: MobileAccountButtonProps) {
//   return (
//     <button 
//       onClick={onClick}
//       className="flex flex-col items-center gap-1 p-2 transition-all duration-200 min-w-0 flex-1"
//       style={{ color: active ? 'var(--ks-hud-primary)' : 'var(--ks-hud-secondary)' }}
//     >
//       <div className="relative">
//         <div className="w-5 h-5 flex items-center justify-center">
//           <UserCircle className="w-5 h-5" />
//         </div>
//         {active && (
//           <div 
//             className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full"
//             style={{ backgroundColor: 'var(--ks-hud-primary)' }}
//           />
//         )}
//       </div>
//       <span className="text-xs font-medium truncate w-full text-center">Account</span>
//       {active && (
//         <div 
//           className="w-4 h-0.5 rounded-full"
//           style={{ backgroundColor: 'var(--ks-hud-primary)' }}
//         />
//       )}
//     </button>
//   );
// }