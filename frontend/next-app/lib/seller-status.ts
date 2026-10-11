import type { SellerBookStatus } from "@/types/seller";
import type { BadgeVariant } from "@/components/ui/Badge";
import type { SellerOrderStatus } from "@/types/seller";

export const STATUS_LABEL: Record<SellerBookStatus, string> = {
  published: "Published",
  pending: "In review",
  draft: "Draft",
  rejected: "Rejected",
  archived: "Archived",
};

export const STATUS_ORDER: SellerBookStatus[] = [
  "published",
  "pending",
  "rejected",
  "draft",
  "archived",
];

export const ORDER_STATUS_LABEL: Record<SellerOrderStatus, string> = {
  paid: "Paid",
  pending: "Pending",
  failed: "Failed",
  refunded: "Refunded",
};

export const ORDER_STATUS_BADGE: Record<SellerOrderStatus, BadgeVariant> = {
  paid: "published",
  pending: "pending",
  failed: "rejected",
  refunded: "archived",
};