import { LucideIcon } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface DateDisplayProps {
    label: string;
    date?: Date;
    icon: LucideIcon;
}

export function DateDisplay({ label, date, icon: Icon }: DateDisplayProps) {
    return (
        <div className="flex items-center gap-2 text-sm">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{label}:</span>
            <span>{date ? formatDate(date) : 'N/A'}</span>
        </div>
    );
}
