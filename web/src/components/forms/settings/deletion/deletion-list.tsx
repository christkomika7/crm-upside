import DataTable from "@/components/table/data-table"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { apiFetch } from "@/lib/api"
import { deletionLabels } from "@/lib/data"
import { columns } from "@/lib/tables/deletion/deletion"
import { DeletionType, type Deletion, type DeletionKey } from "@/types/deletion"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

export default function DeletionList() {
  const [type, setType] = useState<DeletionKey>(DeletionType.OWNER)
  const types = Object.values(DeletionType)

  const { isPending, data } = useQuery<Deletion[]>({
    queryKey: ["deletions", type],
    enabled: !!type,
    queryFn: () => apiFetch<Deletion[]>(`/deletion/by?type=${type}`),
    staleTime: 0,
  });

  return (
    <div className="w-full">
      <ScrollArea className="w-full pb-2">
        <Tabs
          value={type}
          onValueChange={(e) => setType(e as DeletionKey)}
          className="w-full"
        >
          <TabsList className="flex w-max">
            {types.map((t) => (
              <TabsTrigger
                key={t}
                value={t}
                className="shrink-0 bg-background p-4 text-base font-medium 
                data-[state=active]:border-primary 
                dark:data-[state=active]:border-primary 
                h-full rounded-none border-0 border-b-2 border-transparent 
                data-[state=active]:shadow-none"
              >
                {deletionLabels[t]}
              </TabsTrigger>
            ))}
          </TabsList>

          <ScrollBar orientation="horizontal" />
        </Tabs>
      </ScrollArea>

      <div className="w-full pt-4">
        <DataTable
          data={data || []}
          columns={columns}
          filters={["reference", "name"]}
          isLoading={isPending}
        />
      </div>
    </div>
  )
}