
"use client";

import * as React from "react";
import { ListFilter, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

interface IncomeSourceFilterProps {
  sources: string[];
  selectedSources: string[];
  onSelectionChange: (sources: string[]) => void;
  isLoading: boolean;
}

export default function IncomeSourceFilter({ sources, selectedSources, onSelectionChange, isLoading }: IncomeSourceFilterProps) {
  const handleSelectAll = () => {
    if (sources.length === selectedSources.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(sources);
    }
  };

  const title = selectedSources.length === 0
      ? "No sources selected"
      : selectedSources.length === sources.length
      ? "All Sources"
      : selectedSources.length === 1
      ? selectedSources[0]
      : `${selectedSources.length} sources selected`;

  if (isLoading) {
    return <Skeleton className="h-10 w-[200px]" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-[200px] justify-between"
          disabled={isLoading}
        >
          <div className="flex items-center gap-2">
            <ListFilter className="h-4 w-4" />
            <span className="truncate">{title}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Filter by Source</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
            checked={sources.length === selectedSources.length}
            onCheckedChange={handleSelectAll}
        >
            Select All
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        {sources.map((source) => (
          <DropdownMenuCheckboxItem
            key={source}
            checked={selectedSources.includes(source)}
            onCheckedChange={() => {
                const newSelection = selectedSources.includes(source)
                    ? selectedSources.filter(s => s !== source)
                    : [...selectedSources, source];
                onSelectionChange(newSelection);
            }}
          >
            {source}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
