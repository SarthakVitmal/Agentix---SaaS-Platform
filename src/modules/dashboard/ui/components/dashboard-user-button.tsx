import { authClient } from "@/lib/auth-client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
    DrawerDescription,
    DrawerHeader,
    DrawerFooter,
    DrawerTitle
} from "@/components/ui/drawer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { ChevronDownIcon, CreditCardIcon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";


export const DashboardUserButton = () => {
    const router = useRouter();
    const isMobile = useIsMobile();
    const { data, isPending } = authClient.useSession();

    const onLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push('/sign-in');
                },
                onError: (error) => {
                    console.error("Logout failed:", error);
                }
            }
        });
    }

    if (isPending) {
        return null;
    }

    if (isMobile) {
        return (
            <Drawer>
                <DrawerTrigger className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden">
                    {data?.user.image ? (
                        <Avatar>
                            <AvatarImage src={data.user.image} alt={data.user.name || "User Avatar"} />
                        </Avatar>
                    ) : (<GeneratedAvatar seed={data?.user.name ?? "User"} variant="initials" className="size-9" />)
                    }
                    <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0 ml-3">
                        <p className="text-sm truncate w-full">{data?.user.name}</p>
                        <p className="text-xs truncate w-full">{data?.user.email}</p>
                    </div>
                    <ChevronDownIcon className="size-4 shrink-0" />
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle className="flex flex-col gap-1 text-left">
                            <span className="font-semi-bold truncate">{data?.user.name}</span>
                            <span className="text-sm font-normal truncate">{data?.user.email}</span>
                        </DrawerTitle>
                    </DrawerHeader>
                    <DrawerFooter className="flex flex-col gap-2 space-y-2">
                        <Button
                            variant="outline"
                            className="w-full flex items-center justify-center"
                            onClick={() => { }}
                        >
                            <span>Billing</span>
                            <CreditCardIcon className="size-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full flex items-center justify-center"
                            onClick={onLogout}
                        >
                            <span>Logout</span>
                            <LogOut className="size-4" />
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        )
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden">
                {data?.user.image ? (
                    <Avatar>
                        <AvatarImage src={data.user.image} alt={data.user.name || "User Avatar"} />
                    </Avatar>
                ) : (<GeneratedAvatar seed={data?.user.name ?? "User"} variant="initials" className="size-9" />)
                }
                <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0 ml-3">
                    <p className="text-sm truncate w-full">{data?.user.name}</p>
                    <p className="text-xs truncate w-full">{data?.user.email}</p>
                </div>
                <ChevronDownIcon className="size-4 shrink-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="right" className="w-72">
                <DropdownMenuLabel>
                    <div className="flex flex-col gap-1">
                        <span className="font-medium truncate">{data?.user.name}</span>
                        <span className="font-normal truncate">{data?.user.email}</span>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer flex items-center justify-between">
                    Billing
                    <CreditCardIcon className="size-4" />
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer flex items-center justify-between"
                    onClick={onLogout}>
                    Logout
                    <LogOut className="size-4" />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default DashboardUserButton;