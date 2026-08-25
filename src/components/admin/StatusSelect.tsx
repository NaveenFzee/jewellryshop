"use client";

import { useTransition } from "react";
import { updateEnquiryStatus, updateCustomRequestStatus } from "@/lib/admin-actions-offers-rates";
import type { EnquiryStatus } from "@/lib/types";

const STATUS_OPTIONS: EnquiryStatus[] = ["new", "contacted", "in_progress", "converted", "closed"];

const STATUS_STYLES: Record<EnquiryStatus, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  in_progress: "bg-purple-100 text-purple-700",
  converted: "bg-emerald-100 text-emerald-700",
  closed: "bg-ink/10 text-ink/50",
};

export default function StatusSelect({
  id,
  status,
  kind,
}: {
  id: string;
  status: EnquiryStatus;
  kind: "enquiry" | "custom_request";
}) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (newStatus: EnquiryStatus) => {
    startTransition(async () => {
      if (kind === "enquiry") {
        await updateEnquiryStatus(id, newStatus);
      } else {
        await updateCustomRequestStatus(id, newStatus);
      }
    });
  };

  return (
    <select
      value={status}
      disabled={isPending}
      onChange={(e) => handleChange(e.target.value as EnquiryStatus)}
      className={`text-xs px-2.5 py-1.5 rounded-full border-0 capitalize disabled:opacity-50 ${STATUS_STYLES[status]}`}
    >
      {STATUS_OPTIONS.map((s) => (
        <option key={s} value={s}>
          {s.replace("_", " ")}
        </option>
      ))}
    </select>
  );
}
