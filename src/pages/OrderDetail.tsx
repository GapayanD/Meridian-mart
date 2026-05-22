import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, CreditCard, Clock } from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { formatCurrency, cn } from '../lib/utils';

const statusStyles: Record<string, string> = {
  pending:    'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped:    'bg-purple-100 text-purple-700',
  delivered:  'bg-emerald-100 text-emerald-700',
  cancelled:  'bg-red-100 text-red-700',
};

const OrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrderById } = useOrders();
  const navigate = useNavigate();
  const order = getOrderById(orderId || '');

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">Order not found.</p>
        <button
          onClick={() => navigate('/orders')}
          className="px-6 py-2 bg-blue-600 text-white rounded-xl font-medium"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/orders')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to orders
      </button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Order #{order.orderId.slice(-8).toUpperCase()}</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <span className={cn('text-sm font-bold px-4 py-1.5 rounded-full capitalize', statusStyles[order.status])}>
          {order.status}
        </span>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
          <Package className="w-4 h-4 text-gray-400" />
          <h3 className="font-semibold text-sm">Items ({order.items.length})</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {order.items.map(item => (
            <div key={item.id + (item.variantLabel || '')} className="flex items-center gap-4 p-5">
              <img src={item.image} alt={item.name} className="h-16 w-16 rounded-xl object-cover bg-gray-50 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                {item.variantLabel && <p className="text-xs text-gray-500">{item.variantLabel}</p>}
                <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
              </div>
              <span className="text-sm font-bold text-gray-900">{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <h3 className="font-semibold text-sm">Delivery Information</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 text-xs mb-1">Method</p>
            <p className="font-medium text-gray-900">{order.deliveryMethod}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Recipient</p>
            <p className="font-medium text-gray-900">{order.customerName}</p>
          </div>
          <div className="col-span-2">
            <p className="text-gray-500 text-xs mb-1">Address</p>
            <p className="font-medium text-gray-900">{order.deliveryAddress}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 text-white rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <CreditCard className="w-4 h-4 text-amber-400" />
          <h3 className="font-semibold text-sm">Payment Summary</h3>
        </div>
        <div className="flex justify-between text-sm text-gray-300">
          <span>Subtotal</span>
          <span>{formatCurrency(order.total - order.shippingFee)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-300">
          <span>Shipping</span>
          <span>{order.shippingFee === 0 ? 'Free' : formatCurrency(order.shippingFee)}</span>
        </div>
        <div className="border-t border-gray-700 pt-3 flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold text-amber-400">{formatCurrency(order.total)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
