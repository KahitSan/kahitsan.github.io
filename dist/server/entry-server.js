import { jsxs, jsx } from "react/jsx-runtime";
import { renderToString } from "react-dom/server";
import { useState, useEffect } from "react";
import { Video, Coffee, Plus, Dot, Zap, Shield, Sparkles, Building, Calendar, Code, Home, Facebook, Instagram, Users } from "lucide-react";
const KAHITSAN_LOGO = "/assets/logo-DwX9Dwwm.png";
function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollTimeout, setScrollTimeout] = useState(null);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);
    const sections2 = ["hero", "services", "pricing", "coming-soon", "community", "connect"];
    sections2.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!isMobile) return;
    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      const newTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 1500);
      setScrollTimeout(newTimeout);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [isMobile, scrollTimeout]);
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = isMobile ? -80 : -80;
      const elementPosition = element.offsetTop + offset;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth"
      });
    }
  };
  const sections = [
    { id: "hero", label: "Home", icon: /* @__PURE__ */ jsx(Home, { className: "w-4 h-4" }) },
    { id: "services", label: "Services", icon: /* @__PURE__ */ jsx(Building, { className: "w-4 h-4" }) },
    { id: "pricing", label: "Pricing", icon: /* @__PURE__ */ jsx(Coffee, { className: "w-4 h-4" }) },
    { id: "coming-soon", label: "Soon", icon: /* @__PURE__ */ jsx(Sparkles, { className: "w-4 h-4" }) },
    { id: "community", label: "Community", icon: /* @__PURE__ */ jsx(Users, { className: "w-4 h-4" }) }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", style: { backgroundColor: "var(--ks-bg-main)" }, children: [
    /* @__PURE__ */ jsx("div", { className: "fixed inset-0 opacity-3 pointer-events-none", style: {
      backgroundImage: `
          linear-gradient(rgba(201, 169, 97, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(201, 169, 97, 0.03) 1px, transparent 1px)
        `,
      backgroundSize: "20px 20px"
    } }),
    /* @__PURE__ */ jsx("header", { className: `${isMobile ? "relative" : "fixed top-0 left-0 right-0"} z-50 hud-glass`, style: { borderRight: "none", borderLeft: "none", borderTop: "none" }, children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between h-16", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("img", { src: KAHITSAN_LOGO, alt: "KahitSan Management", className: "h-10 mr-2" }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "hidden lg:flex items-center gap-2", children: [
        sections.map((section) => /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => scrollToSection(section.id),
            className: "flex items-center gap-2 px-3 py-1.5 rounded transition-all duration-200 text-xs",
            style: {
              backgroundColor: activeSection === section.id ? "rgba(201, 169, 97, 0.15)" : "transparent",
              color: activeSection === section.id ? "var(--ks-hud-primary)" : "var(--ks-hud-secondary)",
              border: activeSection === section.id ? "1px solid rgba(201, 169, 97, 0.3)" : "1px solid transparent"
            },
            children: [
              section.icon,
              /* @__PURE__ */ jsx("span", { className: "hud-mono", children: section.label }),
              activeSection === section.id && /* @__PURE__ */ jsx(
                "div",
                {
                  className: "w-1 h-1 rounded-full",
                  style: { backgroundColor: "var(--ks-hud-primary)" }
                }
              )
            ]
          },
          section.id
        )),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => scrollToSection("connect"),
            className: "flex items-center gap-2 px-3 py-1.5 rounded transition-all duration-200 text-xs",
            style: {
              backgroundColor: activeSection === "connect" ? "rgba(201, 169, 97, 0.15)" : "transparent",
              color: activeSection === "connect" ? "var(--ks-hud-primary)" : "var(--ks-hud-secondary)",
              border: activeSection === "connect" ? "1px solid rgba(201, 169, 97, 0.3)" : "1px solid transparent"
            },
            children: [
              /* @__PURE__ */ jsx(Video, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsx("span", { className: "hud-mono", children: "Connect" }),
              activeSection === "connect" && /* @__PURE__ */ jsx(
                "div",
                {
                  className: "w-1 h-1 rounded-full",
                  style: { backgroundColor: "var(--ks-hud-primary)" }
                }
              )
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "hidden md:flex items-center gap-4" })
    ] }) }) }),
    /* @__PURE__ */ jsxs("main", { className: `relative z-10 ${isMobile ? "" : "pt-16"}`, children: [
      /* @__PURE__ */ jsxs("section", { id: "hero", className: "py-16 px-4 text-center relative overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 pointer-events-none", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute inset-0 opacity-10",
              style: {
                background: `radial-gradient(ellipse at center, rgba(201, 169, 97, 0.4) 0%, rgba(201, 169, 97, 0.1) 40%, transparent 70%)`
              }
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute top-1/4 left-1/4 w-32 h-32 opacity-5 rotate-45",
              style: {
                background: "linear-gradient(45deg, var(--ks-hud-primary), transparent)",
                clipPath: "polygon(0 0, 80% 0, 100% 20%, 100% 100%, 20% 100%, 0 80%)"
              }
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute top-1/3 right-1/4 w-24 h-24 opacity-5 -rotate-12",
              style: {
                background: "linear-gradient(135deg, var(--ks-hud-blue), transparent)",
                clipPath: "polygon(0 0, 70% 0, 100% 30%, 100% 100%, 30% 100%, 0 70%)"
              }
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute inset-0 opacity-5",
              style: {
                backgroundImage: `repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 2px,
                  rgba(201, 169, 97, 0.1) 2px,
                  rgba(201, 169, 97, 0.1) 4px
                )`
              }
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto relative z-10", children: [
          /* @__PURE__ */ jsxs(
            "h2",
            {
              className: "text-3xl md:text-5xl font-bold mb-6",
              style: {
                color: "var(--ks-hud-text)",
                lineHeight: 1.2,
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)"
              },
              children: [
                "Productivity starts",
                " ",
                /* @__PURE__ */ jsx("span", { style: { color: "var(--ks-hud-primary)" }, children: "anywhere" }),
                "."
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "p",
            {
              className: "text-lg md:text-xl mb-8 max-w-2xl mx-auto",
              style: {
                color: "var(--ks-hud-secondary)",
                textShadow: "0 1px 5px rgba(0, 0, 0, 0.3)"
              },
              children: "Your comfy study tambayan. KahitSan man pinagsasalitaan mo."
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        "section",
        {
          id: "services",
          className: "py-16 px-4 relative overflow-hidden",
          style: {
            background: `
              linear-gradient(135deg, rgba(74, 158, 255, 0.03) 0%, rgba(74, 158, 255, 0.01) 50%, transparent 100%),
              linear-gradient(45deg, rgba(15, 15, 20, 0.4) 0%, rgba(20, 20, 25, 0.6) 100%)
            `
          },
          children: [
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-10 pointer-events-none", style: {
              backgroundImage: `
              linear-gradient(rgba(74, 158, 255, 0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(74, 158, 255, 0.02) 1px, transparent 1px)
            `,
              backgroundSize: "30px 30px"
            } }),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "absolute top-1/4 right-1/3 w-20 h-20 opacity-3 rotate-12",
                style: {
                  background: "linear-gradient(45deg, var(--ks-hud-blue), transparent)",
                  clipPath: "polygon(0 0, 80% 0, 100% 20%, 100% 100%, 20% 100%, 0 80%)"
                }
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto relative z-10", children: [
              /* @__PURE__ */ jsx(
                "h3",
                {
                  className: "text-2xl md:text-3xl font-bold mb-2 text-center",
                  style: { color: "var(--ks-hud-text)" },
                  children: "Our Services"
                }
              ),
              /* @__PURE__ */ jsx("p", { className: "text-center mb-12", style: { color: "var(--ks-hud-secondary)" }, children: "Growing network of solutions for your productivity needs" }),
              /* @__PURE__ */ jsxs("div", { className: "p-8 relative overflow-hidden", children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "absolute -top-3 -right-3 text-6xl font-black opacity-5 -rotate-12 pointer-events-none",
                    style: {
                      color: "var(--ks-hud-primary)",
                      fontFamily: "var(--ks-font-digital)",
                      letterSpacing: "3px"
                    },
                    children: "NETWORK"
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "relative z-10", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto", children: [
                  /* @__PURE__ */ jsx("div", { className: "hud-panel p-4 rounded", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                      /* @__PURE__ */ jsx("div", { style: { color: "var(--ks-hud-primary)" }, children: /* @__PURE__ */ jsx(Coffee, { className: "w-5 h-5" }) }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("h6", { className: "font-semibold text-sm", style: { color: "var(--ks-hud-text)" }, children: "Coworking Spaces" }),
                        /* @__PURE__ */ jsx("p", { className: "text-xs", style: { color: "var(--ks-hud-secondary)" }, children: "Workspace Solutions" })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "px-2 py-1 rounded text-xs hud-mono uppercase",
                        style: {
                          backgroundColor: "rgba(0, 204, 136, 0.2)",
                          border: "1px solid rgba(0, 204, 136, 0.4)",
                          color: "var(--ks-hud-green)"
                        },
                        children: "LIVE"
                      }
                    )
                  ] }) }),
                  /* @__PURE__ */ jsx("div", { className: "hud-panel p-4 rounded", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                      /* @__PURE__ */ jsx("div", { style: { color: "var(--ks-hud-primary)" }, children: /* @__PURE__ */ jsx(Plus, { className: "w-5 h-5" }) }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("h6", { className: "font-semibold text-sm", style: { color: "var(--ks-hud-text)" }, children: "Future Services" }),
                        /* @__PURE__ */ jsx("p", { className: "text-xs", style: { color: "var(--ks-hud-secondary)" }, children: "Expanding Network" })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "px-2 py-1 rounded text-xs hud-mono uppercase",
                        style: {
                          backgroundColor: "rgba(74, 158, 255, 0.2)",
                          border: "1px solid rgba(74, 158, 255, 0.4)",
                          color: "var(--ks-hud-blue)"
                        },
                        children: "SOON"
                      }
                    )
                  ] }) })
                ] }) })
              ] })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsx("section", { id: "pricing", className: "py-16 px-4 bg-white/5", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-3 mb-4", children: [
          /* @__PURE__ */ jsx(Coffee, { className: "w-6 h-6", style: { color: "var(--ks-hud-primary)" } }),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "px-3 py-1 rounded-full border text-sm hud-mono uppercase tracking-wider",
              style: {
                backgroundColor: "rgba(201, 169, 97, 0.1)",
                borderColor: "rgba(201, 169, 97, 0.3)",
                color: "var(--ks-hud-primary)"
              },
              children: "Coworking Service"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "h3",
          {
            className: "text-2xl md:text-3xl font-bold mb-2 text-center",
            style: { color: "var(--ks-hud-text)" },
            children: "Workspace Pricing"
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "text-center mb-6", style: { color: "var(--ks-hud-secondary)" }, children: "Available at Panganiban Drive location" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-6 mb-12 text-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Dot, { className: "w-4 h-4", style: { color: "var(--ks-hud-green)" } }),
            /* @__PURE__ */ jsx("span", { style: { color: "var(--ks-hud-text)" }, children: "Panganiban Drive: Open" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Dot, { className: "w-4 h-4", style: { color: "var(--ks-hud-red)" } }),
            /* @__PURE__ */ jsx("span", { style: { color: "var(--ks-hud-secondary)" }, children: "Diversion Road: Closed" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-12", children: [
          /* @__PURE__ */ jsx(
            InfoPanel,
            {
              icon: /* @__PURE__ */ jsx(Zap, { className: "w-6 h-6" }),
              title: "Fair Use System",
              description: "We use 8-hour access instead of day passes to ensure everyone gets their turn to enjoy our space — no reservations needed!",
              bgText: "8HR"
            }
          ),
          /* @__PURE__ */ jsx(
            InfoPanel,
            {
              icon: /* @__PURE__ */ jsx(Shield, { className: "w-6 h-6" }),
              title: "All Plans Include",
              features: ["Automatic Membership", "High-Speed WiFi", "Pantry Access*", "No Reservation Fees"],
              bgText: "INCL"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-12", children: [
          /* @__PURE__ */ jsx(
            PricingCard,
            {
              badge: { text: "Popular", type: "primary" },
              icon: "🪑",
              title: "Entrance Area",
              price: "₱99",
              duration: "8 hours / seat",
              extension: "+₱15/hour extension",
              features: [
                "Perfect for trying us out",
                "Casual work environment",
                "Easy access location"
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            PricingCard,
            {
              icon: "💺",
              title: "Inner Area",
              price: "₱149",
              duration: "8 hours / seat",
              extension: "+₱15/hour extension",
              features: [
                "Ergonomic chairs",
                "Faster dedicated WiFi",
                "Quieter atmosphere"
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            PricingCard,
            {
              badge: { text: "Most Value", type: "danger" },
              icon: "📞",
              title: "Call Booth",
              price: "₱250",
              duration: "5 hours",
              extension: "+₱50/hour extension",
              features: [
                "Fits 2 people comfortably",
                "Semi-soundproof space",
                "Perfect for calls & interviews"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx(SpecialSection, {})
      ] }) }),
      /* @__PURE__ */ jsx("section", { id: "coming-soon", className: "py-16 px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-3 mb-4", children: [
            /* @__PURE__ */ jsx(Sparkles, { className: "w-6 h-6", style: { color: "var(--ks-hud-blue)" } }),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "px-3 py-1 rounded-full border text-sm hud-mono uppercase tracking-wider",
                style: {
                  backgroundColor: "rgba(74, 158, 255, 0.1)",
                  borderColor: "rgba(74, 158, 255, 0.3)",
                  color: "var(--ks-hud-blue)"
                },
                children: "Expanding Soon"
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            "h3",
            {
              className: "text-2xl md:text-3xl font-bold mb-2",
              style: { color: "var(--ks-hud-text)" },
              children: "More Services Coming Soon"
            }
          ),
          /* @__PURE__ */ jsx("p", { style: { color: "var(--ks-hud-secondary)" }, children: "Building a comprehensive ecosystem for your productivity and business needs" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [
          /* @__PURE__ */ jsx(
            ComingSoonCard,
            {
              icon: /* @__PURE__ */ jsx(Building, { className: "w-8 h-8" }),
              title: "Business Support",
              subtitle: "Registration & Documentation",
              description: "Business registration, permits, and legal documentation services"
            }
          ),
          /* @__PURE__ */ jsx(
            ComingSoonCard,
            {
              icon: /* @__PURE__ */ jsx(Calendar, { className: "w-8 h-8" }),
              title: "Event Management",
              subtitle: "Full Event Services",
              description: "Complete event planning, coordination, and execution services"
            }
          ),
          /* @__PURE__ */ jsx(
            ComingSoonCard,
            {
              icon: /* @__PURE__ */ jsx(Code, { className: "w-8 h-8" }),
              title: "Software Development",
              subtitle: "Custom Solutions",
              description: "Web and mobile app development for businesses and startups"
            }
          ),
          /* @__PURE__ */ jsx(
            ComingSoonCard,
            {
              icon: /* @__PURE__ */ jsx(Home, { className: "w-8 h-8" }),
              title: "Real Estate",
              subtitle: "Buy, Sell, Rent",
              description: "Property listings, consultations, and real estate transactions"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-12 text-center", children: /* @__PURE__ */ jsxs("div", { className: "hud-glass hud-clip-card p-8 max-w-2xl mx-auto", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-xl font-semibold mb-4", style: { color: "var(--ks-hud-text)" }, children: "Interested in Our Upcoming Services?" }),
          /* @__PURE__ */ jsx("p", { className: "mb-6", style: { color: "var(--ks-hud-secondary)" }, children: "Be the first to know when we launch new services. Get early access and special offers." }),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "hud-clip-button hud-scan-line px-6 py-3 transition-all duration-200 hover:scale-105",
              style: {
                backgroundColor: "rgba(74, 158, 255, 0.15)",
                border: "1px solid var(--ks-hud-blue)",
                color: "var(--ks-hud-blue)",
                fontFamily: "var(--ks-font-digital)",
                textTransform: "uppercase",
                letterSpacing: "1px"
              },
              children: "Notify Me"
            }
          )
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsx("section", { id: "community", className: "py-16 px-4 bg-white/5", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto", children: [
        /* @__PURE__ */ jsx(
          "h3",
          {
            className: "text-2xl md:text-3xl font-bold mb-12 text-center",
            style: { color: "var(--ks-hud-text)" },
            children: "Community Engagement"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsx(
          EventCard,
          {
            date: "April 2025",
            title: "CE BLAZE: Civil Engineering Days 2025",
            description: "Showcasing the flagship event at BISCAST Pavilion featuring educational showcases, innovation competitions, and academic festivities.",
            organizer: "Association of Civil Engineering Students"
          }
        ) })
      ] }) }),
      /* @__PURE__ */ jsx("section", { id: "connect", className: "py-16 px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto text-center", children: [
        /* @__PURE__ */ jsx(
          "h3",
          {
            className: "text-2xl md:text-3xl font-bold mb-8",
            style: { color: "var(--ks-hud-text)" },
            children: "Connect With Us"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-center gap-6", children: [
          /* @__PURE__ */ jsx(
            SocialButton,
            {
              icon: /* @__PURE__ */ jsx(Facebook, { className: "w-6 h-6" }),
              label: "Facebook",
              href: "https://www.facebook.com/KahitSan"
            }
          ),
          /* @__PURE__ */ jsx(
            SocialButton,
            {
              icon: /* @__PURE__ */ jsx(Instagram, { className: "w-6 h-6" }),
              label: "Instagram",
              href: "https://www.instagram.com/kahitsan_com/"
            }
          ),
          /* @__PURE__ */ jsx(
            SocialButton,
            {
              icon: /* @__PURE__ */ jsx(Video, { className: "w-6 h-6" }),
              label: "TikTok",
              href: "https://www.tiktok.com/@kahitsan21"
            }
          )
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("footer", { className: `border-t border-white/20 py-12 px-4 ${isMobile ? "pb-20" : ""}`, children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-center gap-6 mb-6", children: [
        /* @__PURE__ */ jsx(FooterLink, { href: "#", text: "About" }),
        /* @__PURE__ */ jsx(FooterLink, { href: "#", text: "Contact" }),
        /* @__PURE__ */ jsx(FooterLink, { href: "#", text: "Terms" }),
        /* @__PURE__ */ jsx(FooterLink, { href: "#", text: "Privacy" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm hud-mono mb-2", style: { color: "var(--ks-hud-secondary)" }, children: "© 2025 KahitSan Solutions Corp" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs hud-mono", style: { color: "var(--ks-hud-secondary)" }, children: "*Pantry access available when no events in the inner area" })
      ] })
    ] }) }),
    isMobile && /* @__PURE__ */ jsx(
      "div",
      {
        className: `fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300 ${isScrolling ? "translate-y-full" : "translate-y-0"}`,
        children: /* @__PURE__ */ jsx("div", { className: "hud-glass border-white/20 relative", style: { borderBottom: "none", borderLeft: "none", borderRight: "none" }, children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-around", children: sections.map((section) => /* @__PURE__ */ jsx(
          MobileNavButton,
          {
            label: section.label,
            icon: section.icon,
            active: activeSection === section.id,
            onClick: () => scrollToSection(section.id)
          },
          section.id
        )) }) })
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed top-20 right-20 w-64 h-64 rounded-full blur-3xl opacity-5 pointer-events-none",
        style: { backgroundColor: "var(--ks-hud-primary)" }
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed bottom-20 left-20 w-64 h-64 rounded-full blur-3xl opacity-5 pointer-events-none",
        style: { backgroundColor: "var(--ks-hud-blue)" }
      }
    )
  ] });
}
function ComingSoonCard({ icon, title, subtitle, description }) {
  return /* @__PURE__ */ jsxs("div", { className: "hud-panel hud-scan-line p-6 text-center relative transition-all duration-200 hover:scale-105", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute top-3 right-3 px-2 py-1 text-xs rounded",
        style: {
          backgroundColor: "rgba(255, 136, 51, 0.2)",
          border: "1px solid rgba(255, 136, 51, 0.4)",
          color: "var(--ks-hud-orange)",
          fontFamily: "var(--ks-font-digital)"
        },
        children: "SOON"
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "mb-4 flex justify-center", style: { color: "var(--ks-hud-primary)" }, children: icon }),
    /* @__PURE__ */ jsx("h4", { className: "font-semibold mb-2", style: { color: "var(--ks-hud-text)" }, children: title }),
    /* @__PURE__ */ jsx("p", { className: "text-sm mb-3", style: { color: "var(--ks-hud-primary)" }, children: subtitle }),
    /* @__PURE__ */ jsx("p", { className: "text-xs leading-relaxed", style: { color: "var(--ks-hud-secondary)" }, children: description })
  ] });
}
function InfoPanel({ icon, title, description, features, bgText }) {
  return /* @__PURE__ */ jsxs("div", { className: "hud-glass hud-accent-border p-6 relative overflow-hidden", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute -top-2 -right-2 text-4xl font-black opacity-5 rotate-12 pointer-events-none",
        style: {
          color: "var(--ks-hud-blue)",
          fontFamily: "var(--ks-font-digital)",
          letterSpacing: "4px"
        },
        children: bgText
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4 pb-3 border-b border-blue-500/40", children: [
        /* @__PURE__ */ jsx("div", { style: { color: "var(--ks-hud-blue)" }, children: icon }),
        /* @__PURE__ */ jsx(
          "h4",
          {
            className: "font-semibold text-lg hud-mono uppercase tracking-wider",
            style: { color: "var(--ks-hud-blue)" },
            children: title
          }
        )
      ] }),
      description && /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed", style: { color: "var(--ks-hud-text)" }, children: description }),
      features && /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: features.map((feature, index) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            className: "w-4 h-4 rounded-full flex items-center justify-center text-xs",
            style: {
              backgroundColor: "rgba(201, 169, 97, 0.2)",
              color: "var(--ks-hud-primary)"
            },
            children: "✓"
          }
        ),
        /* @__PURE__ */ jsx("span", { style: { color: "var(--ks-hud-text)" }, children: feature })
      ] }, index)) })
    ] })
  ] });
}
function PricingCard({ badge, icon, title, price, duration, extension, features }) {
  return /* @__PURE__ */ jsxs("div", { className: "hud-glass hud-clip-card p-6 relative hud-interactive", children: [
    badge && /* @__PURE__ */ jsx(
      "div",
      {
        className: `absolute -top-2 -right-2 px-3 py-1 text-xs rounded z-10 hud-mono uppercase tracking-wide ${badge.type === "primary" ? "border border-primary-400/40" : "border border-red-400/40"}`,
        style: {
          backgroundColor: badge.type === "primary" ? "rgba(201, 169, 97, 0.15)" : "rgba(255, 68, 68, 0.1)",
          color: badge.type === "primary" ? "var(--ks-hud-primary)" : "var(--ks-hud-red)"
        },
        children: badge.text
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-6", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "text-3xl mb-3",
          style: { filter: "drop-shadow(0 0 8px rgba(201, 169, 97, 0.3))" },
          children: icon
        }
      ),
      /* @__PURE__ */ jsx(
        "h4",
        {
          className: "text-xl font-semibold",
          style: { color: "var(--ks-hud-text)" },
          children: title
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-6", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "text-4xl font-bold hud-mono tracking-wide mb-2",
          style: { color: "var(--ks-hud-primary)" },
          children: price
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "text-sm mb-2",
          style: { color: "var(--ks-hud-secondary)" },
          children: duration
        }
      )
    ] }),
    /* @__PURE__ */ jsx("ul", { className: "space-y-3 mb-6", children: features.map((feature, index) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3 text-sm", children: [
      /* @__PURE__ */ jsx(
        "span",
        {
          className: "mt-1 font-bold",
          style: { color: "var(--ks-hud-blue)" },
          children: "→"
        }
      ),
      /* @__PURE__ */ jsx("span", { style: { color: "var(--ks-hud-text)" }, children: feature })
    ] }, index)) }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "text-center p-3 rounded mb-4",
        style: {
          backgroundColor: "rgba(201, 169, 97, 0.1)",
          border: "1px solid rgba(201, 169, 97, 0.3)",
          color: "var(--ks-hud-primary)"
        },
        children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: extension })
      }
    )
  ] });
}
function SpecialSection() {
  return /* @__PURE__ */ jsxs("div", { className: "hud-glass hud-accent-border p-8 relative overflow-hidden", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute -top-3 -right-3 text-5xl font-black opacity-5 -rotate-12 pointer-events-none",
        style: {
          color: "var(--ks-hud-primary)",
          fontFamily: "var(--ks-font-digital)",
          letterSpacing: "3px"
        },
        children: "EXCLUSIVE"
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "text-5xl filter drop-shadow-lg",
            style: { filter: "drop-shadow(0 0 15px rgba(201, 169, 97, 0.5))" },
            children: "🏠"
          }
        ),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(
            "h4",
            {
              className: "text-2xl font-semibold",
              style: { color: "var(--ks-hud-primary)" },
              children: "Whole Inner Area"
            }
          ),
          /* @__PURE__ */ jsx(
            "p",
            {
              className: "text-sm",
              style: { color: "var(--ks-hud-secondary)" },
              children: "Exclusive Access"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8 items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { style: { color: "var(--ks-hud-blue)" }, children: "•" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm", style: { color: "var(--ks-hud-text)" }, children: "Exclusive space access" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { style: { color: "var(--ks-hud-blue)" }, children: "•" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm", style: { color: "var(--ks-hud-text)" }, children: "Team meetings & workshops" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { style: { color: "var(--ks-hud-blue)" }, children: "•" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm", style: { color: "var(--ks-hud-text)" }, children: "Flexible setup" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "text-center lg:text-right", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "text-3xl font-bold hud-mono tracking-wide mb-2",
              style: { color: "var(--ks-hud-primary)" },
              children: "₱500"
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "text-sm mb-2",
              style: { color: "var(--ks-hud-secondary)" },
              children: "first 2 hours"
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "text-sm",
              style: { color: "var(--ks-hud-primary)" },
              children: "+₱250/hour extension"
            }
          )
        ] })
      ] })
    ] })
  ] });
}
function EventCard({ date, title, description, organizer }) {
  return /* @__PURE__ */ jsx("div", { className: "hud-glass hud-clip-card p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
    /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx(
      "div",
      {
        className: "w-12 h-12 rounded-full flex items-center justify-center",
        style: { backgroundColor: "rgba(201, 169, 97, 0.2)" },
        children: /* @__PURE__ */ jsx(Calendar, { className: "w-6 h-6", style: { color: "var(--ks-hud-primary)" } })
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 mb-2", children: /* @__PURE__ */ jsx(
        "span",
        {
          className: "text-sm hud-mono px-2 py-1 rounded",
          style: {
            backgroundColor: "rgba(74, 158, 255, 0.2)",
            color: "var(--ks-hud-blue)"
          },
          children: date
        }
      ) }),
      /* @__PURE__ */ jsx("h4", { className: "font-semibold mb-2", style: { color: "var(--ks-hud-text)" }, children: title }),
      /* @__PURE__ */ jsx("p", { className: "text-sm mb-3", style: { color: "var(--ks-hud-secondary)" }, children: description }),
      /* @__PURE__ */ jsx("p", { className: "text-sm", style: { color: "var(--ks-hud-primary)" }, children: organizer })
    ] })
  ] }) });
}
function SocialButton({ icon, label, href }) {
  return /* @__PURE__ */ jsxs(
    "a",
    {
      href,
      className: "flex flex-col items-center gap-2 p-4 rounded hud-scan-line transition-all duration-200 hover:scale-105",
      style: { color: "var(--ks-hud-text)" },
      children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full flex items-center justify-center hud-panel", children: icon }),
        /* @__PURE__ */ jsx("span", { className: "text-sm", children: label })
      ]
    }
  );
}
function FooterLink({ href, text }) {
  return /* @__PURE__ */ jsx(
    "a",
    {
      href,
      className: "text-sm hover:opacity-80 transition-opacity duration-200",
      style: { color: "var(--ks-hud-secondary)" },
      children: text
    }
  );
}
function MobileNavButton({ label, icon, active = false, onClick }) {
  return /* @__PURE__ */ jsxs(
    "button",
    {
      onClick,
      className: "flex flex-col items-center gap-1 p-2 transition-all duration-200 min-w-0 flex-1",
      style: { color: active ? "var(--ks-hud-primary)" : "var(--ks-hud-secondary)" },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx("div", { className: "w-5 h-5 flex items-center justify-center", children: icon }),
          active && /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full",
              style: { backgroundColor: "var(--ks-hud-primary)" }
            }
          )
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-xs font-medium truncate w-full text-center", children: label }),
        active && /* @__PURE__ */ jsx(
          "div",
          {
            className: "w-4 h-0.5 rounded-full",
            style: { backgroundColor: "var(--ks-hud-primary)" }
          }
        )
      ]
    }
  );
}
function render(_url) {
  const html = renderToString(/* @__PURE__ */ jsx(App, {}));
  return { html };
}
export {
  render
};
