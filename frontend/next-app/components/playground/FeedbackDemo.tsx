"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Drawer } from "@/components/ui/Drawer";
import { Dropdown } from "@/components/ui/Dropdown";
import { IconButton } from "@/components/ui/IconButton";
import { useToast } from "@/components/ui/Toast";

export default function FeedbackDemo() {
  const [drawerSide, setDrawerSide] = useState<"right" | "bottom" | null>(null);
  const { toast } = useToast();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-4">
        <Dropdown
          trigger={
            <IconButton label="Book actions" variant="secondary">
              <MoreHorizontal className="size-5" />
            </IconButton>
          }
          items={[
            {
              label: "Edit book",
              icon: <Pencil className="size-4" />,
              onSelect: () => toast({ title: "Opening editor" }),
            },
            { label: "Archive", disabled: true, onSelect: () => {} },
            {
              label: "Delete",
              danger: true,
              icon: <Trash2 className="size-4" />,
              onSelect: () =>
                toast({ title: "Book deleted", variant: "error" }),
            },
          ]}
        />

        <Button variant="secondary" onClick={() => setDrawerSide("right")}>
          Drawer (right)
        </Button>
        <Button variant="secondary" onClick={() => setDrawerSide("bottom")}>
          Drawer (bottom sheet)
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button
          onClick={() =>
            toast({
              title: "Purchase complete",
              description: "Your book is now in your library.",
              variant: "success",
            })
          }
        >
          Success toast
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            toast({
              title: "Upload failed",
              description: "The file could not be processed.",
              variant: "error",
            })
          }
        >
          Error toast
        </Button>
        <Button
          variant="secondary"
          onClick={() => toast({ title: "Saved as draft" })}
        >
          Info toast
        </Button>
      </div>

      <Drawer
        open={drawerSide !== null}
        onOpenChange={(o) => !o && setDrawerSide(null)}
        side={drawerSide ?? "right"}
        title="Filters"
        description="Narrow down the books you see."
        footer={
          <>
            <Button variant="secondary" onClick={() => setDrawerSide(null)}>
              Clear
            </Button>
            <Button className="flex-1" onClick={() => setDrawerSide(null)}>
              Show results
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Checkbox label="Free" />
          <Checkbox label="English" />
          <Checkbox label="Khmer" />
          <Checkbox label="EPUB" />
          <Checkbox label="PDF" />
        </div>
      </Drawer>
    </div>
  );
}