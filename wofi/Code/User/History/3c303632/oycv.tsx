import StoryTelling from "../components/Timeline";
import TitleSection from "../components/ui/TitleSection";

export default function MyHistory() {
  return (
    <section className="h-max md:h-screen flex flex-col items-center max-w-7xl mx-auto text-txt-primary">
      <TitleSection>Timeline</TitleSection>
      <StoryTelling />
    </section>
  );
}
