"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { deleteURL } from "@/lib/utils";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type URLType = {
  id: string;
  original_url: string;
  short_slug: string;
  clicks: number;
  qr_code: string;
  active: "True" | "False";
  edit: React.ReactElement<any, any>;
};

export const columns: ColumnDef<URLType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "original_url",
    header: "Original URL",
  },
  {
    accessorKey: "short_slug",
    header: "Short Slug",
  },
  {
    accessorKey: "clicks",
    header: "Clicks",
  },
  {
    accessorKey: "qr_code",
    header: "QR Code",
  },
  {
    accessorKey: "is_active",
    header: "Active",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const { id } = row.original;
      return (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button>Edit</Button>
          <Button onClick={() => deleteURL(id)}>Delete</Button>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
