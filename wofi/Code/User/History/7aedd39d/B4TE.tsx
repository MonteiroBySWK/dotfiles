import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import type { BaseRecord } from "@refinedev/core";
import { Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import ColumnMapper from "../../components/table/ColumnMapper";
import { Programa } from "../../types/Programa";

export const CategoryList = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  // Gera as colunas automaticamente
  const autoColumns = ColumnMapper({ keys: Programa.getKeys() });

  // Adiciona a coluna de ações
  const columns: ColumnsType<BaseRecord> = [
    ...autoColumns,
    {
      title: "Ações",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <EditButton hideText size="small" recordItemId={record.id} />
          <ShowButton hideText size="small" recordItemId={record.id} />
          <DeleteButton hideText size="small" recordItemId={record.id} />
        </Space>
      ),
    },
  ];

  return (
    <List>
      <Table {...tableProps} rowKey="id" columns={columns} />
    </List>
  );
};
