import { EllipsisVerticalIcon, FileTextIcon } from "lucide-react";

type CardAttachmentProps = {
  id: string;
  title: string;
}


export default function CardAttachment({ id, title }: CardAttachmentProps) {
  return (
    <div key={id} className="bg-white rounded-md p-4 shadow-md shadow-neutral-300/10 flex justify-between items-center">
      <div className="space-x-1 text-neutral-600 flex items-center">
        <span className="size-8 flex justify-center items-center"><FileTextIcon /></span>
        <p className="text-sm">{title}</p>
      </div>
      <span className="size-4 flex justify-center items-center"><EllipsisVerticalIcon /></span>
    </div>
  )
}
