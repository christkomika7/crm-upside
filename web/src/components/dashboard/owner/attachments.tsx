import CardAttachment from "@/components/card/card-attachment";

type Attachments = {
    id: string;
}

export default function Attachments({ id }: Attachments) {
    console.log(id);
    return (
        <div className="space-y-2">
            <h2 className="font-medium">Pièces jointes</h2>
            <div className="grid grid-cols-4 gap-4">
                <CardAttachment id="1" title="Property Title.pdf" />
                <CardAttachment id="2" title="Insurance.pdf" />
                <CardAttachment id="3" title="Appraisal.pdf" />
                <CardAttachment id="4" title="ID Card.jpg" />
            </div>
        </div>
    )
}
