import { Table } from "antd";

// Todo: dar um tipo para os tipos dto
export default function ColumnMapper({ obj }: { obj: Object }) {
  const columns = [];

  for (const key in obj.toObject()) {
    columns.push(<Table.Column dataIndex={key} title={key.toUpperCase()} />);
  }

  return <>{columns}</>;
}
