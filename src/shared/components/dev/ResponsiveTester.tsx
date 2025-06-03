import { useState } from "react";
import { useMediaQuery } from "@/shared/hooks/useResponsive";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/primitives/input";
import { Label } from "@/core/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/core/components/ui/tabs";
import { CheckIcon, XIcon } from "lucide-react";

export function ResponsiveTester() {
  const [customQuery, setCustomQuery] = useState("");
  const [testQuery, setTestQuery] = useState("");

  const isSm = useMediaQuery("(min-width: 640px)");
  const isMd = useMediaQuery("(min-width: 768px)");
  const isLg = useMediaQuery("(min-width: 1024px)");
  const isXl = useMediaQuery("(min-width: 1280px)");
  const is2xl = useMediaQuery("(min-width: 1536px)");
  const isDark = useMediaQuery("(prefers-color-scheme: dark)");
  const isReduced = useMediaQuery("(prefers-reduced-motion)");
  const customQueryResult = useMediaQuery(testQuery || "(min-width: 0px)");
  const isCustom = testQuery ? customQueryResult : false;

  const handleTestQuery = () => {
    setTestQuery(customQuery);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Responsive Media Query Tester</h2>
      <p className="text-muted-foreground">
        This component demonstrates the useMediaQuery hook with various
        responsive breakpoints and user preferences.
      </p>

      <Tabs defaultValue="breakpoints">
        <TabsList>
          <TabsTrigger value="breakpoints">Breakpoints</TabsTrigger>
          <TabsTrigger value="preferences">User Preferences</TabsTrigger>
          <TabsTrigger value="custom">Custom Query</TabsTrigger>
        </TabsList>

        <TabsContent value="breakpoints" className="space-y-4 pt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <MediaQueryCard
              title="Small (sm)"
              description="min-width: 640px"
              isActive={isSm}
            />
            <MediaQueryCard
              title="Medium (md)"
              description="min-width: 768px"
              isActive={isMd}
            />
            <MediaQueryCard
              title="Large (lg)"
              description="min-width: 1024px"
              isActive={isLg}
            />
            <MediaQueryCard
              title="Extra Large (xl)"
              description="min-width: 1280px"
              isActive={isXl}
            />
            <MediaQueryCard
              title="2x Extra Large (2xl)"
              description="min-width: 1536px"
              isActive={is2xl}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3 mt-4">
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Current Breakpoint</CardTitle>
                  <CardDescription>
                    The current breakpoint based on window width
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-medium">
                    {is2xl
                      ? "2xl (1536px+)"
                      : isXl
                        ? "xl (1280px - 1535px)"
                        : isLg
                          ? "lg (1024px - 1279px)"
                          : isMd
                            ? "md (768px - 1023px)"
                            : isSm
                              ? "sm (640px - 767px)"
                              : "xs (< 640px)"}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4 pt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <MediaQueryCard
              title="Dark Mode"
              description="prefers-color-scheme: dark"
              isActive={isDark}
            />
            <MediaQueryCard
              title="Reduced Motion"
              description="prefers-reduced-motion"
              isActive={isReduced}
            />
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom Media Query</CardTitle>
              <CardDescription>
                Test any CSS media query to see if it matches
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="custom-query">Media Query</Label>
                <div className="flex gap-2">
                  <Input
                    id="custom-query"
                    placeholder="e.g. (max-width: 500px)"
                    value={customQuery}
                    onChange={(e) => setCustomQuery(e.target.value)}
                  />
                  <Button onClick={handleTestQuery}>Test</Button>
                </div>
              </div>
              {testQuery && (
                <MediaQueryCard
                  title="Custom Query"
                  description={testQuery}
                  isActive={isCustom}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MediaQueryCard({
  title,
  description,
  isActive,
}: {
  title: string;
  description: string;
  isActive: boolean;
}) {
  return (
    <Card className={isActive ? "border-green-500 dark:border-green-700" : ""}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          {title}
          {isActive ? (
            <CheckIcon className="h-5 w-5 text-green-500" />
          ) : (
            <XIcon className="h-5 w-5 text-muted-foreground" />
          )}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`font-medium ${
            isActive
              ? "text-green-600 dark:text-green-400"
              : "text-muted-foreground"
          }`}
        >
          {isActive ? "Matches" : "Does not match"}
        </div>
      </CardContent>
    </Card>
  );
}
