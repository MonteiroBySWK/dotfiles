import { useResponsive } from '../hooks/useResponsive';
import SkillsDesktop from './SkillsDesktop';
import SkillsMobile from './SkillsMobile';

export default function Skills() {
  const { isMobile } = useResponsive();

  return isMobile ? <SkillsMobile /> : <SkillsDesktop />;
}