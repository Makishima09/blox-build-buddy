import { useState, useMemo } from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import fruitsData from '@/data/fruits.json';
import { Fruit } from '@/types';

const fruits = fruitsData as Fruit[];

interface FruitSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export function FruitSelect({ value, onValueChange, placeholder = 'Select fruit...' }: FruitSelectProps) {
  const [open, setOpen] = useState(false);

  const groupedFruits = useMemo(() => {
    const groups: Record<string, Fruit[]> = {
      'Paramecia': [],
      'Logia': [],
      'Zoan': [],
    };
    fruits.forEach((fruit) => {
      groups[fruit.type]?.push(fruit);
    });
    return groups;
  }, []);

  const selectedFruit = fruits.find((f) => f.id === value);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'S': return 'text-accent';
      case 'A': return 'text-primary';
      case 'B': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-12 text-left font-normal"
        >
          {selectedFruit ? (
            <div className="flex items-center gap-2">
              <span className={cn('font-bold', getTierColor(selectedFruit.tier))}>
                [{selectedFruit.tier}]
              </span>
              <span>{selectedFruit.name}</span>
              <span className="text-xs text-muted-foreground">({selectedFruit.type})</span>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 min-w-[300px]" align="start">
        <Command>
          <CommandInput placeholder="Search fruits..." />
          <CommandList>
            <CommandEmpty>No fruit found.</CommandEmpty>
            {Object.entries(groupedFruits).map(([type, fruits]) => (
              <CommandGroup key={type} heading={type}>
                {fruits.map((fruit) => (
                  <CommandItem
                    key={fruit.id}
                    value={fruit.name}
                    onSelect={() => {
                      onValueChange(fruit.id);
                      setOpen(false);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Check
                      className={cn(
                        'h-4 w-4',
                        value === fruit.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <span className={cn('font-bold w-6', getTierColor(fruit.tier))}>
                      {fruit.tier}
                    </span>
                    <span>{fruit.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
