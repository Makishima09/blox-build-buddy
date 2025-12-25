import { useState } from 'react';
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
import racesData from '@/data/races.json';

interface Race {
  id: string;
  name: string;
  tier: string;
  rarity: string;
  tags: string[];
  passives: string[];
  pvpBonus: number;
}

const races = racesData as Race[];

interface RaceSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export function RaceSelect({ value, onValueChange, placeholder = 'Seleccionar raza...' }: RaceSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedRace = races.find((r) => r.id === value);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'S': return 'text-accent';
      case 'A': return 'text-primary';
      case 'B': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getRaceEmoji = (id: string) => {
    switch (id) {
      case 'human': return '👤';
      case 'rabbit': return '🐰';
      case 'shark': return '🦈';
      case 'angel': return '👼';
      case 'ghoul': return '👻';
      case 'cyborg': return '🤖';
      case 'draco': return '🐉';
      default: return '❓';
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
          {selectedRace ? (
            <div className="flex items-center gap-2">
              <span>{getRaceEmoji(selectedRace.id)}</span>
              <span className={cn('font-bold', getTierColor(selectedRace.tier))}>
                [{selectedRace.tier}]
              </span>
              <span>{selectedRace.name}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 min-w-[300px]" align="start">
        <Command>
          <CommandInput placeholder="Buscar raza..." />
          <CommandList>
            <CommandEmpty>No se encontró la raza.</CommandEmpty>
            <CommandGroup heading="Razas">
              {races.map((race) => (
                <CommandItem
                  key={race.id}
                  value={race.name}
                  onSelect={() => {
                    onValueChange(race.id);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2"
                >
                  <Check
                    className={cn(
                      'h-4 w-4',
                      value === race.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <span>{getRaceEmoji(race.id)}</span>
                  <span className={cn('font-bold w-6', getTierColor(race.tier))}>
                    {race.tier}
                  </span>
                  <span>{race.name}</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    +{race.pvpBonus} PVP
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
