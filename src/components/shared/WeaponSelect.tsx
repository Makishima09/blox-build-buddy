import { useState, useMemo } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
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
import weaponsData from '@/data/weapons.json';
import { Weapon } from '@/types';

const weapons = weaponsData as Weapon[];

interface WeaponSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  category?: 'Sword' | 'Gun' | 'Fighting Style' | 'all';
}

export function WeaponSelect({ 
  value, 
  onValueChange, 
  placeholder = 'Select weapon...', 
  category = 'all' 
}: WeaponSelectProps) {
  const [open, setOpen] = useState(false);

  const filteredWeapons = useMemo(() => {
    if (category === 'all') return weapons;
    return weapons.filter(w => w.category === category);
  }, [category]);

  const getTierOrder = (tier: string): number => {
    const order: Record<string, number> = { 'S': 0, 'A': 1, 'B': 2, 'C': 3 };
    return order[tier] ?? 4;
  };

  const groupedWeapons = useMemo(() => {
    const groups: Record<string, Weapon[]> = {};
    filteredWeapons.forEach((weapon) => {
      if (!groups[weapon.category]) {
        groups[weapon.category] = [];
      }
      groups[weapon.category].push(weapon);
    });
    // Ordenar cada grupo por tier (S > A > B > C)
    Object.keys(groups).forEach((category) => {
      groups[category].sort((a, b) => {
        const tierDiff = getTierOrder(a.tier) - getTierOrder(b.tier);
        if (tierDiff !== 0) return tierDiff;
        return a.name.localeCompare(b.name);
      });
    });
    return groups;
  }, [filteredWeapons]);

  const selectedWeapon = weapons.find((w) => w.id === value);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'S': return 'text-accent';
      case 'A': return 'text-primary';
      case 'B': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Sword': return '⚔️';
      case 'Gun': return '🔫';
      case 'Fighting Style': return '👊';
      default: return '📦';
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
          {selectedWeapon ? (
            <div className="flex items-center gap-2">
              <span>{getCategoryIcon(selectedWeapon.category)}</span>
              <span className={cn('font-bold', getTierColor(selectedWeapon.tier))}>
                [{selectedWeapon.tier}]
              </span>
              <span>{selectedWeapon.name}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 min-w-[300px]" align="start">
        <Command>
          <CommandInput placeholder="Search weapons..." />
          <CommandList>
            <CommandEmpty>No weapon found.</CommandEmpty>
            {Object.entries(groupedWeapons).map(([cat, items]) => (
              <CommandGroup key={cat} heading={`${getCategoryIcon(cat)} ${cat}`}>
                {items.map((weapon) => (
                  <CommandItem
                    key={weapon.id}
                    value={weapon.name}
                    onSelect={() => {
                      onValueChange(weapon.id);
                      setOpen(false);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Check
                      className={cn(
                        'h-4 w-4',
                        value === weapon.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <span className={cn('font-bold w-6', getTierColor(weapon.tier))}>
                      {weapon.tier}
                    </span>
                    <span>{weapon.name}</span>
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
