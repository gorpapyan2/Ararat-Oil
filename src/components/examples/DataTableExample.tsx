import React, { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/useToast";
import { useTranslation } from "react-i18next";

// Sample data type
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "pending";
  lastActive: string;
}

// Generate sample data
const generateUsers = (count: number): User[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `user-${i + 1}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: i % 5 === 0 ? "Admin" : i % 3 === 0 ? "Editor" : "User",
    status: i % 4 === 0 ? "inactive" : i % 7 === 0 ? "pending" : "active",
    lastActive: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
  }));
};

export default function DataTableExample() {
  const { t } = useTranslation();
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<User[]>(generateUsers(25));

  // Handle row click
  const handleRowClick = (user: User) => {
    success({
      title: "User Selected",
      description: `You clicked on ${user.name}`,
    });
  };

  // Handle export
  const handleExport = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      success({
        title: "Export Complete",
        description: "Data has been exported successfully",
      });
    }, 1500);
  };

  // Define columns
  const columns = [
    {
      id: "name",
      header: t("common.name"),
      accessorKey: "name",
      cell: ({ row }: any) => <div className="font-medium">{row.original.name}</div>,
    },
    {
      id: "email",
      header: t("common.email"),
      accessorKey: "email",
    },
    {
      id: "role",
      header: t("common.role"),
      accessorKey: "role",
      cell: ({ row }: any) => (
        <Badge variant={row.original.role === "Admin" ? "default" : "outline"}>
          {row.original.role}
        </Badge>
      ),
    },
    {
      id: "status",
      header: t("common.status"),
      accessorKey: "status",
      cell: ({ row }: any) => {
        const status = row.original.status;
        return (
          <Badge
            variant={
              status === "active" 
                ? "default" 
                : status === "pending" 
                  ? "warning" 
                  : "destructive"
            }
            className={
              status === "active" 
                ? "bg-green-500 hover:bg-green-600" 
                : status === "pending" 
                  ? "bg-yellow-500 hover:bg-yellow-600" 
                  : ""
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      id: "lastActive",
      header: t("common.lastActive"),
      accessorKey: "lastActive",
      cell: ({ row }: any) => {
        const date = new Date(row.original.lastActive);
        return <span>{date.toLocaleDateString()}</span>;
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }: any) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  handleRowClick(row.original);
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  success({
                    title: "User Edited",
                    description: `You're editing ${row.original.name}`,
                  });
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  error({
                    title: "User Deleted",
                    description: `${row.original.name} has been deleted`,
                  });
                  setData(data.filter(user => user.id !== row.original.id));
                }}
                className="text-destructive"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  // Custom renderer for mobile cards
  const mobileCardRenderer = (user: User) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-medium">{user.name}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <Badge
            variant={
              user.status === "active" 
                ? "default" 
                : user.status === "pending" 
                  ? "secondary" 
                  : "destructive"
            }
            className={
              user.status === "active" 
                ? "bg-green-500 hover:bg-green-600" 
                : user.status === "pending" 
                  ? "bg-yellow-500 hover:bg-yellow-600" 
                  : ""
            }
          >
            {user.status}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
          <div>
            <span className="text-muted-foreground">Role:</span>
            <Badge variant={user.role === "Admin" ? "default" : "outline"} className="ml-2">
              {user.role}
            </Badge>
          </div>
          <div>
            <span className="text-muted-foreground">Last Active:</span>
            <span className="ml-2">{new Date(user.lastActive).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="flex justify-end mt-2">
          <Button variant="outline" size="sm" className="h-7 px-2" onClick={() => handleRowClick(user)}>
            <Eye className="h-3.5 w-3.5 mr-1" />
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DataTable
      data={data}
      columns={columns}
      title="Users"
      subtitle="Manage your system users"
      mobileCardRenderer={mobileCardRenderer}
      isLoading={loading}
      onRowClick={handleRowClick}
      onExport={handleExport}
      enableExport={true}
      initialSorting={[{ id: "name", desc: false }]}
    />
  );
} 