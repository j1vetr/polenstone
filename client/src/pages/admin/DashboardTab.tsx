import { Package, ShoppingCart, Users, DollarSign, Clock, Grid3x3, TrendingUp, ChevronRight } from 'lucide-react';
import type { Stats, Order, Product, TabType } from './_shared/types';

interface DashboardTabProps {
  stats: Stats | null | undefined;
  orders: Order[];
  products: Product[];
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
  onNavigate: (tab: TabType) => void;
}

export default function DashboardTab({ stats, orders, products, getStatusColor, getStatusLabel, onNavigate }: DashboardTabProps) {
  const setActiveTab = onNavigate;
  return (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white border border-neutral-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Package className="w-8 h-8 text-blue-400" />
                    <span className="text-xs text-neutral-500">Toplam</span>
                  </div>
                  <p className="text-3xl font-bold text-neutral-900">{stats?.totalProducts || 0}</p>
                  <p className="text-sm text-neutral-500 mt-1">Ürün</p>
                </div>
                
                <div className="bg-white border border-neutral-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <ShoppingCart className="w-8 h-8 text-emerald-400" />
                    <span className="text-xs text-neutral-500">Toplam</span>
                  </div>
                  <p className="text-3xl font-bold text-neutral-900">{stats?.totalOrders || 0}</p>
                  <p className="text-sm text-neutral-500 mt-1">Sipariş</p>
                </div>
                
                <div className="bg-white border border-neutral-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Users className="w-8 h-8 text-purple-400" />
                    <span className="text-xs text-neutral-500">Toplam</span>
                  </div>
                  <p className="text-3xl font-bold text-neutral-900">{stats?.totalUsers || 0}</p>
                  <p className="text-sm text-neutral-500 mt-1">Kullanıcı</p>
                </div>
                
                <div className="bg-white border border-neutral-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <DollarSign className="w-8 h-8 text-yellow-400" />
                    <span className="text-xs text-neutral-500">Toplam</span>
                  </div>
                  <p className="text-3xl font-bold text-neutral-900">{(stats?.totalRevenue || 0).toLocaleString('tr-TR')}₺</p>
                  <p className="text-sm text-neutral-500 mt-1">Gelir</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-neutral-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-neutral-900">Son Siparişler</h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-sm text-neutral-500 hover:text-neutral-900 flex items-center gap-1"
                    >
                      Tümü <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-neutral-100 rounded-lg">
                        <div>
                          <p className="font-medium text-neutral-900">{order.orderNumber}</p>
                          <p className="text-sm text-neutral-500">{order.customerName}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-neutral-900">{order.total}₺</p>
                          <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                        </div>
                      </div>
                    ))}
                    {orders.length === 0 && (
                      <p className="text-center text-neutral-500 py-8">Henüz sipariş yok</p>
                    )}
                  </div>
                </div>

                <div className="bg-white border border-neutral-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-neutral-900">Hızlı İstatistikler</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-neutral-100 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-yellow-400" />
                        <span className="text-neutral-700">Bekleyen Siparişler</span>
                      </div>
                      <span className="text-2xl font-bold text-neutral-900">{stats?.pendingOrders || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-neutral-100 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Grid3x3 className="w-5 h-5 text-blue-400" />
                        <span className="text-neutral-700">Kategoriler</span>
                      </div>
                      <span className="text-2xl font-bold text-neutral-900">{stats?.totalCategories || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-neutral-100 rounded-lg">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                        <span className="text-neutral-700">Aktif Ürünler</span>
                      </div>
                      <span className="text-2xl font-bold text-neutral-900">{products.filter(p => p.isActive).length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  );
}
