import { useResponsive } from '../hooks/useResponsive';
import SkillsDesktop from './SkillsDesktop';
import SkillsMobile from './SkillsMobile';

// Este é o nosso componente "orquestrador" ou "universal"
export default function Skills() {
  const { isMobile } = useResponsive();

  return isMobile ? <SkillsMobile /> : <SkillsDesktop />;
}