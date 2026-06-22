"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/utils";
import { updateOrderStatus } from "@/app/admin/actions";
import type { Order, OrderItem, OrderStatus } from "@/lib/supabase/types";

const STATUSES: OrderStatus[] = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"];

type Row = Order & { order_items: OrderItem[] };

export function OrdersTable({ orders }: { orders: Row[] }) {
  if (orders.length === 0) return <Empty label="No orders yet." />;
  return (
    <div className="flex flex-col gap-3">
      {orders.map((o) => (
        <OrderCard key={o.id} order={o} />
      ))}
    </div>
  );
}

function OrderCard({ order }: { order: Row }) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [pending, start] = useTransition();
  const shipping = (order.shipping ?? {}) as Record<string, string>;

  const onChange = (next: OrderStatus) => {
    const prev = status;
    setStatus(next);
    start(async () => {
      const res = await updateOrderStatus(order.id, next);
      if (!res.ok) {
        setStatus(prev);
        toast.error(res.error || "Update failed");
      } else {
        toast.success(`Order marked ${next}`);
      }
    });
  };

  return (
    <div className="p-4 rounded-xl flex flex-col md:flex-row md:items-center gap-4"
      style={{ background: "var(--color-ivory)", border: "1px solid rgba(209,168,110,0.2)" }}>
      <div className="flex-1" style={{ fontFamily: "var(--font-body)" }}>
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm" style={{ color: "var(--color-midnight)" }}>{order.order_number}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(209,168,110,0.12)", color: "var(--color-gold-dark)" }}>
            {order.payment_method ?? "—"}
          </span>
        </div>
        <p className="text-xs mt-1" style={{ color: "rgba(45,41,38,0.55)" }}>
          {shipping.name ? `${shipping.name} · ` : ""}{shipping.email ?? ""}{shipping.phone ? ` · ${shipping.phone}` : ""}
        </p>
        <p className="text-[11px] mt-0.5" style={{ color: "rgba(45,41,38,0.4)" }}>
          {new Date(order.created_at).toLocaleString("en-IN")} · {order.order_items?.length ?? 0} item(s)
          {order.payment_id ? ` · ${order.payment_id}` : ""}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-bold text-sm" style={{ color: "var(--color-midnight)", fontFamily: "var(--font-body)" }}>
          {formatPrice(Number(order.total))}
        </span>
        <StatusSelect value={status} options={STATUSES} disabled={pending} onChange={onChange} />
      </div>
    </div>
  );
}

export function StatusSelect<T extends string>({
  value, options, disabled, onChange,
}: { value: T; options: T[]; disabled?: boolean; onChange: (v: T) => void }) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as T)}
      className="text-xs font-semibold rounded-lg px-3 py-2 capitalize cursor-pointer disabled:opacity-50"
      style={{ background: "var(--color-parchment)", border: "1.5px solid rgba(209,168,110,0.3)", color: "var(--color-midnight)", fontFamily: "var(--font-body)" }}
    >
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}

export function Empty({ label }: { label: string }) {
  return (
    <div className="text-center py-16 rounded-xl" style={{ background: "var(--color-ivory)", border: "1px dashed rgba(209,168,110,0.3)" }}>
      <p className="text-sm" style={{ color: "rgba(45,41,38,0.5)", fontFamily: "var(--font-body)" }}>{label}</p>
    </div>
  );
}
