import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Trash2, ShoppingBag } from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { formatCurrency, cn } from '../lib/utils';

const statusStyles: Record<string, string> = {
  pending:    'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped:    'bg-purple-100 text-purple-700',
  delivered:  'bg-emerald-100 text-emerald-700',
  cancelled:  'bg-red-100 text-red-700',
};

const OrderHistory: React.FC = () => {
  const { orders, clearHistory } = useOrders();

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">No Orders Yet</h2>
        <p className="text-gray-500 mt-2 mb-8 max-w-xs">
          Your completed orders will appear here.
        </p>
        <Link to="/" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
          <p className="text-sm text-gray-500 mt-1">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={clearHistory}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
        >
          <Trash2 className="w-4 h-4" />
          Clear
        </button>
      </div>

      <div className="space-y-4">
        {orders.map(order => (
          <Link
            key={order.orderId}
            to={`/orders/${order.orderId}`}
            className="block bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:shadow-gray-100/50 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Order #{order.orderId.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
              <span className={cn('text-xs font-bold px-3 py-1 rounded-full capitalize', statusStyles[order.status])}>
                {order.status}
              </span>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {order.items.slice(0, 4).map(item => (
                <img key={item.id} src={item.image} alt={item.name} className="h-14 w-14 rounded-lg object-cover bg-gray-50 shrink-0" />
              ))}
              {order.items.length > 4 && (
                <div className="h-14 w-14 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 text-xs font-bold text-gray-500">
                  +{order.items.length - 4}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
              <span className="text-sm text-gray-500">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900">{formatCurrency(order.total)}</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
