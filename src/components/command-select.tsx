import {ReactNode, useState} from 'react';
import {ChevronsUpDownIcon} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandResponsiveDialog} from '@/components/ui/command';
import {cn} from '@/lib/utils';
import { CommandList } from 'cmdk';

interface Props{
    options:Array<{
        id: string;
        value: string;
        children: ReactNode;
    }>
    onSelect: (value: string) => void;
    onSearch?: (value: string) => void;
    value?: string;
    placeholder?: string;
    isSearchable?: boolean;
    className?: string;
}

export const CommandSelect = ({
    options,
    onSelect,
    onSearch,
    value,
    placeholder = 'Select an option',
    className
}: Props) => {
    const [open, setOpen] = useState(false);
    const selectedOption = options.find(option => option.value === value);

    return (
        <>
        <Button onClick={() => setOpen(true)} 
        type='button' 
        variant="outline" 
        className={cn("h-9 justify-between font-normal px-2",!selectedOption && "text-muted-foreground",className)}>
            <div>
                {selectedOption?.children ?? placeholder}
            </div>
            <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
        <CommandResponsiveDialog open={open} onOpenChange={setOpen} shouldFilter={!onSearch} >
            <CommandInput placeholder='Search...' onValueChange={onSearch} /> 
                <CommandList>
                    <CommandEmpty className='text-muted-foreground text-sm'>
                        <span>No options found</span>
                    </CommandEmpty>
                    {options.map((option) => (
                        <CommandItem key={option.id} 
                            value={option.value} 
                            onSelect={() => {
                                onSelect(option.value);
                                setOpen(false);
                            }} 
                        >{option.children}</CommandItem>
                    ))}
                </CommandList>
        </CommandResponsiveDialog>
        </>
    );
}
export default CommandSelect;