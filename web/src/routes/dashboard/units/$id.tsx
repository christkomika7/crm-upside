import PropertyCard, { type DataRow } from '@/components/card/property-card';
import ActionHeader from '@/components/header/action-header'
import { Status, StatusIndicator, StatusLabel } from '@/components/ui/status';
import { apiFetch } from '@/lib/api';
import { canAccess } from '@/lib/permission';
import { urlToFile } from '@/lib/upload';
import { formatNumber } from '@/lib/utils';
import type { Unit } from '@/types/unit';
import type { User } from '@/types/user';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, notFound, redirect, useParams } from '@tanstack/react-router'
import Decimal from 'decimal.js';
import { Activity } from 'react';

export const Route = createFileRoute('/dashboard/units/$id')({
  component: RouteComponent,
  beforeLoad({ context }) {
    const user = context.session.data?.user as unknown as User;
    const permission = user.permission?.permissions;
    const hasAccess = canAccess(permission, "units", ['read']);
    if (!user) {
      throw redirect({ to: "/", search: { redirect: location.href } });
    }
    if (!hasAccess) throw notFound()
  },
})

function RouteComponent() {
  const param = useParams({ from: "/dashboard/units/$id" })
  const id = param.id.split("view_unit-")[1];

  const { data: unit, isPending } = useQuery({
    queryKey: ["unit", id],
    queryFn: () => apiFetch<Unit>(`/unit/${id}`),
  });

  return <div className='space-y-6'>
    <ActionHeader />
    <PropertyCard
      isLoading={isPending}
      files={unit?.documents}
      urlToFile={urlToFile}
      title={unit?.reference}
      about={"Belle villa moderne avec vue dégagée, entourée d'un jardin tropical. Idéale pour famille ou investissement locatif."}
      data={[
        { property: "Nom", value: unit?.building.name || "" },
        { property: "Référence", value: unit?.reference || "" },
        { property: "Type", value: unit?.type.name || "" },
        { property: "Étage", value: unit?.building.name || "" },
        {
          property: "Status", value: <Status variant={unit?.status === 'vacant' ? "success" : "warning"}>
            <Activity mode={unit?.status === 'vacant' ? 'visible' : 'hidden'}>
              <StatusIndicator />
            </Activity>
            <StatusLabel>{unit?.status === 'vacant' ? 'Libre' : 'Occupé'}</StatusLabel>
          </Status>
        },
        { property: "Surface", value: `${unit?.surface} m²` || "" },
        {
          property: "Nombre de pièce", value: new Decimal(unit?.livingroom || 0)
            .plus(unit?.bathroom || 0)
            .plus(unit?.bedroom || 0)
            .plus(unit?.dining || 0)
            .plus(unit?.kitchen || 0)
            .toString() || ""
        },
        { property: "Service", value: unit?.service || "Aucun" },

      ]}
    />
    <div className='grid grid-cols-3 gap-6'>
      <div className='space-y-1'>
        <h2 className='font-medium'>Information du locataire</h2>
        <PropertyCard
          isLoading={isPending}
          size={100}
          data={[
            { property: "Nom", value: unit?.tenantName || "" },
            { property: "Email", value: unit?.tenantEmail || "" },
            { property: "Numéro de téléphone", value: unit?.tenantContact || "" },
          ]}
        />
      </div>
      <div className='space-y-1'>
        <h2 className='font-medium'>Loyer & Charges</h2>
        <PropertyCard
          isLoading={isPending}
          size={100}
          data={[
            { property: "Loyer mensuel", value: `${formatNumber(unit?.rent)} FCFA` || "" },
            { property: "Charges", value: `${formatNumber(unit?.charges)} FCFA` || "" },
          ]}
        />
      </div>
      <div className='space-y-1'>
        <h2 className='font-medium'>Due par le locataire</h2>
        <PropertyCard
          isLoading={isPending}
          size={100}
          data={[
            { property: "TSIL", value: unit?.building.name || "" },
            { property: "Frais d’enregistrement", value: unit?.reference || "" },
          ]}
        />
      </div>

    </div>
  </div>
}
