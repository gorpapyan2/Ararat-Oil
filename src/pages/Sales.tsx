
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { SalesManager } from "@/components/sales/SalesManager";

const Sales = () => {
  return (
    <div className="container mx-auto py-6 space-y-6 max-w-7xl">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Sales</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-medium">Sales Management</CardTitle>
          <CardDescription>View and manage fuel sales records</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <SalesManager />
        </CardContent>
      </Card>
    </div>
  );
};

export default Sales;
