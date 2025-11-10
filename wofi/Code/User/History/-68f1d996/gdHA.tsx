import TitleSection from "../components/ui/TitleSection";
import { Card, CardContent } from "@/components/ui/card";
import { Code, Server, Globe, Database } from "lucide-react";

const services = [
  {
    icon: <Code className="w-10 h-10 text-green-400" />,
    title: "Desenvolvimento Web",
    description:
      "Criação de sites modernos, responsivos e otimizados para oferecer a melhor experiência de navegação.",
  },
  {
    icon: <Server className="w-10 h-10 text-green-400" />,
    title: "Infraestrutura & DevOps",
    description:
      "Automação de deploy, CI/CD e monitoramento para manter aplicações escaláveis e seguras.",
  },
  {
    icon: <Globe className="w-10 h-10 text-green-400" />,
    title: "Soluções em Nuvem",
    description:
      "Implementação e gerenciamento de soluções em nuvem (AWS, GCP, Vercel) com foco em alta disponibilidade.",
  },
  {
    icon: <Database className="w-10 h-10 text-green-400" />,
    title: "Banco de Dados",
    description:
      "Modelagem, otimização e administração de bancos de dados relacionais e não-relacionais.",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-20 px-6 md:px-12 lg:px-20 bg-[#0d0126]">
      <div className="max-w-6xl mx-auto">
        <TitleSection title="Serviços" subtitle="O que eu faço" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {services.map((service, index) => (
            <Card
              key={index}
              className="bg-[#1e293b] border-[#334155] text-[#f1f5f9] shadow-lg rounded-2xl p-6 hover:scale-105 hover:shadow-green-400/20 transition-transform"
            >
              <CardContent className="flex flex-col items-center text-center gap-4">
                {service.icon}
                <h3 className="text-xl font-semibold">{service.title}</h3>
                <p className="text-sm text-gray-300">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
