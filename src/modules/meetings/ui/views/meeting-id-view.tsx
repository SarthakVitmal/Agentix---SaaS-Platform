"use client";

import ErrorState from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useConfirm } from "@/hooks/use-confirm";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MeetingIdViewHeader } from "../components/meeting-id-view-header";
import { UpdateMeetingDialog } from "../components/update-meeting-dialog";
import { useState } from "react";
import UpcomingState from "../components/upcoming-state";
import ActiveState from "../components/active-state";
import CancelledState from "../components/cancelled-state";
import ProcessingState from "../components/processing-state";


interface Props {
    meetingId: string;
}

export const MeetingIdView = ({ meetingId }: Props) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const trpc = useTRPC();
    const [updateMeetingDialogOpen, setUpdateMeetingDialogOpen] = useState(false);
    const { data } = useSuspenseQuery(
        trpc.meetings.getOne.queryOptions({ id: meetingId })
    )

    const removeMeeting = useMutation(
        trpc.meetings.remove.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
                router.push('/meetings');
            },
            onError: (error) => {
                toast.error(`Error removing meeting: ${error.message}`);
            },
        },
        )
    )

    const [RemoveConfirmtion, confirmRemove] = useConfirm(
        "Are you sure you want to remove this meeting?",
        "This action cannot be undone. All data associated with this meeting will be permanently deleted."
    )

    const handleRemoveMeeting = async () => {
        const confirmed = await confirmRemove();
        if (!confirmed) return;
        if (confirmed) {
            removeMeeting.mutate({ id: meetingId });
        }
    }

    const isActive = data.status === "active";
    const isUpcoming = data.status === "upcoming";
    const isCompleted = data.status === "completed";
    const isCancelled = data.status === "cancelled";
    const isProcessing = data.status === "processing";

    return (
        <>
            <RemoveConfirmtion />
            <UpdateMeetingDialog 
                open={updateMeetingDialogOpen}
                onOpenChange={setUpdateMeetingDialogOpen}
                initialValues={data}
            />
            <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
                <MeetingIdViewHeader
                    meetingId={meetingId}
                    meetingName={data.name}
                    onEdit={() => setUpdateMeetingDialogOpen(true)}
                    onRemove={() => handleRemoveMeeting()}
                />

                {isCancelled && <CancelledState/>}
                {isCompleted && <div>Completed</div>}
                {isUpcoming && 
                <UpcomingState
                    meetingId={meetingId}
                    onCancelMeeting={() => handleRemoveMeeting()}
                    isCancelling={false} 
                />}
                {isActive && 
                <ActiveState
                    meetingId={meetingId}
                />}
                {isProcessing && <ProcessingState/>}
            </div>
        </>
    );
}

export default MeetingIdView;

export const MeetingsIdViewLoading = () => {
    return (
        <LoadingState title="Loading Meeting" description="This may take a few seconds" />
    )
}

export const MeetingsIdViewError = () => {
    return (
        <ErrorState title="Error Loading Meeting" description="Something went wrong" />
    )
}