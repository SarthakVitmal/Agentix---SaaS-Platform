import {Button} from "@/components/ui/button";

interface Props{
    totalPages: number;
    page: number;
    onPageChange: (page: number) => void;
}

export const DataPagination = ({totalPages, page, onPageChange}: Props) => {
    return(
        <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground flex-1">
                Page {page} of {totalPages || 1}
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button disabled={page==1} onClick={() => onPageChange(page - 1)} variant="outline" >
                    Previous
                </Button>
                <Button disabled={page == totalPages || totalPages == 0} variant="outline" onClick={() => onPageChange(page + 1)}>
                    Next
                </Button>
            </div>
        </div>
    )
}