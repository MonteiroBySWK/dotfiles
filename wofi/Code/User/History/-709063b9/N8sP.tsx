import { Card } from '@/components/ui/card';
import {
  DollarSign,
  Users,
  Package,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Fev', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Abr', value: 800 },
  { name: 'Mai', value: 700 },
  { name: 'Jun', value: 900 },
];

const stats = [
  {
    title: 'Receita Total',
    value: 'R$ 75.249,00',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
  },
  {
    title: 'Clientes Ativos',
    value: '1,234',
    change: '+3.2%',
    trend: 'up',
    icon: Users,
  },
  {
    title: 'Produtos Vendidos',
    value: '856',
    change: '-2.1%',
    trend: 'down',
    icon: Package,
  },
  {
    title: 'Taxa de Conversão',
    value: '3.2%',
    change: '+2.4%',
    trend: 'up',
    icon: TrendingUp,
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
              </div>
              <stat.icon className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex items-center mt-4 text-sm">
              {stat.trend === 'up' ? (
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              )}
              <span
                className={stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}
              >
                {stat.change}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Vendas Mensais</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--brand-primary-dark))"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
