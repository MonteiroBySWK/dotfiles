import { Table } from "antd";
import { IToKeys } from "../../types/IToKeys";

interface ColumnMapperProps {
  keys: string[];
}

export default function ColumnMapper<T>({ keys }: ColumnMapperProps) {
  const data = obj.toKeys();

  const columns = data.map((item) => (
    <Table.Column dataIndex={item as string} title={item as string} />
  ));

  console.log(columns);

  return <>{columns}</>;
}
