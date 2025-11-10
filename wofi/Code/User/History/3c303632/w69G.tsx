import StoryTelling from "../components/Timeline";
import TitleSection from "../components/TitleSection";

export default function MyHistory() {
  return (
    <section className="h-screen">
      <TitleSection>Timeline</TitleSection>
      <StoryTelling />
    </section>
  );
}
