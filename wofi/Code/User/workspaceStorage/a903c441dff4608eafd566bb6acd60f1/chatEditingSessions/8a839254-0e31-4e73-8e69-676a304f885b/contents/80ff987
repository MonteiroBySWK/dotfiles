import SlideIn from "../components/animation/SlideIn";
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
        className="object-cover h-48 w-full object-top"
      />

      {/* Conteúdo */}
      <div className="p-4 flex flex-col justify-between h-56">
        <div>
          <h3 className="text-primary text-lg font-semibold">{props.title}</h3>
          <p className="text-txt-primary mt-2">{props.description}</p>
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
      className="max-w-7xl flex flex-col mx-auto items-center px-4 md:px-0 py-16"
    >
      <TitleSection>Serviços Prestados</TitleSection>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full mt-10">
        {ServiceData.map((e, i) => (
          <SlideIn>
            <Service
              key={i}
              title={e.title}
              description={e.description}
              urlImage={e.urlImage}
            />
          </SlideIn>
        ))}
      </div>
    </Section>
  );
}
