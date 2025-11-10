export type DataSkillItemType = {
  name: string;
  icon: React.JSX.Element;
};

export type DataSkillType = {
  [key: string]: DataSkillItemType[];
};

export type DataType = {
  keys: string[];
  skills: DataSkillType;
};
