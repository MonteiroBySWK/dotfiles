import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import type { BaseRecord } from "@refinedev/core";
import { Space, Table } from "antd";
import ColumnMapper from "../../components/table/ColumnMapper";
import { Programa } from "../../types/Programa";

export const CategoryList = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });


  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <ColumnMapper obj={Programa}/>
        <Table.Column
          title={"Actions"}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
