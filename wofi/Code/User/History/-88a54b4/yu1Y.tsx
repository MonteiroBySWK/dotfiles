import { Table } from "antd";
import { IDataType } from "../../types/IDataType";
import { useEffect } from "react";

// Todo: dar um tipo para os tipos dto
export default function ColumnMapper({ obj }: { obj: Object }) {
  const columns = [];

  const data = obj.toObject();

  for (const key in obj.toObject()) {
    columns.push(<Table.Column dataIndex={key} title={key.toUpperCase()} />);
  }

  return <>{columns}</>;
}
