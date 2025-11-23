"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getBooks } from "@/services/book";
import { BookItem } from "@/types/book";

export const columns: ColumnDef<BookItem>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  { 
    accessorKey: "_id", 
    header: "ID",
    cell: ({ row }) => <div className="truncate max-w-[100px]">{row.getValue("_id")}</div>
  },
  { accessorKey: "title", header: "Title" },
  { accessorKey: "author", header: "Author" },
  { accessorKey: "category", header: "Category" },
  { accessorKey: "condition", header: "Condition" },
  { 
    accessorKey: "price", 
    header: "Price (Rs)",
    cell: ({ row }) => {
      const price = row.getValue("price");
      return `Rs ${Number(price).toLocaleString()}`;
    }
  },

  {
    accessorKey: "location",
    header: "Coordinates",
    cell: ({ row }) => {
      const location = row.original.location;
      return location?.coordinates 
        ? `${location.coordinates[0]}, ${location.coordinates[1]}`
        : "No Location";
    },
  },

{
  accessorKey: "owner",
  header: "Owner",
  cell: ({ row }) => {
    const owner = row.original.owner;
    // Handle different possible owner structures
    if (typeof owner === 'string') {
      return owner;
    } else if (owner && typeof owner === 'object') {
      return (owner as any)?.name || (owner as any)?.email || "No Owner";
    }
    return "No Owner";
  },
},

  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const imageUrl = row.getValue("image");
      const title = row.getValue("title");
      return imageUrl ? (
        <img
          src={imageUrl as string}
          alt={title as string}
          className="h-12 w-12 rounded-md object-cover"
        />
      ) : (
        "No Image"
      );
    },
  },

  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate">{row.getValue("description") as string}</div>
    ),
  },

  {
    accessorKey: "available",
    header: "Available",
    cell: ({ row }) => (row.getValue("available") ? "Yes" : "No"),
  },

  {
    accessorKey: "isApproved",
    header: "Approved",
    cell: ({ row }) => (row.getValue("isApproved") ? "Yes" : "No"),
  },

  { accessorKey: "approvalStatus", header: "Approval Status" },
  { 
    accessorKey: "approvedBy", 
    header: "Approved By",
    cell: ({ row }) => row.getValue("approvedBy") || "N/A"
  },

  {
    accessorKey: "approvedAt",
    header: "Approved At",
    cell: ({ row }) => {
      const approvedAt = row.getValue("approvedAt");
      return approvedAt ? new Date(approvedAt as string).toLocaleString() : "N/A";
    },
  },

  {
    accessorKey: "rejectionReason",
    header: "Rejection Reason",
    cell: ({ row }) => row.getValue("rejectionReason") || "N/A"
  },

  {
    accessorKey: "isFeatured",
    header: "Featured",
    cell: ({ row }) => (row.getValue("isFeatured") ? "Yes" : "No"),
  },

  { accessorKey: "views", header: "Views" },

  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt");
      return createdAt ? new Date(createdAt as string).toLocaleString() : "N/A";
    },
  },

  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => {
      const updatedAt = row.getValue("updatedAt");
      return updatedAt ? new Date(updatedAt as string).toLocaleString() : "N/A";
    },
  },
];

export default function BookListView() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState<BookItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const books = await getBooks();
      console.log("Raw books data:", books);
      
      // Ensure we have an array and handle nested response
      let booksArray: BookItem[] = [];
      
      if (Array.isArray(books)) {
        booksArray = books;
      } else if (books && typeof books === 'object') {
        // Handle nested response structure
        booksArray = books.data || books.books || [];
      }
      
      console.log("Processed books array:", booksArray);
      console.log("First book owner:", booksArray[0]?.owner);
      
      setData(booksArray);
    } catch (error) {
      console.error("Error fetching books:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  });

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading books...</div>;
  }

  return (
    <div className="w-full">
      {/* Search bar */}
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter titles..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("title")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((col) => col.getCanHide())
              .map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  checked={col.getIsVisible()}
                  onCheckedChange={(value) => col.toggleVisibility(!!value)}
                  className="capitalize"
                >
                  {col.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No books found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} selected.
        </div>

        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}