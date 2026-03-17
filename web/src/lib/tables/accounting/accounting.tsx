import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDownIcon, Edit3Icon, EyeIcon, Trash2Icon } from "lucide-react";

type KeyType = "id" | "date" | "type" | "entry" | "category" | "nature-1" | "nature-2" | "nature-3" |
    "description" | "amount" | "tax" | "method" | "check" | "doc-ref" | "allocation" |
    "source" | "paid-for" | "comment" | "createdAt";

export const data: Record<KeyType, string | number | Date>[] = [
    {
        id: "1",
        date: "2023-01-01",
        type: "Dépense",
        entry: "income",
        category: "Maintenance",
        "nature-1": "Plomberie",
        "nature-2": "Réparation",
        "nature-3": "Urgence",
        description: "Réparation fuite",
        amount: 120000,
        tax: 18,
        method: "Virement",
        check: "CHK001",
        "doc-ref": "DOC001",
        allocation: "Appartement A",
        source: "Interne",
        "paid-for": "Propriétaire",
        comment: "RAS",
        createdAt: new Date("2023-01-01"),
    },
    {
        id: "2",
        date: "2023-01-02",
        type: "Revenu",
        entry: "outcome",
        category: "Loyer",
        "nature-1": "Location",
        "nature-2": "Mensuel",
        "nature-3": "Standard",
        description: "Paiement loyer",
        amount: 316000,
        tax: 0,
        method: "Mobile Money",
        check: "CHK002",
        "doc-ref": "DOC002",
        allocation: "Appartement B",
        source: "Client",
        "paid-for": "Locataire",
        comment: "Payé à temps",
        createdAt: new Date("2023-01-02"),
    },
    {
        id: "3",
        date: "2023-01-05",
        type: "Dépense",
        entry: "outcome",
        category: "Électricité",
        "nature-1": "Facture",
        "nature-2": "Mensuel",
        "nature-3": "Standard",
        description: "Facture électricité",
        amount: 85000,
        tax: 18,
        method: "Espèces",
        check: "CHK003",
        "doc-ref": "DOC003",
        allocation: "Immeuble C",
        source: "Fournisseur",
        "paid-for": "Copropriété",
        comment: "Facture janvier",
        createdAt: new Date("2023-01-05"),
    },
    {
        id: "4",
        date: "2023-01-10",
        type: "Revenu",
        entry: "income",
        category: "Loyer",
        "nature-1": "Location",
        "nature-2": "Mensuel",
        "nature-3": "Standard",
        description: "Loyer janvier",
        amount: 450000,
        tax: 0,
        method: "Virement",
        check: "CHK004",
        "doc-ref": "DOC004",
        allocation: "Appartement D",
        source: "Client",
        "paid-for": "Locataire",
        comment: "Paiement conforme",
        createdAt: new Date("2023-01-10"),
    },
    {
        id: "5",
        date: "2023-01-15",
        type: "Dépense",
        entry: "outcome",
        category: "Maintenance",
        "nature-1": "Peinture",
        "nature-2": "Rénovation",
        "nature-3": "Planifié",
        description: "Peinture appartement",
        amount: 250000,
        tax: 18,
        method: "Chèque",
        check: "CHK005",
        "doc-ref": "DOC005",
        allocation: "Appartement E",
        source: "Prestataire",
        "paid-for": "Propriétaire",
        comment: "Travaux terminés",
        createdAt: new Date("2023-01-15"),
    },
    {
        id: "6",
        date: "2023-01-18",
        type: "Revenu",
        entry: "income",
        category: "Caution",
        "nature-1": "Dépôt",
        "nature-2": "Initial",
        "nature-3": "Standard",
        description: "Dépôt de garantie",
        amount: 632000,
        tax: 0,
        method: "Virement",
        check: "CHK006",
        "doc-ref": "DOC006",
        allocation: "Appartement F",
        source: "Client",
        "paid-for": "Locataire",
        comment: "Nouveau bail",
        createdAt: new Date("2023-01-18"),
    },
    {
        id: "7",
        date: "2023-01-20",
        type: "Dépense",
        entry: "outcome",
        category: "Eau",
        "nature-1": "Facture",
        "nature-2": "Mensuel",
        "nature-3": "Standard",
        description: "Facture eau",
        amount: 42000,
        tax: 18,
        method: "Mobile Money",
        check: "CHK007",
        "doc-ref": "DOC007",
        allocation: "Immeuble G",
        source: "Fournisseur",
        "paid-for": "Copropriété",
        comment: "Consommation normale",
        createdAt: new Date("2023-01-20"),
    },
    {
        id: "8",
        date: "2023-01-22",
        type: "Dépense",
        entry: "outcome",
        category: "Maintenance",
        "nature-1": "Climatisation",
        "nature-2": "Réparation",
        "nature-3": "Urgence",
        description: "Réparation climatiseur",
        amount: 180000,
        tax: 18,
        method: "Espèces",
        check: "CHK008",
        "doc-ref": "DOC008",
        allocation: "Appartement H",
        source: "Technicien",
        "paid-for": "Propriétaire",
        comment: "Intervention rapide",
        createdAt: new Date("2023-01-22"),
    },
    {
        id: "9",
        date: "2023-01-25",
        type: "Revenu",
        entry: "income",
        category: "Loyer",
        "nature-1": "Location",
        "nature-2": "Mensuel",
        "nature-3": "Standard",
        description: "Paiement loyer",
        amount: 380000,
        tax: 0,
        method: "Virement",
        check: "CHK009",
        "doc-ref": "DOC009",
        allocation: "Appartement I",
        source: "Client",
        "paid-for": "Locataire",
        comment: "Paiement ponctuel",
        createdAt: new Date("2023-01-25"),
    },
    {
        id: "10",
        date: "2023-01-28",
        type: "Dépense",
        entry: "outcome",
        category: "Sécurité",
        "nature-1": "Gardiennage",
        "nature-2": "Mensuel",
        "nature-3": "Standard",
        description: "Salaire gardien",
        amount: 150000,
        tax: 0,
        method: "Espèces",
        check: "CHK010",
        "doc-ref": "DOC010",
        allocation: "Immeuble J",
        source: "Personnel",
        "paid-for": "Copropriété",
        comment: "Salaire janvier",
        createdAt: new Date("2023-01-28"),
    },
]

export const columns: ColumnDef<Record<KeyType, string | number | Date>>[] = [
    {
        accessorKey: "date",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Date
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div>{row.getValue("date")}</div>
        ),
    },
    {
        accessorKey: "type",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Type
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className={cn("capitalize", {
                "text-green-500": row.getValue("type") === "Revenu",
                "text-red-500": row.getValue("type") === "Dépense"
            })}>{row.getValue("type")}</div>
        ),
    },
    {
        accessorKey: "category",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Catégorie
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("category")}</div>
        ),
    },
    {
        accessorKey: "nature-1",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Nature 1
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("nature-1")}</div>
        ),
    },
    {
        accessorKey: "nature-2",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Nature 2
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("nature-2")}</div>
        ),
    },
    {
        accessorKey: "nature-3",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Nature 3
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("nature-3")}</div>
        ),
    },
    {
        accessorKey: "description",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Description
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("description")}</div>
        ),
    },
    {
        accessorKey: "amount",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Montant
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("amount"))
            const formatted = new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "XAF",
            }).format(amount)
            return <div className="font-medium">{formatted}</div>
        },
    },
    {
        accessorKey: "tax",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Taxe (%)
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div>{row.getValue("tax")}%</div>
        ),
    },
    {
        accessorKey: "method",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Méthode
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("method")}</div>
        ),
    },
    {
        accessorKey: "check",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Chèque
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div>{row.getValue("check")}</div>
        ),
    },
    {
        accessorKey: "doc-ref",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Réf. Doc
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div>{row.getValue("doc-ref")}</div>
        ),
    },
    {
        accessorKey: "allocation",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Affectation
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("allocation")}</div>
        ),
    },
    {
        accessorKey: "source",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Source
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("source")}</div>
        ),
    },
    {
        accessorKey: "paid-for",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Payé pour
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("paid-for")}</div>
        ),
    },
    {
        accessorKey: "comment",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="text-sm! font-medium cursor-pointer text-left pl-0!"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Commentaire
                    <ArrowUpDownIcon className="size-3.5 text-neutral-500" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div>{row.getValue("comment")}</div>
        ),
    },
    {
        id: "actions",
        header: "Actions",
        enableHiding: false,
        cell: ({ row }) => {
            return (
                <div className="flex gap-x-2">
                    <Link to="/dashboard/accounting/edit-accounting/$id"
                        params={{ id: `edit_accounting-${row.original.id}` }}
                        search={{ type: row.original.entry }}
                    >
                        <Button variant="outline" className="size-7.5 rounded-lg"><Edit3Icon className="size-3.5" /></Button>
                    </Link>
                    <Link to="/dashboard/accounting/$id"
                        params={{ id: `view_accounting-${row.original.id}` }}
                    >
                        <Button variant="secondary" className="size-7.5 rounded-lg"><EyeIcon className="size-3.5" /></Button>
                    </Link>
                    <Button variant="destructive" className="size-7.5 rounded-lg bg-red-400"><Trash2Icon className="size-3.5" /></Button>
                </div>
            )
        },
    },
]