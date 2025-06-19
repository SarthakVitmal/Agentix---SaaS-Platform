"use client";
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { DEFAULT_PAGE } from '@/constants';
import { PlusIcon, XCircleIcon } from 'lucide-react';
import React from 'react';
import { useMeetingsFilters } from '../../hooks/use-meetings-filters';
import AgentIdFilter from './agent-id-filter';
import MeetingsSearchFilter from './meeting-search-filter';
import { NewMeetingDialog } from './new-meeting-dialog';
import MeetingsStatusFilter from './status-filter';


export const MeetingsListHeader = () => {
    const [filters, setFilters] = useMeetingsFilters();
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    const isAnyFilterModified = 
    !!filters.search || !!filters.agentId || !!filters.status;

    const resetFilters = () => {
        if (isAnyFilterModified) {
            setFilters({ search: '', agentId: '', status: null, page: DEFAULT_PAGE });
        }
    }

    return (
        <>
        <NewMeetingDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}/>
        <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
            <div className="flex items-center justify-between">
                <h5 className='font-medium text-xl'>My Meetings</h5>
                <Button onClick={() => setIsDialogOpen(true)}><PlusIcon/> New Meeting</Button>
            </div>
            <ScrollArea>
            <div className="flex items-center gap-x-2 p-1">
                <MeetingsSearchFilter/>
                <MeetingsStatusFilter/>
                <AgentIdFilter/>
                {isAnyFilterModified && (
                    <Button variant="outline" onClick={resetFilters}>
                        <XCircleIcon className="size-4 mr-2" />
                        Clear Filters
                    </Button>
                )}
            </div>
            <ScrollBar orientation='horizontal'/>
            </ScrollArea>
        </div>
        </>
    );
}
export default MeetingsListHeader;