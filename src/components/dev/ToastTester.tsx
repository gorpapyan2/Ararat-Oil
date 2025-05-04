import React from "react";
import { useToast } from "@/hooks";
import { Button } from "@/components/ui/button";

export function ToastTester() {
  const { toast, success, error, warning, info } = useToast();

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Toast Tester</h2>
      
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => 
          toast({
            title: "Default Toast",
            description: "This is a default toast message",
            duration: 5000
          })
        }>
          Default Toast
        </Button>
        
        <Button onClick={() => 
          success({
            title: "Success",
            description: "Operation completed successfully!",
            duration: 5000
          })
        } 
        variant="secondary" 
        className="bg-green-500 text-white hover:bg-green-600">
          Success Toast
        </Button>
        
        <Button onClick={() =>
          error({
            title: "Error",
            description: "Something went wrong!",
            duration: 5000
          })
        } 
        variant="destructive">
          Error Toast
        </Button>
        
        <Button onClick={() =>
          warning({
            title: "Warning",
            description: "Please be careful with this action",
            duration: 5000
          })
        } 
        variant="secondary"
        className="bg-yellow-500 text-white hover:bg-yellow-600">
          Warning Toast
        </Button>
        
        <Button onClick={() =>
          info({
            title: "Information",
            description: "Here's something you should know",
            duration: 5000
          })
        } 
        variant="secondary"
        className="bg-blue-500 text-white hover:bg-blue-600">
          Info Toast
        </Button>
        
        <Button onClick={() => {
          const { dismiss } = toast({
            title: "With Action",
            description: "This toast has an action button",
            duration: 10000,
            action: (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 bg-white text-black hover:bg-gray-200 border-gray-300"
                onClick={() => alert("Action clicked!")}
              >
                Take Action
              </Button>
            )
          });
          
          // Auto dismiss after 10 seconds
          setTimeout(() => dismiss(), 10000);
        }} 
        variant="secondary">
          Toast with Action
        </Button>
      </div>
    </div>
  );
} 