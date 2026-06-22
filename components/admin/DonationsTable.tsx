"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/utils";
import { updateDonation } from "@/app/admin/actions";
import { StatusSelect, Empty } from "@/components/admin/OrdersTable";
import type { Donation, DonationStatus } from "@/lib/supabase/types";

const STATUSES: DonationStatus[] = ["pledged", "purchased", "delivered"];

type DonationItem = { name: string; quantity: number; cost: number };

export function DonationsTable({ donations }: { donations: Donation[] }) {
  if (donations.length === 0) return <Empty label="No donations yet." />;
  return (
    <div className="flex flex-col gap-3">
      {donations.map((d) => (
        <DonationCard key={d.id} donation={d} />
      ))}
    </div>
  );
}

function DonationCard({ donation }: { donation: Donation }) {
  const [status, setStatus] = useState<DonationStatus>(donation.status);
  const [proof, setProof] = useState(donation.proof_photo_url ?? "");
  const [pending, start] = useTransition();
  const items = (donation.items ?? []) as DonationItem[];

  const setStatusValue = (next: DonationStatus) => {
    const prev = status;
    setStatus(next);
    start(async () => {
      const res = await updateDonation(donation.id, { status: next });
      if (!res.ok) { setStatus(prev); toast.error(res.error || "Update failed"); }
      else toast.success(`Marked ${next}`);
    });
  };

  const saveProof = () => {
    start(async () => {
      const res = await updateDonation(donation.id, { proof_photo_url: proof || null });
      if (!res.ok) toast.error(res.error || "Update failed");
      else toast.success("Proof photo saved");
    });
  };

  return (
    <div className="p-4 rounded-xl flex flex-col gap-3"
      style={{ background: "var(--color-ivory)", border: "1px solid rgba(209,168,110,0.2)" }}>
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1" style={{ fontFamily: "var(--font-body)" }}>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm" style={{ color: "var(--color-midnight)" }}>{donation.donation_number}</span>
            <span className="text-xs" style={{ color: "var(--color-gold-dark)" }}>{donation.donor_name || "Anonymous"}</span>
          </div>
          <p className="text-xs mt-1" style={{ color: "rgba(45,41,38,0.55)" }}>
            {items.map((i) => `${i.name} ×${i.quantity}`).join(", ") || "—"}
          </p>
          <p className="text-[11px] mt-0.5" style={{ color: "rgba(45,41,38,0.4)" }}>
            {new Date(donation.created_at).toLocaleString("en-IN")}
            {donation.total ? ` · ${formatPrice(Number(donation.total))}` : ""}
          </p>
        </div>
        <StatusSelect value={status} options={STATUSES} disabled={pending} onChange={setStatusValue} />
      </div>
      <div className="flex gap-2">
        <input
          value={proof}
          onChange={(e) => setProof(e.target.value)}
          placeholder="Proof photo URL (upload to proof-photos bucket)…"
          className="flex-1 text-xs rounded-lg px-3 py-2"
          style={{ background: "var(--color-parchment)", border: "1px solid rgba(209,168,110,0.25)", color: "var(--color-midnight)", fontFamily: "var(--font-body)" }}
        />
        <button onClick={saveProof} disabled={pending} className="btn-gold text-xs px-4 py-2 disabled:opacity-50">Save proof</button>
      </div>
    </div>
  );
}
