import { useTRPC } from "@/trpc/client";
import { MeetingGetOne } from "../../types";
import { useRouter } from "next/navigation";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { meetingsInsertSchema } from "../../schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    useFormField,
    Form,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
    FormField,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CommandSelect } from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog";

interface MeetingFormProps {
    onSuccess: (id?: string) => void;
    onCancel: () => void;
    initialValues?: MeetingGetOne;
}

export const MeetingForm = ({ onCancel, onSuccess, initialValues }: MeetingFormProps) => {
    const trpc = useTRPC();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [agentSearch, setAgentSearch] = useState("");
    const [openNewAgentDialog, setOpenNewAgentDialog] = useState(false);

    const agents = useQuery(trpc.agents.getMany.queryOptions({
        pageSize: 100,
        search: agentSearch,
    }));

    const updateAgent = useMutation(
        trpc.meetings.update.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(
                    trpc.meetings.getMany.queryOptions({}),
                )
                if (initialValues?.id) {
                    await queryClient.invalidateQueries(
                        trpc.meetings.getOne.queryOptions({ id: initialValues.id }),
                    );
                }
                onSuccess?.();
            },
            onError: (error) => {
                toast.error(error.message)
            },

        })
    );

    const createMeeting = useMutation(
        trpc.meetings.create.mutationOptions({
            onSuccess: async (data) => {
                await queryClient.invalidateQueries(
                    trpc.meetings.getMany.queryOptions({}),
                )
                if (initialValues?.id) {
                    await queryClient.invalidateQueries(
                        trpc.meetings.getOne.queryOptions({ id: initialValues.id }),
                    );
                }
                onSuccess?.(data.id);
            },
            onError: (error) => {
                toast.error(error.message)
            },

        })
    );
    const form = useForm<z.infer<typeof meetingsInsertSchema>>({
        resolver: zodResolver(meetingsInsertSchema),
        defaultValues: {
            name: initialValues?.name ?? "",
            agentId: initialValues?.agentsId ?? "",
        },
    })

    const isEdit = !!initialValues;
    const isPending = createMeeting.isPending || updateAgent.isPending;

    const onSubmit = async (data: z.infer<typeof meetingsInsertSchema>) => {
        if (isEdit) {
            updateAgent.mutate({ ...data, id: initialValues?.id });
        } else {
            await createMeeting.mutate(data);
            onSuccess();
        }
    }
    return (
       <>
       <NewAgentDialog open={openNewAgentDialog} onOpenChange={setOpenNewAgentDialog} />
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Meeting Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    name="agentId"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Agent</FormLabel>
                            <FormControl>
                                <CommandSelect 
                                    options={(agents.data?.item ?? []).map((agent) => ({
                                        id: agent.id,
                                        value: agent.id,
                                        children: (
                                            <div className="flex items-center">
                                                <GeneratedAvatar
                                                    seed={agent.name}
                                                    variant="botttsNeutral"
                                                    className="border size-6 mr-2"
                                                />
                                                <span>{agent.name}</span>
                                            </div>
                                        )
                                    }))}
                                    onSelect={(value) => field.onChange(value)}
                                    onSearch={setAgentSearch}
                                    value={field.value}
                                    placeholder="Select an Agent"
                                />
                            </FormControl>
                            <FormDescription>Not found what you&apos;re looking for?{" "}
                                <Button
                                    variant="link"
                                    onClick={() => setOpenNewAgentDialog(true)}
                                    className="p-0"
                                >
                                    Create a new agent
                                </Button>
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-between gap-2">
                    {
                        onCancel && (
                            <Button variant="ghost" onClick={onCancel} disabled={isPending} type="button">
                                Cancel
                            </Button>
                        )

                    }
                    <Button type="submit" disabled={isPending}>
                        {isEdit ? "Update Meeting" : "Create Meeting"}
                    </Button>
                </div>
            </form>
        </Form>
       </>
    )

}