import ZoomIn from "../components/animation/ZoomIn";
import Section from "../components/ui/Section";
import TitleSection from "../components/ui/TitleSection";
import { type ServiceProps, ServiceData } from "../constants/ServiceData";

const Service = (props: ServiceProps) => {
  return (
    <div className="flex flex-col bg-card/10 border border-dashed border-border shadow-md overflow-hidden transform transition duration-300 hover:scale-105 cursor-pointer">
      {/* Imagem */}
      <img
        src={props.urlImage}
        alt={`card-${props.title}`}
        className="object-cover h-40 sm:h-48 w-full object-top"
      />

      {/* Conteúdo */}
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <h2 className="text-primary text-base sm:text-lg font-semibold">
            {props.title}
          </h2>
          <div className="mt-2">
            <p className="text-txt-primary text-sm sm:text-base">
              {props.description}
            </p>
          </div>

          {/* Highlights (apenas em telas md+) */}
          {props.highlights && props.highlights.length > 0 && (
            <ul className="mt-4 space-y-2 text-sm text-txt-primary hidden md:block">
              {props.highlights.map((item, i) => (
                <li key={i} className="flex items-start gap-2 leading-snug">
                  <span className="text-primary">•</span> {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        <a
          href="#"
          className="mt-4 inline-block bg-primary text-white px-4 py-2 font-medium text-sm text-center hover:bg-primary/90 transition"
        >
          Saiba Mais
        </a>
      </div>
    </div>
  );
};

export default function Services() {
  return (
    <Section
      id="services"
      className="max-w-7xl flex flex-col mx-auto items-center justify-center py-16"
    >
      <TitleSection>Serviços Prestados</TitleSection>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full mt-10">
        {ServiceData.map((e, i) => (
          <ZoomIn key={i} delay={i / 6}>
            <Service
              title={e.title}
              description={e.description}
              highlights={e.highlights}
              urlImage={e.urlImage}
            />
          </ZoomIn>
        ))}
      </div>
    </Section>
  );
}
