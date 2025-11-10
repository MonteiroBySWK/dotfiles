import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  ClipboardList,
  Settings,
  DollarSign,
  BarChart2
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Users, label: 'Clientes', href: '/admin/customers' },
  { icon: Package, label: 'Produtos', href: '/admin/products' },
  { icon: ClipboardList, label: 'Pedidos', href: '/admin/orders' },
  { icon: DollarSign, label: 'Financeiro', href: '/admin/financial' },
  { icon: BarChart2, label: 'Relatórios', href: '/admin/reports' },
  { icon: Settings, label: 'Configurações', href: '/admin/settings' },
];

export function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-sidebar-background border-r border-border">
      <div className="h-16 flex items-center justify-center border-b border-border">
        <h1 className="text-xl font-bold text-brand-primary-dark">Technos ERP</h1>
      </div>
      <nav className="p-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
