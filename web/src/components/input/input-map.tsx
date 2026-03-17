import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Activity, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { MapPinnedIcon } from "lucide-react";
import { cn, cutText } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import Modal from "../modal/modal";
import { GOOGLE_MAPS_API_KEY } from "@/lib/constant";

type InputMapProps = {
    value: string;
    onChange: (value: string) => void;
    error?: boolean;
};

export default function InputMap({ value, onChange, error }: InputMapProps) {
    const [open, setOpen] = useState(false);
    const coords = useMemo(() => {
        if (!value) return null;

        const [lat, lng] = value.split(",").map(Number);

        if (isNaN(lat) || isNaN(lng)) return null;

        return { lat, lng };
    }, [value]);

    const handleMapClick = (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;

        const lat = e.latLng.lat();
        const lng = e.latLng.lng();

        onChange(`${lat},${lng}`);
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-x-2">
                <Activity mode={coords ? "visible" : "hidden"}>
                    <Tooltip>
                        <TooltipTrigger asChild className="w-full">
                            <span className={cn("w-full text-sm p-2 flex h-10 border border-border rounded-md", {
                                "ring-3 ring-destructive/20 border-destructive": error
                            })}>
                                {coords ? `${cutText(String(coords.lat), 12, true)} , ${cutText(String(coords.lng), 12, true)}` : ""}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="text-sm">{coords ? `${coords.lat} , ${coords.lng}` : ""}</p>
                        </TooltipContent>
                    </Tooltip>
                </Activity>
                <Activity mode={!coords ? "visible" : "hidden"}>
                    <span className={cn("w-full text-zinc-400 text-sm p-2 flex h-10 border border-border rounded-md", {
                        "ring-3 ring-destructive/20 border-destructive": error
                    })}>
                        Inserer les coordonnées
                    </span>
                </Activity>
                <Modal open={open} setOpen={setOpen} title="Selectionner les coordonnées" action={
                    <Button type='button' variant="outline" aria-invalid={error} className="h-9.5 shadow-none">
                        <MapPinnedIcon />
                    </Button>} >
                    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                        <GoogleMap
                            mapContainerStyle={{ width: "100%", height: "400px" }}
                            center={coords ?? { lat: 48.8566, lng: 2.3522 }}
                            zoom={coords ? 14 : 8}
                            onClick={handleMapClick}
                        >
                            {coords && <Marker position={coords} />}
                        </GoogleMap>
                    </LoadScript>
                </Modal>

            </div>


        </div>
    );
}