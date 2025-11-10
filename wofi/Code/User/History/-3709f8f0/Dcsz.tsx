"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import logofab from "@/app/assets/logos/logofab.png"; 
import cesjo from "@/app/assets/logos/cesjo.jpg";
import logotechnos from "@/app/assets/logos/logotechnos.jpg";
import logouema from "@/app/assets/logos/logouema.png";
import logoshift from "@/app/assets/logos/logoshift.jpg";
import logoufma from "@/app/assets/logos/logoufma.png";

const testimonials = [
  {
    image: logofab,
    name: "Força Aérea Brasileira(FAB)",
    depoimento:
      "Projeto e desenvolvimento de um sistema educacional exclusivo para a Escola Caminho das Estrelas, voltado à modernização da gestão escolar, com recursos adaptados à realidade da instituição e alinhados com os padrões da FAB.",
  },

  //depoimento: "Ótimo serviço, super recomendo!",
  //  name: "Shift Branding (Empresa de Marketing)",

  {
    image: cesjo,
    depoimento:
      "Desenvolvimento de um sistema personalizado voltado ao gerenciamento e apoio ao ensino da escola, com foco em facilitar a organização pedagógica e a comunicação entre alunos, professores e equipe administrativa.",
    name: (
      <>
        Centro de Emsino São José Operário <br />
        (CESJO)
      </>
    ),
  },

  {
    image: logotechnos,
    depoimento:
      "Criação e desenvolvimento da landing page oficial da Technos, com foco em identidade visual moderna, navegação intuitiva e apresentação clara dos serviços da empresa júnior, fortalecendo sua presença digital.",
    name: "Technos-Empresa Junior",
  },
  {
    image: logoshift,
    depoimento:
      "Desenvolvimento de uma solução de automação personalizada voltada à captação de clientes, integrando ferramentas e estratégias digitais para agilizar o processo de prospecção, qualificação de leads e acompanhamento de oportunidades.",
    name: "Shift Branding",
  },
  {
    image: logoufma,
    depoimento:
      "Desenvolvimento de ferramentas internas para aprimorar fluxos operacionais e acadêmicos, contribuindo para a transformação digital da universidade e promovendo inovação tecnológica nos serviços institucionais.",
    name: (
      <>
        Universidade Federal do Maranhão <br /> (UFMA)
      </>
    ),
  },
  {
    image: logouema,
    depoimento:
      "Atuação no desenvolvimento de sistemas internos para melhoria de processos institucionais, com soluções voltadas à automação, eficiência e suporte à gestão acadêmica e administrativa.",
    name: (
      <>
        Universidade Estadual do Maranhão <br />
        (UEMA)
      </>
    ),
  },

  //{ depoimento: "Recomendo! Serviço responsável!", name: "Ana Souza" },
  /*{ depoimento: "Equipe muito atenciosa e profissional.", name: "Carlos Lima" },
  {
    depoimento: "Uma experiência incrível!",
    name: "Cliente 4",
  },*/
];

export default function Slider() {
  const [index, setIndex] = useState(0);
  //itens por pag dinamico-3 depoimentos/ pag
  const [itemsPorPag, setItemsPorPag] = useState(3);
  {
    /*quantos DEPOIMENTOS POR "PAGINA" */
  }
  //limite index para nao mostrar espaços vazios
  const limIndex = Math.max(testimonials.length - itemsPorPag, 0);

  //hook do carrossel
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex < limIndex ? prevIndex + 1 : 0));
    }, 5000);
    return () => clearInterval(interval);
  }, [index]);

  const nextTestimonial = () => {
    setIndex((prevIndex) => (prevIndex < limIndex ? prevIndex + 1 : 0));
  };

  const prevTestimonial = () => {
    setIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : limIndex));
  };
  //redimensionar cards no mobile e desktop
  useEffect(() => {
    const atualizarItems = () => {
      if (window.innerWidth < 768) {
        setItemsPorPag(1);
      } else {
        setItemsPorPag(3);
      }
    };

    atualizarItems();

    window.addEventListener("resize", atualizarItems);

    return () => {
      window.removeEventListener("resize", atualizarItems);
    };
  }, []);

  return (
    <section id="empresas" className=" w-full px-4 py-10 bg-autopy-10 relative">
      <div className="text-center mb-2 md:mb-10 space-y-4  ">
        <span className="text-3xl md:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-300 via-purple-400 to-indigo-300 bg-clip-text text-transparent text-center  leading-tight ">
          Instituições que trabalham conosco
        </span>

        <div className="h-1 bg-gradient-to-r from-purple-500 to-blue-500 w-24 mx-auto rounded-xl " />
      </div>
      {/*ficar um ao lado do outro
      <div className="flex flex-wrap justify-center gap-4">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="w-full md:w-[calc(33.333%-1rem)] lg:w-[calc(33.333%-1rem)]"
          > */}

      <div className="relative w-full flex items-center justify-center">
        <button
          onClick={prevTestimonial}
          className="absolute left-2 sm:left-0 top-1/2 transform -translate-y-1/2 p-2 flex justify-center items-center bg-fuchsia-950 rounded-full z-10 overflow-visible"
        >
          <ChevronLeft />
        </button>

        <div className="overflow-hidden  relative gap-5 mt-10">
          <div
            className="flex transition-transform duration-500 ease-in-out w-full"
            style={{
              transform: `translateX(-${index * (100 / itemsPorPag)}%)`,
            }}
          >
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-full px-2  md:w-1/3 "
                style={{ width: `${100 / itemsPorPag}%` }}
              >
                <div className="relative flex flex-col  justify-between min-h-[360px] max-h-[600px]  items-center w-full  mx-auto px-2  p-6 mt-3 bg-gradient-to-br from-[#110734]/70 to-[#0d0126]/90  rounded-2xl border border-[#3a1a6d] backdrop-blur-sm shadow-2xl shadow-[#1e0349]/30 hover:border-[#5a2d9a] transition-all duration-300 ">
                  <div className="text-center relative w-full min-h-[200px] md:min-h-[200px]    flex flex-col md:flex-col items-center justify-center gap-2 pr-2">
                    <img
                      //"text-lg font-semibold ax-h-24 overflow-hidden :">
                      src={testimonial.image?.src}
                      className="mx-auto max-h-40 object-contain rounded-full"
                    />
                    <p className="mt-3 mb-6 text-amber-200">
                      {testimonial.name}
                    </p>
                    <p className="mt-3 mb-6  text-amber-200">
                      {testimonial.depoimento}
                    </p>
                    {/*{Array.from({ length: testimonials.length }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setIndex(idx)}
                    className={`h-2 w-2 mx-1  rounded-full ${
                      idx === index ? "bg-purple-500" : "bg-gray-300"
                  }`}
                  />
                ))}
                    pontinhos mobile}`}
                  */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/*}
        <div className="flex justify-center mt-4 md:hidden">
          {Array.from({ length: testimonials.length }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setIndex(idx)}
              className={`h-2 w-2 mx-1 rounded-full ${
                idx === index ? "bg-purple-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
                    pontinhos mobile}`}
        */}

        <button
          onClick={nextTestimonial}
          className="absolute right-2 sm:right-0  top-1/2 transform -translate-y-1/2  p-2  flex justify-center items-center bg-fuchsia-950 rounded-full z-10 overflow-visible"
        >
          <ChevronRight />
        </button>
      </div>
    </section>
  );
}
