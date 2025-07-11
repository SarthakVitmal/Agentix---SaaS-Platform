"use client";

import ErrorState from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DataTable } from "../components/data-table";
import { columns } from "../components/columns";
import { useRouter } from "next/navigation";
import EmptyState from "@/components/empty-state";
import useMeetingsFilters from "../../hooks/use-meetings-filters";
import { DataPagination } from "../components/meetings-pagination";

export const MeetingsView = () => {
    const router = useRouter();
    const trpc = useTRPC();
    const [filters, setFilters] = useMeetingsFilters();
    const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({
        ...filters,
    }));


    return (
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
            <DataTable
                columns={columns}
                data={data.item}
                onRowClick={(row) => router.push(`/meetings/${row.id}`)}
            />
            <DataPagination page={filters.page} totalPages={data.totalPages} onPageChange={(page) => setFilters({ page })} />

            {data.item.length === 0 && (
                <EmptyState title="Create your first meeting" description="Sehedule a meeting to connect with others. Each meeting lets you collaborate, share ideas, and interact with participants in real time" />
            )}
        </div>
    )
}

export default MeetingsView;

export const MeetingsViewLoading = () => {
    return (
        <LoadingState title="Loading Meetings" description="This may take a few seconds" />
    )
}

export const MeetingsViewError = () => {
    return (
        <ErrorState title="Error Loading Meetings" description="Something went wrong" />
    )
}