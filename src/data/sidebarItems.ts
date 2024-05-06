import {
  DashboardIcon,
  OrdersIcon,
  ProductIcon,
  UsersIcon,
  ScheduleIcon,
} from '@/components/icons';

export const sidebarItems = [
  {
    label: 'Panel',
    link: '/panel',
    icon: DashboardIcon,
  },
  {
    label: 'Productos',
    link: '/productos',
    icon: ProductIcon,
  },
  {
    label: 'Ordenes',
    link: '/ordenes',
    icon: OrdersIcon,
  },
  {
    label: 'Usuarios',
    link: '/usuarios',
    icon: UsersIcon,
  },
  {
    label: 'Calendario',
    link: '/calendario',
    icon: ScheduleIcon,
  },
];
