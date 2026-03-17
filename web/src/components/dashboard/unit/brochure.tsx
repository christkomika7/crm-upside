import FilterBrochure from "@/components/forms/brochure/filter";
import { Button } from "@/components/ui/button";
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Brochure() {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="inset-action" className="w-fit" >Brochure</Button>
            </PopoverTrigger>
            <PopoverContent align="end" side="bottom" className="w-fit p-0">
                <PopoverArrow />
                <div className="bg-white rounded-md space-y-4 p-4">
                    <h2 className="text-neutral-600 text-lg font-medium">Générer une brochure</h2>
                    <Tabs defaultValue='ilter-unit' className='gap-4 w-full'>
                        <TabsList className="bg-neutral-100 rounded-md p-1">
                            <TabsTrigger
                                value="filter-unit"
                                className='bg-transparent p-2 text-sm font-medium data-[state=active]:bg-white h-full rounded-md border-transparent'
                            >
                                Filtrer les unités
                            </TabsTrigger>
                            <TabsTrigger
                                className='bg-transparent text-sm p-2 font-medium data-[state=active]:bg-white h-full rounded-md border-transparent'
                                value="send-brochure"
                            >
                                Partager la brochure
                            </TabsTrigger>

                        </TabsList>

                        <TabsContent value="filter-unit">
                            <FilterBrochure />
                        </TabsContent>
                        <TabsContent value="send-brochure">
                            <p className='text-muted-foreground text-sm'>Hello man</p>
                        </TabsContent>
                    </Tabs>
                    <div className="grid grid-cols-2 gap-x-2">
                        <Button variant="outline" >Envoyer l'email</Button>
                        <Button variant="inset-action" className="bg-neutral-100 ring-neutral-100" >Télécharger PDF</Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
