import { withAuth } from '../platform/auth'

export default [
  {
    url: '/api/tenant/dashboard/stats',
    method: 'GET',
    response: withAuth(() => ({
      code: 200,
      data: {
        todayOrders: 36,
        todayRevenue: 4280.5,
        totalProducts: 152,
        totalCustomers: 1893,
      },
      msg: 'success',
    })),
  },
  {
    url: '/api/tenant/dashboard/recent-orders',
    method: 'GET',
    response: withAuth(() => ({
      code: 200,
      data: [
        { id: 1, orderNo: 'ORD20240001', customerName: '张三', amount: 128.00, status: 1, createdAt: '2024-01-15 10:00:00' },
        { id: 2, orderNo: 'ORD20240002', customerName: '李四', amount: 256.50, status: 2, createdAt: '2024-01-15 11:00:00' },
        { id: 3, orderNo: 'ORD20240003', customerName: '王五', amount: 89.90, status: 0, createdAt: '2024-01-15 12:00:00' },
        { id: 4, orderNo: 'ORD20240004', customerName: '赵六', amount: 432.00, status: 3, createdAt: '2024-01-15 13:00:00' },
        { id: 5, orderNo: 'ORD20240005', customerName: '钱七', amount: 67.80, status: 1, createdAt: '2024-01-15 14:00:00' },
      ],
      msg: 'success',
    })),
  },
]
