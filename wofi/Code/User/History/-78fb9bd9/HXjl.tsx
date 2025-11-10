"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import {ChevronLeft,ChevronRight,ExternalLink,} from "lucide-react";
import Link from "next/link";
import sobrenos from "@/app/assets/logos/sobrenos.jpg";

export default function Projects() {
  const [currentProject, setCurrentProject] = useState(0);

  const projects = [
    {
      title: "Sistema de Atendimento",
      description:
        "O projeto consistiu no desenvolvimento e implementação de um sistema de atendimento voltado para a modernização da comunicação entre órgãos governamentais e os cidadãos. A iniciativa surgiu da necessidade de centralizar, organizar e automatizar os canais de atendimento ao público, promovendo maior eficiência, transparência e acessibilidade nos serviços públicos.",
      image: sobrenos,
      technologies: ["React", "Node.js"],
      link: "https://cmsw.com/",
    },
    {
      title: "Landing Page",
      description:
        "Responsável pelo desenvolvimento da landing page institucional da Empresa Júnior Technos, vinculada à Universidade Estadual do Maranhão (UEMA). O projeto teve como foco a criação de uma interface intuitiva, responsiva e com performance otimizada, voltada para a apresentação dos serviços, valores e identidade da empresa.",
      image: sobrenos,
      technologies: ["React", "NextJs", "Tailwind CSS"],
      link: "https://cmsw.com/",
    },
    {
      title: "Sistema de Captação de Clientes",
      description:
        "Sistema web para gestão empresarial com módulos de CRM, financeiro, estoque e relatórios. Dashboard interativo com métricas em tempo real e automação de processos.",
      image: sobrenos,
      technologies: ["Vue.js", "Python", "B2B"],
      link: "https://cmsw.com/",
    },
    {
      title: "Sistema de Dormitório",
      description:
        "Projeto voltado ao desenvolvimento de um sistema web para o gerenciamento dos dormitórios utilizados por militares da Força Aérea Brasileira. A solução foi projetada para automatizar processos internos, facilitar o controle de ocupações e otimizar a logística de alocação dos leitos nos alojamentos da corporação.",
      image: sobrenos,
      technologies: ["Python"],
      link: "https://cmsw.com/",
    },
  ];

  const nextProject = () => {
    setCurrentProject((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setCurrentProject((prev) => (prev - 1 + projects.length) % projects.length);
  };

  return (
    <section
      id="projetos"
      className="w-full min-h-screen py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-[#0d0126] "
    >
  
      <div className="absolute inset-0 overflow-hidden">
  
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{ x: [0, -80, 0], y: [0, 60, 0] }}
          transition={{
            duration: 30,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-500/8 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute top-10 right-20 w-32 h-32 border border-blue-500/20"
          style={{
            clipPath:
              "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          }}
          animate={{ rotate: [0, 360] }}
          transition={{
            duration: 40,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-32 left-16 w-24 h-24 border border-purple-500/20"
          style={{
            clipPath:
              "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          }}
          animate={{ rotate: [360, 0] }}
          transition={{
            duration: 35,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
      
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-300 via-purple-400 to-indigo-300 bg-clip-text text-transparent leading-tight mb-6"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
           Projetos
          </motion.h1> 
          <motion.div
              className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 w-32 mx-auto rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: 128 }}
              transition={{ duration: 1, delay: 0.5 }}
            />

          <motion.p
            className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Projetos desenvolvidos com excelência e inovação científica,
            transformando ideias em soluções tecnológicas de impacto.
          </motion.p>
        </motion.div>

        <div className="relative">
          <motion.div
            key={currentProject}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(event, info) => {
              if (info.offset.x < -100) {
                nextProject();
              } else if (info.offset.x > 100) {
                prevProject();
              }
            }}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
          
            <motion.div
              className="relative group"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <Image
                src={projects[currentProject].image || "/placeholder.svg"}
                alt={projects[currentProject].title}
                width={600}
                height={400}
                className="relative w-full h-auto rounded-2xl border border-white/10 shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0126]/40 to-transparent rounded-2xl" />
              
              <motion.div
                className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm rounded-full p-2"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.3 }}
              ></motion.div>
            </motion.div>
            
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                  {projects[currentProject].title}
                </h3>
                <p className="text-lg text-white/80 leading-relaxed">
                  {projects[currentProject].description}
                </p>
              </motion.div>

            
              <motion.div
                className="flex flex-wrap gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {projects[currentProject].technologies.map((tech, index) => (
                  <motion.span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30 rounded-full text-sm text-white font-medium backdrop-blur-sm"
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "rgba(59, 130, 246, 0.3)",
                      borderColor: "rgba(59, 130, 246, 0.5)",
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </motion.div>

             
              <motion.div
                className="pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Link href={projects[currentProject].link}>
                  <motion.button
                    className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10">SAIBA MAIS</span>
                    <motion.div
                      className="relative z-10"
                      animate={{ x: [0, 5, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    >
                      <ExternalLink className="h-5 w-5" />
                    </motion.div>

                    {/* Button glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          <motion.button
            onClick={prevProject}
            className="hidden md:flex absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-4 text-white transition-all duration-300 border border-white/10 hover:border-white/20 group"
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-6 h-6 group-hover:text-blue-400 transition-colors" />
          </motion.button>

          <motion.button
            onClick={nextProject}
            className="hidden md:flex absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-4 text-white transition-all duration-300 border border-white/10 hover:border-white/20 group"
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="w-6 h-6 group-hover:text-blue-400 transition-colors" />
          </motion.button>

          <div className="flex justify-center mt-12 space-x-3">
            {projects.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentProject(index)}
                className={`relative w-4 h-4 rounded-full transition-all duration-300 ${
                  index === currentProject
                    ? "bg-gradient-to-r from-blue-400 to-purple-600 shadow-lg shadow-blue-500/50"
                    : "bg-white/20 hover:bg-white/40 border border-white/30"
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {index === currentProject && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full"
                    layoutId="activeIndicator"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
