import type { AuditEntry } from "@/types/admin";

export const ACTION_LABEL: Record<string, string> = {
  "book.approve": "approved a book",
  "book.reject": "rejected a book",
  "book.request_changes": "requested changes to a book",
  "book.unpublish": "unpublished a book",
  "user.suspend": "suspended a user",
  "user.reactivate": "reactivated a user",
  "user.role": "changed a user's role",
  "category.create": "created a category",
  "category.rename": "renamed a category",
  "category.delete": "deleted a category",
  "category.reorder": "reordered categories",
  "report.resolve": "resolved a report",
  "report.dismiss": "dismissed a report",
};

export function actionLabel(action: string): string {
  return ACTION_LABEL[action] ?? action;
}

export const TARGET_LABEL: Record<AuditEntry["targetType"], string> = {
  book: "Books",
  user: "Users",
  category: "Categories",
  report: "Reports",
};