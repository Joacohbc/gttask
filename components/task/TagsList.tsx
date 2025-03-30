import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";

type TagType = {
    id: string;
    name: string;
    color: string;
};

interface TagsListProps {
    tags: TagType[];
    title?: string;
    className?: string;
}

export function TagsList({ tags, title = "Tags", className = "" }: TagsListProps) {
    if (!tags || tags.length === 0) return null;

    return (
        <div className={className}>
            {title && <h3 className="text-md font-medium mb-2">{title}</h3>}
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <Badge key={tag.id} style={{ backgroundColor: tag.color, color: '#fff' }}>
                        <Tag className="mr-1 h-3 w-3" />
                        {tag.name}
                    </Badge>
                ))}
            </div>
        </div>
    );
}
