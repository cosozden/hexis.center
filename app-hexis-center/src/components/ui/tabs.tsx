"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ━━━ TABS CONTEXT ━━━

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("Tabs components must be used within <Tabs>");
  return ctx;
}

// ━━━ TABS ROOT ━━━

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

function Tabs({ value: controlledValue, defaultValue = "", onValueChange, children, className, ...props }: TabsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const value = controlledValue ?? internalValue;

  const handleChange = React.useCallback(
    (v: string) => {
      setInternalValue(v);
      onValueChange?.(v);
    },
    [onValueChange],
  );

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleChange }}>
      <div className={className} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

// ━━━ TABS LIST ━━━

function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      role="tablist"
      className={cn("flex border-b border-border", className)}
    >
      {children}
    </div>
  );
}

// ━━━ TABS TRIGGER ━━━

function TabsTrigger({
  value: tabValue,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { value, onValueChange } = useTabsContext();
  const isActive = value === tabValue;

  return (
    <button
      role="tab"
      type="button"
      aria-selected={isActive}
      className={cn(
        "px-4 py-2 text-sm font-medium transition-colors -mb-px",
        isActive
          ? "border-b-2 border-primary text-foreground"
          : "text-muted-foreground hover:text-foreground",
        className,
      )}
      onClick={() => onValueChange(tabValue)}
    >
      {children}
    </button>
  );
}

// ━━━ TABS CONTENT ━━━

function TabsContent({
  value: tabValue,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { value } = useTabsContext();
  if (value !== tabValue) return null;

  return (
    <div role="tabpanel" className={cn("mt-4", className)}>
      {children}
    </div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
