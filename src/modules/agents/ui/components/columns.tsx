"use client"

import { ColumnDef } from "@tanstack/react-table"
import { AgentGetMany } from "../../types"
import { GeneratedAvatar } from "@/components/generated-avatar"
import { CornerDownRightIcon, VideoIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const columns: ColumnDef<AgentGetMany[number]>[] = [
    {
        accessorKey: "name",
        header: "Agent Name",
        cell: ({ row }) => {
            return (
                <div className="flex flex-col gap-y-1">
                    <div className="flex items-center gap-x-2">
                        <GeneratedAvatar variant="botttsNeutral" seed={row.original.name} className="size-6" />
                        <span className="text-sm font-medium text-foreground">
                            {row.original.name}
                        </span>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <CornerDownRightIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground max-w-[200px] truncate capitalize">
                            {row.original.instructions}
                        </span>
                    </div>
                </div>
            )
        }
    },
    {
        accessorKey: "meetingCount",
        header: "Meetings",
        cell: ({ row }) => {
            return (
                <Badge variant="outline" className="flex items-center gap-x-2 [&>svg]:size-4">
                    <VideoIcon className="text-blue-700" />
                    {row.original.meetingCount || 0}{row.original.meetingCount === 1 ? " Meeting" : " Meetings"}
                </Badge>
            )
        }
    }
]