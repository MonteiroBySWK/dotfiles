import { Table } from "antd";
import { IToKeys } from "../../types/IToKeys";
import { useEffect } from "react";

// Todo: dar um tipo para os tipos dto
export default function ColumnMapper<T>({ obj }: { obj: IToKeys<T> }) {
  const columns = [];

  const data = obj.toKeys();
  console.log(data);

  columns.push(<Table.Column dataIndex={key} title={key.toUpperCase()} />);

  return <>{columns}</>;
}
