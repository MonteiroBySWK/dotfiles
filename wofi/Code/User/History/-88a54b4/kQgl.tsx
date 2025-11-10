import type { ColumnsType } from "antd/es/table";

interface ColumnMapperProps {
  keys: string[];
  formatTitle?: (key: string) => string;
}

export default function ColumnMapper({ keys, formatTitle }: ColumnMapperProps) {
  const defaultFormatTitle = (key: string): string => {
    return key
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const titleFormatter = formatTitle || defaultFormatTitle;

  const columns: ColumnsType<any> = keys.map(key => ({
    key: key,
    dataIndex: key,
    title: titleFormatter(key),
  }));

  return columns;
}
