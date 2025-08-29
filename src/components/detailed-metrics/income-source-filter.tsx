
"use client";

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface IncomeSourceFilterProps {
  availableSources: string[];
  selectedSources: string[];
  setSelectedSources: (sources: string[]) => void;
}

export function IncomeSourceFilter({
  availableSources,
  selectedSources,
  setSelectedSources,
}: IncomeSourceFilterProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (currentValue: string) => {
    let newSelected: string[];
    if (currentValue === "all") {
        newSelected = selectedSources.length === availableSources.length ? [] : availableSources;
    } else {
        newSelected = selectedSources.includes(currentValue)
            ? selectedSources.filter((s) => s !== currentValue)
            : [...selectedSources, currentValue];
    }
    setSelectedSources(newSelected);
  }
  
  const allSelected = selectedSources.length === availableSources.length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full sm:w-[260px] justify-between"
        >
            <span className="truncate">
          {selectedSources.length === 0
            ? "All Income Sources"
            : selectedSources.length === 1
            ? selectedSources[0]
            : `${selectedSources.length} sources selected`}
            </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[260px] p-0">
        <Command>
          <CommandInput placeholder="Search sources..." />
          <CommandList>
            <CommandEmpty>No source found.</CommandEmpty>
            <CommandGroup>
                <CommandItem
                    value="all"
                    onSelect={() => handleSelect("all")}
                >
                    <Check
                    className={cn(
                        "mr-2 h-4 w-4",
                        allSelected ? "opacity-100" : "opacity-0"
                    )}
                    />
                    All Sources
                </CommandItem>
              {availableSources.map((source) => (
                <CommandItem
                  key={source}
                  value={source}
                  onSelect={handleSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedSources.includes(source) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {source}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
