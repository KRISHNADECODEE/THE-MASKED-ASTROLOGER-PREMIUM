"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/utils";
import { updateBooking } from "@/app/admin/actions";
import { StatusSelect, Empty } from "@/components/admin/OrdersTable";
import type { Booking, BookingStatus } from "@/lib/supabase/types";

const STATUSES: BookingStatus[] = ["pending", "scheduled", "completed", "cancelled"];

export function BookingsTable({ bookings }: { bookings: Booking[] }) {
  if (bookings.length === 0) return <Empty label="No consultations booked yet." />;
  return (
    <div className="flex flex-col gap-3">
      {bookings.map((b) => (
        <BookingCard key={b.id} booking={b} />
      ))}
    </div>
  );
}

function BookingCard({ booking }: { booking: Booking }) {
  const [status, setStatus] = useState<BookingStatus>(booking.status);
  const [zoom, setZoom] = useState(booking.zoom_link ?? "");
  const [pending, start] = useTransition();

  const setStatusValue = (next: BookingStatus) => {
    const prev = status;
    setStatus(next);
    start(async () => {
      const res = await updateBooking(booking.id, { status: next });
      if (!res.ok) { setStatus(prev); toast.error(res.error || "Update failed"); }
      else toast.success(`Marked ${next}`);
    });
  };

  const saveZoom = () => {
    start(async () => {
      const res = await updateBooking(booking.id, { zoom_link: zoom || null });
      if (!res.ok) toast.error(res.error || "Update failed");
      else toast.success("Meeting link saved");
    });
  };

  return (
    <div className="p-4 rounded-xl flex flex-col gap-3"
      style={{ background: "var(--color-ivory)", border: "1px solid rgba(209,168,110,0.2)" }}>
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1" style={{ fontFamily: "var(--font-body)" }}>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm" style={{ color: "var(--color-midnight)" }}>{booking.booking_number}</span>
            <span className="text-xs" style={{ color: "var(--color-gold-dark)" }}>{booking.service_title || booking.service_id}</span>
          </div>
          <p className="text-xs mt-1" style={{ color: "rgba(45,41,38,0.55)" }}>
            {booking.name} · {booking.email}{booking.phone ? ` · ${booking.phone}` : ""}
          </p>
          <p className="text-[11px] mt-0.5" style={{ color: "rgba(45,41,38,0.4)" }}>
            Slot: {booking.slot_date} · {booking.slot_time}{booking.amount ? ` · ${formatPrice(Number(booking.amount))}` : ""}
          </p>
        </div>
        <StatusSelect value={status} options={STATUSES} disabled={pending} onChange={setStatusValue} />
      </div>
      <div className="flex gap-2">
        <input
          value={zoom}
          onChange={(e) => setZoom(e.target.value)}
          placeholder="Paste Zoom / Meet link…"
          className="flex-1 text-xs rounded-lg px-3 py-2"
          style={{ background: "var(--color-parchment)", border: "1px solid rgba(209,168,110,0.25)", color: "var(--color-midnight)", fontFamily: "var(--font-body)" }}
        />
        <button onClick={saveZoom} disabled={pending} className="btn-gold text-xs px-4 py-2 disabled:opacity-50">Save link</button>
      </div>
    </div>
  );
}
