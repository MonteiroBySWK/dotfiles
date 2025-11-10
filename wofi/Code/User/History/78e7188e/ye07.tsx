import { useResponsive } from '../hooks/useResponsive';
import SkillsDesktop from './SkillsDesktop';
import SkillsMobile from './SkillsMobile';

// Este é o nosso componente "orquestrador" ou "universal"
export default function Skills() {
  const { isMobile } = useResponsive();

  // Se o hook disser que é mobile, renderizamos a versão de abas.
  // Caso contrário, renderizamos a versão de desktop com ScrollTrigger.
  if (isMobile) {
    return <SkillsMobile />;
  }

  return <SkillsDesktop />;

  // Alternativamente, usando um ternário:
  // return isMobile ? <SkillsMobile /> : <SkillsDesktop />;
}