import { Table } from "antd";
import { IDataType } from "../../types/IDataType";
import { useEffect } from "react";

// Todo: dar um tipo para os tipos dto
export default function ColumnMapper({ obj }: { obj: IDataType }) {
  const columns = [];

  const data = obj.toKeys();
  console.log(data);

  columns.push(<Table.Column dataIndex={key} title={key.toUpperCase()} />);

  return <>{columns}</>;
}
