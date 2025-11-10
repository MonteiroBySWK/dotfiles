"use client";

import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useTransform,
} from "framer-motion";
import { Menu, X } from "lucide-react";
// import { ModeToggle } from "./mode-toggle";
import logo from "/logo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

//  const { scrollYProgress } = useScroll();
//  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "#hero" },
    { name: "Sobre", href: "#sobre" },
    { name: "Missão & Visão", href: "#missao-visao" },
    { name: "Valores", href: "#valores" },
    { name: "Serviços", href: "#servicos" },
    { name: "Contato", href: "#contato" },
  ];

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const offset = isScrolled ? 80 : 0;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  if (!mounted) {
    return (
      <header className="w-full bg-background/90 backdrop-blur-sm">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={logo}
              alt="Logo da Technos"
              className="h-16 w-16 sm:h-20 sm:w-20" // Exemplo: h-16 (64px), w-16 (64px)
              //           sm:h-20 (80px), sm:w-20 (80px)
              width={80} // Ajuste para o maior tamanho que você espera (ou para o tamanho intrínseco da sua imagem original)
              height={80} // Ajuste também aqui
            />
          </div>
        </nav>
      </header>
    );
  }

  return (
    <>
      <motion.header
        className={`w-full z-50 transition-all duration-500 ease-in-out ${
          isScrolled
            ? "fixed top-0 bg-background backdrop-blur-md shadow-lg border-b border-neutral-support/20"
            : "fixed bg-background"
        }`}
        initial={false}
        animate={{
          y: isScrolled ? 0 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between bg-[var(--background)] backdrop-blur-sm border-b border-neutral-support/20">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-2 sm:space-x-3"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={logo}
              alt="Logo"
              className="h-full object-cover"
              width={120}
            />
          </motion.div>


          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <motion.button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className="relative text-[var(--foreground)] font-medium text-sm px-4 py-2 rounded-md transition-colors duration-200 hover:text-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:ring-offset-2 focus:ring-offset-[var(--background)]"
                whileHover={{ y: -1 }}
                transition={{ duration: 0.15 }}
              >
                {item.name}
                <motion.div
                  className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-brand-accent"
                  whileHover={{ width: "80%", x: "-50%" }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="lg:hidden text-[var(--foreground)] p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:ring-offset-2 focus:ring-offset-[var(--background)]"
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -45, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 45, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 45, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -45, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  className="fixed inset-0 bg-[var(--background)]/60 backdrop-blur-sm lg:hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setIsOpen(false)}
                />

                {/* Menu Panel */}
                <motion.div
                  className="fixed top-16 right-0 w-72 bg-[var(--background)] backdrop-blur-md border-l border-neutral-support/20 h-[calc(100vh-4rem)] lg:hidden shadow-2xl"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <div className="flex flex-col p-6 space-y-2">
                    {navItems.map((item) => (
                      <motion.button
                        key={item.name}
                        onClick={() => handleNavClick(item.href)}
                        className="text-[var(--foreground)] font-medium text-left hover:text-brand-accent transition-colors duration-200 py-3 px-4 rounded-md hover:bg-[var(--background)]/10 focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                        whileHover={{ x: 4 }}
                      >
                        {item.name}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </nav>
      </motion.header>
    </>
  );
}
