import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";
import MeetingIdView, { MeetingsIdViewError, MeetingsIdViewLoading } from "@/modules/meetings/ui/views/meeting-id-view";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
    params: Promise<{ meetingId: string }>;
}

export const Page = async ({ params }: Props) => {
    const { meetingId } = await params;
     if (!meetingId) {
        redirect("/meetings");
    }
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) {
        redirect("/sign-in")
    }

    const queryClient = getQueryClient();
     try {
        await queryClient.prefetchQuery(
            trpc.meetings.getOne.queryOptions({ id: meetingId })
        );
    } catch (error) {
        console.error("Failed to prefetch meeting:", error);
        redirect("/meetings");
    }
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<MeetingsIdViewLoading />}>
                <ErrorBoundary fallback={<MeetingsIdViewError />}>
                    <MeetingIdView meetingId={meetingId}/>
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    );
}

export default Page;