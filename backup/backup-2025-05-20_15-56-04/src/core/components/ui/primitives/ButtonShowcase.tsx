import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/core/components/ui/primitives/card";
import { Button, ButtonLink, buttonVariants } from "@/core/components/ui/primitives/button";
import { IconButton } from '@/core/components/ui/icon-button';
import { CreateButton } from '@/core/components/ui/create-button';
import { LoadingButton } from '@/core/components/ui/loading-button';
import { ActionButton } from '@/core/components/ui/action-button';
import { PlusIcon, SearchIcon, TrashIcon, DownloadIcon, PrinterIcon, Loader2Icon, InfoIcon, BoldIcon, ItalicIcon, UnderlineIcon, AlignLeftIcon, AlignCenterIcon, AlignRightIcon, AlignJustifyIcon, ListIcon, ColumnsIcon } from "lucide-react";
import { ToggleButton } from '@/core/components/ui/toggle-button';
import { ToggleButtonGroup } from '@/core/components/ui/toggle-button-group';
import { ButtonGroup } from '@/core/components/ui/button-group';

export function ButtonShowcase() {
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  const handleAsyncClick = async () => {
    await sleep(2000);
  };
  
  const [singleValue, setSingleValue] = React.useState<string>("center");
  const [multipleValues, setMultipleValues] = React.useState<string[]>(["bold"]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Button Component</CardTitle>
        <CardDescription>
          A showcase of all button variants and specialized button components.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Base Button Variants */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Button Variants</h3>
          <div className="flex flex-wrap gap-4">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="accent">Accent</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
          <p className="text-sm text-muted-foreground">
            <strong>Default:</strong> Primary action. <strong>Secondary:</strong> Secondary action. <strong>Accent:</strong> Highlight action. 
            <strong>Outline:</strong> Less prominent action. <strong>Ghost:</strong> Minimal emphasis. <strong>Link:</strong> Hyperlink style.
            <strong>Destructive:</strong> Dangerous action.
          </p>
        </div>

        {/* Button Sizes */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Button Sizes</h3>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon"><PlusIcon className="h-4 w-4" /></Button>
          </div>
        </div>

        {/* Buttons with Icons */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Buttons with Icons</h3>
          <div className="flex flex-wrap gap-4">
            <Button startIcon={<PlusIcon className="h-4 w-4" />}>
              Add New
            </Button>
            <Button endIcon={<DownloadIcon className="h-4 w-4" />}>
              Download
            </Button>
            <Button 
              variant="outline" 
              startIcon={<SearchIcon className="h-4 w-4" />}
              endIcon={<InfoIcon className="h-4 w-4" />}
            >
              Search with Info
            </Button>
          </div>
        </div>

        {/* Loading Buttons */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Loading States</h3>
          <div className="flex flex-wrap gap-4">
            <Button isLoading>Loading</Button>
            <Button isLoading loadingText="Processing...">Submit</Button>
            <LoadingButton onClick={handleAsyncClick}>
              Click to Load (2s)
            </LoadingButton>
            <LoadingButton 
              variant="outline"
              onClick={handleAsyncClick}
              loadingText="Downloading..."
            >
              Download File
            </LoadingButton>
          </div>
        </div>

        {/* Specialized Buttons */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Specialized Button Components</h3>
          <div className="flex flex-wrap gap-4">
            <IconButton 
              icon={<SearchIcon className="h-4 w-4" />}
              ariaLabel="Search"
            />
            <IconButton 
              icon={<TrashIcon className="h-4 w-4" />}
              ariaLabel="Delete"
              variant="destructive"
            />
            <CreateButton />
            <CreateButton label="Add User" />
            <ActionButton isDestructive>Delete Item</ActionButton>
            <ButtonLink href="#" variant="secondary" startIcon={<InfoIcon className="h-4 w-4" />}>
              Documentation
            </ButtonLink>
          </div>
        </div>

        {/* Button Groups */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Button Groups</h3>
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Standard Button Group:</p>
              <ButtonGroup>
                <Button variant="outline">Copy</Button>
                <Button variant="outline">Paste</Button>
                <Button variant="outline">Cut</Button>
              </ButtonGroup>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-2">Attached Buttons:</p>
              <ButtonGroup attached>
                <Button variant="outline" startIcon={<PlusIcon className="h-4 w-4" />}>
                  Add
                </Button>
                <Button variant="outline" startIcon={<TrashIcon className="h-4 w-4" />}>
                  Remove
                </Button>
                <Button variant="outline" startIcon={<PrinterIcon className="h-4 w-4" />}>
                  Print
                </Button>
              </ButtonGroup>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-2">Vertical Button Group:</p>
              <ButtonGroup orientation="vertical" attached>
                <Button variant="outline">Top</Button>
                <Button variant="outline">Middle</Button>
                <Button variant="outline">Bottom</Button>
              </ButtonGroup>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-2">Icon Button Group:</p>
              <ButtonGroup attached size="icon">
                <IconButton 
                  icon={<AlignLeftIcon className="h-4 w-4" />} 
                  ariaLabel="Align Left"
                  variant="outline"
                />
                <IconButton 
                  icon={<AlignCenterIcon className="h-4 w-4" />} 
                  ariaLabel="Align Center"
                  variant="outline"
                />
                <IconButton 
                  icon={<AlignRightIcon className="h-4 w-4" />} 
                  ariaLabel="Align Right"
                  variant="outline"
                />
              </ButtonGroup>
            </div>
          </div>
        </div>

        {/* Disabled States */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Disabled States</h3>
          <div className="flex flex-wrap gap-4">
            <Button disabled>Disabled</Button>
            <Button disabled variant="secondary">Disabled</Button>
            <Button disabled variant="destructive">Disabled</Button>
            <IconButton 
              disabled
              icon={<PrinterIcon className="h-4 w-4" />}
              ariaLabel="Print"
            />
          </div>
        </div>

        {/* Toggle Buttons */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Toggle Buttons</h3>
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Single Toggle Button:</p>
              <ToggleButton isActive={true}>
                Selected
              </ToggleButton>
              <span className="mx-2" />
              <ToggleButton isActive={false}>
                Not Selected
              </ToggleButton>
              <span className="mx-2" />
              <ToggleButton 
                isActive={true} 
                activeVariant="accent"
                inactiveVariant="ghost"
              >
                Custom Variants
              </ToggleButton>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-2">Single Selection Group:</p>
              <ToggleButtonGroup 
                value={singleValue} 
                onChange={(value) => setSingleValue(value as string)}
                className="p-1"
              >
                <ToggleButton value="left" size="sm">
                  <AlignLeftIcon className="h-4 w-4" />
                </ToggleButton>
                <ToggleButton value="center" size="sm">
                  <AlignCenterIcon className="h-4 w-4" />
                </ToggleButton>
                <ToggleButton value="right" size="sm">
                  <AlignRightIcon className="h-4 w-4" />
                </ToggleButton>
                <ToggleButton value="justify" size="sm">
                  <AlignJustifyIcon className="h-4 w-4" />
                </ToggleButton>
              </ToggleButtonGroup>
              <p className="text-xs text-muted-foreground mt-2">Selected: {singleValue}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-2">Multiple Selection Group:</p>
              <ToggleButtonGroup 
                multiple 
                value={multipleValues} 
                onChange={(value) => setMultipleValues(value as string[])}
                className="p-1"
              >
                <ToggleButton value="bold" size="sm">
                  <BoldIcon className="h-4 w-4" />
                </ToggleButton>
                <ToggleButton value="italic" size="sm">
                  <ItalicIcon className="h-4 w-4" />
                </ToggleButton>
                <ToggleButton value="underline" size="sm">
                  <UnderlineIcon className="h-4 w-4" />
                </ToggleButton>
              </ToggleButtonGroup>
              <p className="text-xs text-muted-foreground mt-2">Selected: {multipleValues.join(', ')}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
