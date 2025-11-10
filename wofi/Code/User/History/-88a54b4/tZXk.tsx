import { Table } from "antd";

interface ColumnMapperProps {
  keys: string[];
}

export default function ColumnMapper({ keys }: ColumnMapperProps) {
  const columns = keys.map((item) => (
    <Table.Column
      key={item}
      dataIndex={item}
      title={item.charAt(0).toUpperCase() + item.slice(1)} // Capitaliza a primeira letra
    />
  ));

  return <>{columns}</>;
}
