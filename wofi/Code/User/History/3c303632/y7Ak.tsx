import StoryTelling from "../components/Timeline";
import Section from "../components/ui/Section";
import TitleSection from "../components/ui/TitleSection";

export default function MyHistory() {
  return (
    <Section id="history" className="h-max md:h-screen flex flex-col items-center max-w-7xl mx-auto text-txt-primary">
      <TitleSection>Timeline</TitleSection>
      <StoryTelling />
       {/* Instruções para mobile */}
      <div className="md:hidden mt-4 text-center">
        <p className="text-xs text-txt-primary opacity-70">
          Clique para ver detalhes
        </p>
      </div>
    </Section>
  );
}
