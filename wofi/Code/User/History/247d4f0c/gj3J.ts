export type DataSkillItemType = {
  name: string;
  icon: React.JSX.Element;
};

export type DataSkillType = {
  [key: string]: DataSkillItemType[];
};