import StoryTelling from "../components/Timeline";
import TitleSection from "../components/TitleSection";

export default function MyHistory() {
  return (
    <section className="flex flex-col items-center max-w-7xl mx-auto text-txt-primary">
      <TitleSection>Timeline</TitleSection>
      <StoryTelling />
    </section>
  );
}
