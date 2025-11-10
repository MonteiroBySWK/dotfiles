import { Table } from "antd";
import { IToKeys } from "../../types/IToKeys";

// Todo: dar um tipo para os tipos dto
export default function ColumnMapper<T>({ obj }: { obj: IToKeys<T> }) {

  const data = obj.toKeys();

  const columns = data.map(item => <Table.Column dataIndex={item as string} title={item as string} />)

  console.log(columns)

  return <>{columns}</>;
}
