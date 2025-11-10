import { Table } from "antd";
import { Programa } from "../../types/Programa";

// Todo: dar um tipo para os tipos dto
export default function ColumnMapper({ obj }: { obj: Object }) {
  const columns = [];

  for (const key in obj) {
    columns.push(
      <>
        <Table.Column dataIndex={key} title={key.toUpperCase()} />
      </>
    );
  }

  return <>{columns}</>;
}
