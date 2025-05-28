import React from "react";
import { ButtonShowcase } from "@/core/components/ui/ButtonShowcase";
import { PageLayout } from "@/layouts/PageLayout";

/**
 * Page for displaying all button variants and button components
 */
export default function ButtonComponentsPage() {
  return (
    <PageLayout
      titleKey="Button Components"
      descriptionKey="A showcase of all button variants and specialized button components"
    >
      <div className="container mx-auto py-6">
        <ButtonShowcase />

        <div className="mt-8 p-6 bg-muted rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Usage Guidelines</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Base Button</h3>
              <p className="text-sm text-muted-foreground">
                Use the base Button component for most actions. Choose the
                appropriate variant based on the action's importance.
              </p>
              <pre className="mt-2 p-4 bg-card text-sm rounded-md overflow-x-auto">
                {`import { Button } from "@/core/components/ui/button";

// Basic usage
<Button>Click Me</Button>

// With variant and size
<Button variant="secondary" size="sm">Small Button</Button>

// With icons
<Button startIcon={<PlusIcon />}>Add Item</Button>
<Button endIcon={<ArrowRightIcon />}>Next Step</Button>

// Loading state
<Button isLoading>Processing</Button>
<Button isLoading loadingText="Saving...">Save</Button>`}
              </pre>
            </div>

            <div>
              <h3 className="font-medium">Specialized Buttons</h3>
              <p className="text-sm text-muted-foreground">
                Use specialized button components for common patterns to ensure
                consistency across the application.
              </p>
              <pre className="mt-2 p-4 bg-card text-sm rounded-md overflow-x-auto">
                {`// Icon Button
<IconButton 
  icon={<SearchIcon />}
  ariaLabel="Search"
  variant="ghost"
/>

// Create Button
<CreateButton />
<CreateButton label="Add User" />

// Loading Button (automatically handles loading state)
<LoadingButton onClick={async () => {
  await someAsyncOperation();
}}>
  Save Data
</LoadingButton>

// Action Button (with confirmation)
<ActionButton 
  isDestructive 
  onClick={handleDelete}
>
  Delete Item
</ActionButton>

// Button Link (anchor styled as button)
<ButtonLink 
  href="/documentation" 
  variant="secondary"
>
  View Docs
</ButtonLink>`}
              </pre>
            </div>

            <div>
              <h3 className="font-medium">Button Groups</h3>
              <p className="text-sm text-muted-foreground">
                Use button groups to organize related actions and create
                toolbars.
              </p>
              <pre className="mt-2 p-4 bg-card text-sm rounded-md overflow-x-auto">
                {`// Standard Button Group
<ButtonGroup>
  <Button variant="outline">Copy</Button>
  <Button variant="outline">Paste</Button>
  <Button variant="outline">Cut</Button>
</ButtonGroup>

// Attached Buttons (no gap between them)
<ButtonGroup attached>
  <Button variant="outline">Previous</Button>
  <Button variant="outline">Current</Button>
  <Button variant="outline">Next</Button>
</ButtonGroup>

// Vertical Button Group
<ButtonGroup orientation="vertical" attached>
  <Button variant="outline">Top</Button>
  <Button variant="outline">Middle</Button>
  <Button variant="outline">Bottom</Button>
</ButtonGroup>

// Button Group with Icon Buttons
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
</ButtonGroup>`}
              </pre>
            </div>

            <div>
              <h3 className="font-medium">Toggle Buttons</h3>
              <p className="text-sm text-muted-foreground">
                Use toggle buttons for binary states or option selection. They
                can be used individually or in groups.
              </p>
              <pre className="mt-2 p-4 bg-card text-sm rounded-md overflow-x-auto">
                {`// Single Toggle Button
<ToggleButton 
  isActive={isActive}
  onToggle={(newState) => setIsActive(newState)}
>
  Toggle me
</ToggleButton>

// Toggle Button Group (single selection)
<ToggleButtonGroup 
  value={alignment} 
  onChange={(value) => setAlignment(value)}
>
  <ToggleButton value="left">
    <AlignLeftIcon className="h-4 w-4" />
  </ToggleButton>
  <ToggleButton value="center">
    <AlignCenterIcon className="h-4 w-4" />
  </ToggleButton>
  <ToggleButton value="right">
    <AlignRightIcon className="h-4 w-4" />
  </ToggleButton>
</ToggleButtonGroup>

// Toggle Button Group (multiple selection)
<ToggleButtonGroup 
  multiple
  value={formats} 
  onChange={(value) => setFormats(value)}
>
  <ToggleButton value="bold">
    <BoldIcon className="h-4 w-4" />
  </ToggleButton>
  <ToggleButton value="italic">
    <ItalicIcon className="h-4 w-4" />
  </ToggleButton>
</ToggleButtonGroup>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
