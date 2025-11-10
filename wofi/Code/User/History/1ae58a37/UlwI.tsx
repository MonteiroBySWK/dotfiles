"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Phone, Instagram, Clock, MapPin } from "lucide-react"
import StaggerContainer from "@/components/animations/stagger-container"
import StaggerItem from "@/components/animations/stagger-item"

export default function ContactSection() {
  return (
    <section id="contato" className="bg-background">
      {/* Main Contact Section */}
      <div className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12" staggerDelay={0.2}>
            {/* Localização */}
            <StaggerItem>
              <div className="space-y-6">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-neutral-light">Onde Estamos</h3>

                <div className="space-y-4">
                  <motion.div
                    className="flex items-start space-x-3"
                    whileHover={{ x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MapPin className="w-5 h-5 text-brand-accent mt-1 flex-shrink-0" strokeWidth={2} />
                    <p className="text-sm sm:text-base text-neutral-support leading-relaxed">
                      Instituto de Engenharia da Computação (CCT) – UEMA, Campus Paulo VI, Sala 15-E
                    </p>
                  </motion.div>
                </div>

                {/* Mapa placeholder */}
                <motion.div
                  className="bg-neutral-support/20 rounded-lg h-48 sm:h-52 lg:h-48 flex items-center justify-center overflow-hidden border border-neutral-support/30"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-neutral-support text-sm sm:text-base">Mapa do Campus</p>
                </motion.div>
              </div>
            </StaggerItem>

            {/* Contato Rápido */}
            <StaggerItem>
              <div className="space-y-6">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-neutral-light">Contato</h3>

                <div className="space-y-4">
                  {[
                    { icon: Mail, text: "engcompjr@gmail.com", href: "mailto:engcompjr@gmail.com" },
                    { icon: Phone, text: "(98) 99999-9999", href: "tel:+5598999999999" },
                    { icon: Instagram, text: "@technosjr", href: "https://instagram.com/technosjr" },
                    { icon: Clock, text: "Seg – Sex: 08h às 18h", href: null },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start space-x-3 py-2"
                      whileHover={{ x: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="flex-shrink-0 mt-0.5"
                      >
                        <item.icon className="w-5 h-5 text-brand-accent" strokeWidth={2} />
                      </motion.div>
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.href.startsWith("http") ? "_blank" : undefined}
                          rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="text-sm sm:text-base text-neutral-support hover:text-brand-accent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-black-soft rounded"
                        >
                          {item.text}
                        </a>
                      ) : (
                        <span className="text-sm sm:text-base text-neutral-light/90">{item.text}</span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </StaggerItem>

            {/* Newsletter */}
            <StaggerItem>
              <div className="space-y-6">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-neutral-light">Newsletter</h3>

                <p className="text-sm sm:text-base text-neutral-light/90">
                  Receba novidades e ofertas direto no seu e-mail.
                </p>

                <div className="space-y-4">
                  <motion.div whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                    <Input
                      type="email"
                      placeholder="Seu e-mail"
                      className="w-full bg-white border-neutral-support text-black-soft focus:ring-2 focus:ring-brand-accent focus:border-brand-accent"
                    />
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="w-full bg-brand-primary-dark hover:bg-brand-accent text-white font-semibold transition-colors duration-200 focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-black-soft">
                      Inscrever-se
                    </Button>
                  </motion.div>

                  <p className="text-xs sm:text-sm text-neutral-support">
                    Ao se inscrever, você concorda com nossa Política de Privacidade.
                  </p>
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </div>

      {/* Footer */}
      <motion.div
        className="border-t border-neutral-support/20 py-6 sm:py-8 bg-[var(--background)]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <p className="text-xs sm:text-sm text-neutral-light">
              © 2025 Technos – Empresa Júnior. Todos os direitos reservados. Desenvolvido pelos membros da Technos.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6">
              {["Política de Privacidade", "Termos de Uso"].map((link, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className="text-neutral-light hover:text-brand-accent transition-colors duration-200"
                >
                  {link}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
