import InputFile from "@/components/ui/input-file";
import { FileUpIcon, ImageIcon } from "lucide-react";
import { useState } from "react";

export default function Attachment({ id }: { id: string }) {
    console.log(id)
    const [upload, setUpload] = useState<Record<string, File[]>>({
        photos: [],
        deeds: [],
        documents: []
    });

    return (
        <div className="space-y-2">
            <h2 className="font-medium">Pièces jointes</h2>
            <div className="grid grid-cols-3 gap-4">
                <InputFile multiple={false} value={upload.photos} isFill onChange={e => setUpload({ ...upload, photos: e })}
                    icon={
                        <div className="flex items-center bg-blue-600/5 justify-center rounded-full  p-2.5">
                            <ImageIcon className="size-6 text-blue-600" />
                        </div>
                    }
                />
                <InputFile multiple={false} value={upload.deeds} isFill onChange={e => setUpload({ ...upload, deeds: e })}
                    icon={
                        <div className="flex items-center bg-emerald-600/5 justify-center rounded-full  p-2.5">
                            <FileUpIcon className="size-6 text-emerald-600" />
                        </div>
                    }
                />
                <InputFile multiple={false} value={upload.documents} isFill onChange={e => setUpload({ ...upload, documents: e })}
                    icon={
                        <div className="flex items-center bg-amber-600/5 justify-center rounded-full  p-2.5">
                            <FileUpIcon className="size-6 text-amber-400" />
                        </div>
                    }
                />
            </div>
        </div>
    )
}
