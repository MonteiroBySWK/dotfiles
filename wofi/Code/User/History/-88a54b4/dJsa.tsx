import { Table } from "antd";
import { Programa } from "../../types/Programa";

export default function ColumnMapper() {
  const columns = [];

  for (const key in Programa) {
    columns.push(
      <>
        {" "}
        <Table.Column dataIndex="id" title={"ID"} />
      </>
    );
  }

  return (
    <>
      <Table.Column dataIndex="id" title={"ID"} />
    </>
  );
}
