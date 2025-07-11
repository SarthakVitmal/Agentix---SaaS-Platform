import { useTRPC } from "@/trpc/client";
import { AgentGetOne } from "../../types";
import { useRouter } from "next/navigation";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {agentInsertSchema} from "../../schema";
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
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface AgentFormProps {
    onSuccess: () => void;
    onCancel: () => void;
    initialValues?: AgentGetOne;
}

export const AgentForm = ({ onCancel, onSuccess, initialValues }: AgentFormProps) => {
    const trpc = useTRPC();
    const router = useRouter();
    const queryClient = useQueryClient();

    const updateAgent = useMutation(
        trpc.agents.update.mutationOptions({
            onSuccess: async() => {
                await queryClient.invalidateQueries(
                    trpc.agents.getMany.queryOptions({}),
                )
                if (initialValues?.id) {
                    await queryClient.invalidateQueries(
                        trpc.agents.getOne.queryOptions({ id: initialValues.id }),
                    );
                }
                onSuccess?.();
            },
            onError: (error) => {
                toast.error(error.message)
            },
            
        })
    );

    const createAgent = useMutation(
        trpc.agents.create.mutationOptions({
            onSuccess: async() => {
                await queryClient.invalidateQueries(
                    trpc.agents.getMany.queryOptions({}),
                )
                if (initialValues?.id) {
                    await queryClient.invalidateQueries(
                        trpc.agents.getOne.queryOptions({ id: initialValues.id }),
                    );
                }
                onSuccess?.();
            },
            onError: (error) => {
                toast.error(error.message)
            },
            
        })
    );
    const form = useForm<z.infer<typeof agentInsertSchema>>({
        resolver: zodResolver(agentInsertSchema),
        defaultValues: {
            name: initialValues?.name ?? "",
            instructions: initialValues?.instructions ?? "",
        },
    })

    const isEdit = !!initialValues;
    const isPending = createAgent.isPending || updateAgent.isPending;

    const onSubmit = async (data: z.infer<typeof agentInsertSchema>) => {
        if (isEdit) {
            updateAgent.mutate({...data, id: initialValues?.id });
        } else {
            await createAgent.mutate(data);
            onSuccess();
        }
    }
    return (
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <GeneratedAvatar
                    seed={form.watch("name")}
                    variant="botttsNeutral"
                    className="border size-16"
                />
                <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Agent Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="instructions"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Instructions</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Agent Instructions"
                                    {...field}
                                />
                            </FormControl>
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
                        {isEdit ? "Update Agent" : "Create Agent"}
                    </Button>
                </div>
            </form>
        </Form>
    )

}