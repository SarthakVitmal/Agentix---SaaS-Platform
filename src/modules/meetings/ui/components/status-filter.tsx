import {
    CircleXIcon,
    CircleCheckIcon,
    ClockArrowUpIcon,
    VideoIcon,
    LoaderIcon,
} from 'lucide-react';
import {CommandSelect} from '@/components/command-select';
import {useMeetingsFilters} from '../../hooks/use-meetings-filters';
import {MeetingStatus} from '../../types';

const options = [
    {
        id: MeetingStatus.Upcoming,
        value: MeetingStatus.Upcoming,
        children:(
            <div className="flex items-center gap-x-2 capitalize">
                <ClockArrowUpIcon />
                {MeetingStatus.Upcoming}
            </div>
        )
    },
     {
        id: MeetingStatus.Completed,
        value: MeetingStatus.Completed,
        children:(
            <div className="flex items-center gap-x-2 capitalize">
                <CircleCheckIcon />
                {MeetingStatus.Completed}
            </div>
        )
    },
     {
        id: MeetingStatus.Active,
        value: MeetingStatus.Active,
        children:(
            <div className="flex items-center gap-x-2 capitalize">
                <VideoIcon />
                {MeetingStatus.Active}
            </div>
        )
    },
      {
        id: MeetingStatus.Processing,
        value: MeetingStatus.Processing,
        children:(
            <div className="flex items-center gap-x-2 capitalize">
                <LoaderIcon />
                {MeetingStatus.Processing}
            </div>
        )
    },
      {
        id: MeetingStatus.Cancelled,
        value: MeetingStatus.Cancelled,
        children:(
            <div className="flex items-center gap-x-2 capitalize">
                <CircleXIcon />
                {MeetingStatus.Cancelled}
            </div>
        )
    }
]

export const MeetingsStatusFilter = () => {
    const [filters, setFilters] = useMeetingsFilters();

    return (
        <CommandSelect
            value={filters.status ?? " "}
            onSelect={(value) => setFilters({status: value as MeetingStatus})}
            options={options}
            placeholder="Filter by status"
            className="h-9"
        />
    );
};

export default MeetingsStatusFilter;