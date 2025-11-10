import StoryTelling from "../components/Timeline";
import TitleSection from "../components/TitleSection";

export default function MyHistory() {
  return (
    <section className="h-screen flex flex-col items-center max-w-7xl">
      <TitleSection>Timeline</TitleSection>
      <StoryTelling />
    </section>
  );
}
