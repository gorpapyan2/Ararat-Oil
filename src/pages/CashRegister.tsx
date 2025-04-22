
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
import { CashRegisterPanel } from "@/components/CashRegisterPanel";
import { ShiftHistory } from "@/components/cash-register/ShiftHistory";
import { ActiveShiftDetails } from "@/components/cash-register/ActiveShiftDetails";
import { useShift } from "@/hooks/useShift";

const CashRegister = () => {
  const { activeShift } = useShift();

  return (
    <div className="container mx-auto py-6 space-y-6 max-w-7xl">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Cash Register</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="border-none shadow-sm h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-medium">Cash Register</CardTitle>
              <CardDescription>Manage your cash register shifts</CardDescription>
            </CardHeader>
            <CardContent>
              <CashRegisterPanel />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          {activeShift ? (
            <ActiveShiftDetails shift={activeShift} />
          ) : (
            <ShiftHistory />
          )}
        </div>
      </div>
    </div>
  );
};

export default CashRegister;
