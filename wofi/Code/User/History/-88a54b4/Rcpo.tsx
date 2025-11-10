import { Table } from "antd";
import { IDataType } from "../../types/IDataType";

// Todo: dar um tipo para os tipos dto
export default function ColumnMapper({ obj }: { obj: IDataType }) {
  const columns = [];

  for (const key in obj.toObject()) {
    columns.push(<Table.Column dataIndex={key} title={key.toUpperCase()} />);
  }

  return <>{columns}</>;
}
