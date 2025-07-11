import {ResponsiveDialog} from '@/components/responsive-dialog';
import { AgentForm } from './agent-form';

interface NewAgentDialogProps{
    open: boolean;
    onOpenChange: (open: boolean) => void;  
}

export const NewAgentDialog = ({open, onOpenChange}: NewAgentDialogProps) => {
    return (
        <ResponsiveDialog
            open={open}
            onOpenChange={onOpenChange}
            title="New Agent"
            description="Create a new agent to automate your tasks."
        >
            <div className="p-4">
                <AgentForm 
                onSuccess={() => onOpenChange(false)}
                onCancel={() => onOpenChange(false)}
                />
            </div>
        </ResponsiveDialog>
    );
}