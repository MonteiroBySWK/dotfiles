import { Table } from "antd";
import { Programa } from "../../types/Programa";

export default function ColumnMapper() {
  const columns = []
  
  for (const key in Programa) {

  }
  

  return (
    <>
      <Table.Column dataIndex="id" title={"ID"} />
    </>
  );
}
