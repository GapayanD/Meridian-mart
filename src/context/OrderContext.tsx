import React, { createContext, useContext, useState, useEffect } from 'react';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variantLabel?: string;
}

export interface CustomerOrder {
  orderId: string;
  items: OrderItem[];
  total: number;
  shippingFee: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryMethod: string;
  createdAt: string;
  notes?: string;
}

interface OrderContextType {
  orders: CustomerOrder[];
  addOrder: (order: CustomerOrder) => void;
  getOrderById: (id: string) => CustomerOrder | undefined;
  clearHistory: () => void;
}

const STORAGE_KEY = 'mm_order_history';

function readOrders(): CustomerOrder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

function writeOrders(orders: CustomerOrder[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(orders)); } catch {}
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<CustomerOrder[]>(readOrders);
  useEffect(() => { writeOrders(orders); }, [orders]);

  const addOrder = (order: CustomerOrder) => setOrders(prev => [order, ...prev]);
  const getOrderById = (id: string) => orders.find(o => o.orderId === id);
  const clearHistory = () => setOrders([]);

  return (
    <OrderContext.Provider value={{ orders, addOrder, getOrderById, clearHistory }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within OrderProvider');
  return ctx;
};