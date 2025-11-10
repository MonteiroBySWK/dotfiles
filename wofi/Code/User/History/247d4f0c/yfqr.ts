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

export type DataSkillType = {
  [key: string]: DataSkillItemType[];
};

export type DataType = {
  keys: string[];
  skills: DataSkillType;
};