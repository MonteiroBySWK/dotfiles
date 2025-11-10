export interface DataSkillItemType {
  name: string;
  icon: React.JSX.Element;
}

export interface SkillContent {
  intro?: string;
  bullets: string[];
  outro?: string;
}

export interface SkillData {
  category: string;
  content: SkillContent;
  iconArr: DataSkillItemType[];
}
