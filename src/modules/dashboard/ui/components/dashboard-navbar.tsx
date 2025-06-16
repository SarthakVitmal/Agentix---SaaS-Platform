"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { PanelLeft, PanelLeftCloseIcon, SearchIcon } from "lucide-react";
import { DashboardCommand } from "@/modules/dashboard/ui/components/dashboard-command";

export const DashboardNavbar = () => {
    const {state, toggleSidebar, isMobile} = useSidebar()
    const [commandOpen, setCommandOpen] = useState(false);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setCommandOpen(open => !open);
            }
        }
        document.addEventListener("keydown", down);
        return () => {
            document.removeEventListener("keydown", down);
        }
    },[])
    return(
        <>
        <DashboardCommand open={commandOpen} setOpen={setCommandOpen} />
        <nav className="flex px-4 gap-x-2 items-center py-3 border-b bg-background">
            <Button className="size-9" variant='outline' onClick={toggleSidebar}>
               {(state === "collapsed" || isMobile)? <PanelLeft className="size-4"/> : <PanelLeftCloseIcon className="size-4"/>}
            </Button>
            <Button variant="outline" size="sm" className="h-9 w-[240px] justify-start font-normal text-muted-foreground hover:text-muted-foreground"
            onClick={() => setCommandOpen(true)}>
                <SearchIcon/>Search
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                    <span className="text-xs">&#8984;</span>K
                </kbd>
            </Button>
        </nav>
        </>
    )
}

export default DashboardNavbar;