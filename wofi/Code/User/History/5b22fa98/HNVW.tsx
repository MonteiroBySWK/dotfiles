"use client";
import { motion } from "framer-motion";
import {FlaskConical,Code2,Users,Rocket,Brain,Database,Cpu,} from "lucide-react";
import Image from "next/image";
import sobrenos from "../assets/logos/sobrenos2.jpg";

export default function AboutUsLab() {
  const stats = [
    {
      icon: <Code2 className="h-6 w-6" />,
      label: "Projetos Analisados",
    },
    {
      icon: <Users className="h-6 w-6" />,
      label: "Clientes Atendidos",
    },
    {
      icon: <FlaskConical className="h-6 w-6" />,
      label: "Laboratório Ativo",
    },
    {
      icon: <Rocket className="h-6 w-6" />,
      label: "Taxa de Sucesso",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 12,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section
      id="sobre"
      className="w-full min-h-screen py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br bg-[#0d0126]"
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

        

        {/*  particulas */}
       

        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-500/8 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 18,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div className="mb-12 space-y-6" variants={itemVariants}>
            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-300 via-purple-400 to-cyan-300 bg-clip-text text-transparent leading-tight"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 10,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              Sobre Nós
            </motion.h1>

            <motion.div
              className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 w-32 mx-auto rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: 128 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </motion.div>

          
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            
            {/* coluna da esquerda */}
            <motion.div
              className="lg:col-span-2 space-y-8"
              variants={itemVariants}
            >
          
              <motion.div
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
                whileHover={{
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  borderColor: "rgba(255, 255, 255, 0.2)",
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.h2
                  className="text-3xl md:text-4xl font-bold mb-6 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <span className="text-white">Fazemos </span>
                  <motion.span
                    className="text-blue-400"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    TECNOLOGIA
                  </motion.span>
                  <span className="text-white">
                    {" "}
                    que Impulsiona Resultados{" "}
                  </span>
                  <motion.span
                    className="text-purple-400"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: 1,
                    }}
                  >
                    REAIS
                  </motion.span>
                </motion.h2>

                <motion.p
                  className="text-lg md:text-xl text-white/80 leading-relaxed"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  Na <strong className="text-blue-400">Thera Lab</strong>,
                  operamos como um verdadeiro laboratório de análise e
                  desenvolvimento de sistemas. Nossa metodologia combina
                  pesquisa científica, experimentação controlada e
                  desenvolvimento ágil para criar soluções tecnológicas que
                  transformam desafios complexos em oportunidades de
                  crescimento.
                </motion.p>
              </motion.div>

              {/* icones shadcn */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3  gap-8"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {[
                  {
                    icon: <Brain className="h-6 w-6" />,
                    title: "Análise",
                    description:
                      "Investigação profunda aplicando metodologias científicas",
                    color: "from-blue-500 to-cyan-500",
                  },
                  {
                    icon: <FlaskConical className="h-6 w-6" />,
                    title: "Experimentação",
                    description: "Testes e prototipagem em ambiente controlado",
                    color: "from-purple-500 to-pink-500",
                  },
                  {
                    icon: <Rocket className="h-6 w-6" />,
                    title: "Implementação",
                    description: "Soluções robustas com monitoramento contínuo",
                    color: "from-emerald-500 to-teal-500",
                  },
                ].map((process, index) => (
                  <motion.div
                    key={index}
                    className=" bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center group"
                    variants={itemVariants}
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <motion.div
                      className={`mx-auto md:mx-0 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${process.color} mb-4`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className="text-white">{process.icon}</div>
                    </motion.div>
                    <motion.div
                      className="text-lg font-bold text-white mb-2"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      {process.title}
                    </motion.div>
                    <div className="text-white/60 text-sm">
                      {process.description}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* coluna direita */}
            <motion.div
              className="lg:col-span-1 space-y-6"
              variants={itemVariants}
            >
              {/* Laboratoruo imagem */}
              <motion.div
                className="bg-gradient-to-br h-80 md:h-full from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-8 border border-white/10  relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {/* imagem de sobre nos */}
                <div className="absolute inset-0 p-4">
                  <motion.div
                    className="w-full h-full relative rounded-xl overflow-hidden"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    
                    <Image
                      src={sobrenos.src}
                      alt="Laboratório de Tecnologia"
                      fill
                      className="object-cover rounded-xl"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 rounded-xl" />
                  </motion.div>

                  {/* mini icones-animações */}
                  <motion.div
                    className="absolute top-4 right-4 text-blue-400 z-10"
                    variants={floatingVariants}
                    animate="animate"
                  >
                    <Database className="h-8 w-8" />
                  </motion.div>
                  <motion.div
                    className="absolute bottom-4 left-4 text-purple-400 z-10"
                    variants={floatingVariants}
                    animate="animate"
                    style={{ animationDelay: "2s" }}
                  >
                    <Cpu className="h-8 w-8" />
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
