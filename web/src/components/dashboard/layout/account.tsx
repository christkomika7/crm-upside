import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type AccountProps = {
    name: string;
    image?: string;
}

export default function Account({ name, image }: AccountProps) {
    const initials = name
        ?.split(" ")
        ?.map((n) => n[0])
        ?.join("")
        ?.toUpperCase()
        ?.slice(0, 2);

    return (
        <Avatar className="size-10 rounded-md!">
            <AvatarImage className="rounded-md!" src={image ?? undefined} />
            <AvatarFallback className="rounded-md!">{initials}</AvatarFallback>
        </Avatar>
    )
}
