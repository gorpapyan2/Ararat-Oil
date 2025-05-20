import React, { useState } from 'react';
import { Button } from '@/core/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/core/components/ui/avatar';
import { Checkbox } from '@/core/components/ui/checkbox';
import { Switch } from '@/core/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/core/components/ui/radio-group';
import { Skeleton } from '@/core/components/ui/skeleton';
import { Progress } from '@/core/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/core/components/ui/tooltip';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/core/components/ui/card';
import { DatePicker } from '@/core/components/ui/datepicker';
import { DateRangePicker } from '@/core/components/ui/daterangepicker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/components/ui/tabs';
import { Input } from '@/core/components/ui/input';
import { Label } from '@/core/components/ui/label';
import { Badge } from '@/core/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/core/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/core/components/ui/table';
import { Textarea } from '@/core/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/core/components/ui/alert';
import { addDays } from 'date-fns';

// Define the date range type to match what DateRangePicker expects
type DateRangeType = { from: Date; to?: Date } | undefined;

const ComponentShowcase = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dateRange, setDateRange] = useState<DateRangeType>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  const [progress, setProgress] = useState(45);

  // Handler function for date range changes
  const handleDateRangeChange = (range: DateRangeType) => {
    setDateRange(range);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Component Showcase</h1>
      <p className="text-muted-foreground mb-8">
        This page showcases our new migrated component system. All components have been migrated to the primitives architecture, 
        with proper re-export files to maintain backward compatibility.
      </p>
      
      <Tabs defaultValue="basics" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="basics">Basic UI</TabsTrigger>
          <TabsTrigger value="data">Data Display</TabsTrigger>
          <TabsTrigger value="inputs">Input Components</TabsTrigger>
          <TabsTrigger value="layout">Layout Components</TabsTrigger>
          <TabsTrigger value="feedback">Feedback & Status</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basics">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
            <div className="flex flex-wrap gap-4">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button size="sm">Small</Button>
              <Button size="lg">Large</Button>
              <Button disabled>Disabled</Button>
            </div>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Badges</h2>
            <div className="flex flex-wrap gap-4">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Avatars</h2>
            <div className="flex flex-wrap gap-4">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">AO</AvatarFallback>
              </Avatar>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Tooltips</h2>
            <div className="flex flex-wrap gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">Hover me</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add to cart</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">Another tooltip</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This is a helpful tip</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </section>
        </TabsContent>
        
        <TabsContent value="data">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Card Title</CardTitle>
                  <CardDescription>Card Description</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Card Content</p>
                </CardContent>
                <CardFooter>
                  <p>Card Footer</p>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Account Summary</CardTitle>
                  <CardDescription>Overview of your account status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Balance:</span>
                      <span className="font-bold">$1,250.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pending:</span>
                      <span className="font-bold">$120.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Available:</span>
                      <span className="font-bold">$1,130.00</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Cancel</Button>
                  <Button>View Details</Button>
                </CardFooter>
              </Card>
            </div>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Accordion</h2>
            <Accordion type="single" collapsible className="w-full max-w-lg">
              <AccordionItem value="item-1">
                <AccordionTrigger>Is this a primitives-based component?</AccordionTrigger>
                <AccordionContent>
                  Yes. All components have been migrated to the new primitives architecture.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Are the components type-safe?</AccordionTrigger>
                <AccordionContent>
                  Yes. All components are built with TypeScript and have proper type definitions.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Do we maintain backward compatibility?</AccordionTrigger>
                <AccordionContent>
                  Yes. Re-export files ensure that existing imports continue to work.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Table</h2>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">John Doe</TableCell>
                    <TableCell><Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge></TableCell>
                    <TableCell>Developer</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Jane Smith</TableCell>
                    <TableCell><Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge></TableCell>
                    <TableCell>Designer</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Robert Johnson</TableCell>
                    <TableCell><Badge variant="outline" className="bg-red-100 text-red-800">Inactive</Badge></TableCell>
                    <TableCell>Manager</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </section>
        </TabsContent>
        
        <TabsContent value="inputs">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Text Inputs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="default">Default Input</Label>
                  <Input id="default" placeholder="Enter text here" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="disabled">Disabled Input</Label>
                  <Input id="disabled" placeholder="Disabled" disabled />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="with-icon">Input with Icon</Label>
                  <div className="relative">
                    <Input id="with-icon" placeholder="Search..." className="pl-8" />
                    <span className="absolute left-2.5 top-2.5 text-muted-foreground">🔍</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="error">Input with Error</Label>
                  <Input id="error" placeholder="Invalid input" className="border-red-500" />
                  <p className="text-xs text-red-500">This field is required</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Textarea</h2>
            <div className="max-w-2xl">
              <div className="space-y-2">
                <Label htmlFor="textarea">Message</Label>
                <Textarea id="textarea" placeholder="Type your message here" className="min-h-[120px]" />
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Checkbox & Radio</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms">Accept terms and conditions</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="newsletter" defaultChecked />
                  <Label htmlFor="newsletter">Subscribe to newsletter</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="disabled" disabled />
                  <Label htmlFor="disabled" className="text-muted-foreground">Disabled option</Label>
                </div>
              </div>
              <div className="space-y-4">
                <RadioGroup defaultValue="option-one">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option-one" id="option-one" />
                    <Label htmlFor="option-one">Option One</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option-two" id="option-two" />
                    <Label htmlFor="option-two">Option Two</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option-three" id="option-three" disabled />
                    <Label htmlFor="option-three" className="text-muted-foreground">Option Three (Disabled)</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Date Components</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">DatePicker</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm mb-1">Default:</p>
                    <DatePicker date={date} onDateChange={setDate} />
                  </div>
                  <div>
                    <p className="text-sm mb-1">With Placeholder:</p>
                    <DatePicker 
                      date={undefined} 
                      onDateChange={setDate} 
                      placeholder="Select a date" 
                    />
                  </div>
                  <div>
                    <p className="text-sm mb-1">Disabled:</p>
                    <DatePicker 
                      date={date} 
                      onDateChange={setDate} 
                      disabled={true} 
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">DateRangePicker</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm mb-1">Default:</p>
                    <DateRangePicker 
                      dateRange={dateRange} 
                      onDateRangeChange={handleDateRangeChange} 
                    />
                  </div>
                  <div>
                    <p className="text-sm mb-1">With Placeholder:</p>
                    <DateRangePicker 
                      dateRange={undefined} 
                      onDateRangeChange={handleDateRangeChange}  
                      placeholder="Select a date range"
                    />
                  </div>
                  <div>
                    <p className="text-sm mb-1">Disabled:</p>
                    <DateRangePicker 
                      dateRange={dateRange} 
                      onDateRangeChange={handleDateRangeChange} 
                      disabled={true} 
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Toggle & Switch</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="airplane-mode" />
                  <Label htmlFor="airplane-mode">Airplane Mode</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="notifications" defaultChecked />
                  <Label htmlFor="notifications">Notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="disabled-switch" disabled />
                  <Label htmlFor="disabled-switch" className="text-muted-foreground">Disabled</Label>
                </div>
              </div>
            </div>
          </section>
        </TabsContent>
        
        <TabsContent value="layout">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Tabs</h2>
            <div className="max-w-2xl">
              <Tabs defaultValue="account">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="password">Password</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="account" className="p-4 border rounded-md mt-2">
                  <h3 className="text-lg font-medium">Account Settings</h3>
                  <p className="text-sm text-muted-foreground">Manage your account information and preferences.</p>
                </TabsContent>
                <TabsContent value="password" className="p-4 border rounded-md mt-2">
                  <h3 className="text-lg font-medium">Change Password</h3>
                  <p className="text-sm text-muted-foreground">Update your password and security preferences.</p>
                </TabsContent>
                <TabsContent value="settings" className="p-4 border rounded-md mt-2">
                  <h3 className="text-lg font-medium">Application Settings</h3>
                  <p className="text-sm text-muted-foreground">Customize your application preferences.</p>
                </TabsContent>
              </Tabs>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="feedback">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Alerts</h2>
            <div className="space-y-4 max-w-2xl">
              <Alert>
                <AlertTitle>Information</AlertTitle>
                <AlertDescription>
                  This is an informational alert to notify you about something important.
                </AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Something went wrong. Please try again later.
                </AlertDescription>
              </Alert>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Progress</h2>
            <div className="space-y-4 max-w-2xl">
              <div>
                <Label htmlFor="progress">Progress: {progress}%</Label>
                <Progress value={progress} className="mt-2" />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setProgress(p => Math.max(0, p - 10))}
                >
                  Decrease
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setProgress(p => Math.min(100, p + 10))}
                >
                  Increase
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setProgress(0)}
                >
                  Reset
                </Button>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Skeleton</h2>
            <div className="space-y-4 max-w-2xl">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[300px]" />
              </div>
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[160px]" />
                </div>
              </div>
            </div>
          </section>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 border-t pt-8">
        <h2 className="text-2xl font-semibold mb-4">Migration Status</h2>
        <p className="mb-4">
          All 57 components have been successfully migrated to the new primitives architecture. 
          This includes creating 15 new re-export files and updating 25 existing ones.
        </p>
        <Button onClick={() => window.location.href = "/docs/refactoring/completion-summary.md"} variant="outline">
          View Complete Migration Report
        </Button>
      </div>
    </div>
  );
};

export default ComponentShowcase; 