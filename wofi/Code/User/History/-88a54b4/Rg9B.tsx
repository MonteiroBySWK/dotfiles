import { Table } from "antd";
import { Programa } from "../../types/Programa";

export default function ColumnMapper(obj: Object) {
  const columns = [];

  for (const key in obj) {
    columns.push(
      <>
        <Table.Column dataIndex={key} title={key.toUpperCase()} />
      </>
    );
  }

  return (
    <>
      {columns}
    </>
  );
}
