import Decimal from "decimal.js";
import { cn, formatNumber } from "@/lib/utils";
import type { Document } from "@/types/document";
import { calculateTaxes } from "@/lib/price";


type DocumentPreviewProps = {
    id: string;
    title: string;
    type: 'INVOICE' | 'QUOTE' | "PURCHASE_ORDER";
    data: Document
};

export default function RecordDocument({
    title,
    type,
    data
}: DocumentPreviewProps) {
    const id = data.id;
    const position = data.upside.design.position as "LEFT" | "MIDDLE" | "RIGHT";
    const size = data.upside.design.size as "SMALL" | "MEDIUM" | "LARGE";
    const logo = data.upside.design.logo;
    const firstColor = data.upside.design.line;
    const secondColor = data.upside.design.background;

    const reference = data.reference;
    const issue = data.issue;
    const clientCompany = type === "PURCHASE_ORDER" ? data.upside.serviceProvider.company : data.upside.client.company;
    const clientAddress = type === "PURCHASE_ORDER" ? data.upside.serviceProvider.address : data.upside.client.address;
    const clientEmail = type === "PURCHASE_ORDER" ? data.upside.serviceProvider.email : data.upside.client.email;

    const company = data.upside.company;
    const address = data.upside.address;
    const bp = data.upside.bp;
    const city = data.upside.city;
    const country = data.upside.country;
    const email = data.upside.email;
    const website = data.upside.website;
    const phone = data.upside.phone;
    const rccm = data.upside.rccm;
    const nif = data.upside.nif;

    const items = data.items;
    const discount = [data.discount, data.discountType] as [number, "PERCENT" | "MONEY"];
    const amountType = data.amountType;
    const note = data.note


    const total = new Decimal(data.amount);
    const paid = new Decimal(data?.amountPaid ?? 0);
    const due = total.minus(paid);


    const result = calculateTaxes({
        items: items.map((item) => ({
            ...item,
            price: item.type === "ITEM" ? item.price : new Decimal(item.price).plus(new Decimal(item.charges || 0)).plus(new Decimal(item.extraCharges || 0)).toNumber()
        })),
        taxes: data.taxes ?? [],
        discount,
        amountType: data.amountType,
        taxOperation: "sequence"
    });

    return (
        <div id={id} className="py-8 min-w-[595px] text-xs text-[#464646] font-sans">
            <div
                className={cn("flex w-full h-[155px] px-7 items-center", {
                    "justify-start": position === "LEFT",
                    "justify-center": position === "MIDDLE",
                    "justify-end": position === "RIGHT"
                })}
            >
                <div
                    className={cn(
                        "relative flex justify-center  items-center object-center object-contain",
                        {
                            "h-[80px]": size === "SMALL",
                            "h-[120px]": size === "MEDIUM",
                            "h-[160px]": size === "LARGE"
                        }

                    )}
                >
                    {logo ?
                        <img
                            src={logo}
                            alt="Logo"
                            width={160}
                            height={160}
                            className="w-full h-full object-contain"
                        />
                        : <h2 className="font-bold text-4xl!">LOGO</h2>
                    }
                </div>
            </div>
            <div
                className="w-full h-[3.19px]"
                style={{
                    backgroundColor: firstColor,
                }}
            ></div>
            <div
                className="relative grid grid-cols-2 gap-x-2 mb-[38.26px] py-5 px-7"
                style={{
                    backgroundColor: secondColor,
                }}
            >
                <div
                    className="-bottom-3 left-1/2 absolute w-6 h-6 -translate-x-1/2"
                    style={{
                        backgroundColor: secondColor,
                        transform: 'rotate(45deg)',
                    }}
                ></div>

                <div style={{ display: "flex", flexDirection: "column", }}>
                    <p style={{
                        display: "grid",
                        gridTemplateColumns: "80px 1fr",
                        columnGap: "69px",
                        marginBottom: "1px",

                    }}>
                        <span className="font-medium">{type === "INVOICE" ? "Facture" : type === "PURCHASE_ORDER" ? "Bon de commande" : "Devis"} N° :</span>
                        <span className="font-normal">{reference}</span>
                    </p>

                    <p style={{ display: "grid", gridTemplateColumns: "80px 1fr", columnGap: "69px", marginBottom: "1px", }}>
                        <span className="font-medium">Date :</span>
                        <span className="font-normal">
                            {issue}
                        </span>
                    </p>

                    <p style={{ display: "grid", gridTemplateColumns: "80px 1fr", columnGap: "69px", }}>
                        <span className="font-medium">À :</span>
                        <span className="font-normal">
                            {clientCompany} <br />
                            {clientEmail} <br />
                            {clientAddress}
                        </span>
                    </p>
                </div>

                <div >
                    <h2 className="font-black text-[1.275rem]! mb-[12px] text-right">
                        {title}
                    </h2>
                    <div className="">
                        <p className="text-right mb-px">
                            {address}
                        </p>
                        <p className="mb-px text-right">
                            BP: {bp}
                        </p>
                        <p className="mb-px text-right">
                            {city},{" "}
                            {country}
                        </p>
                        <p className="mb-px text-right">
                            {email}
                        </p>
                        {website && (
                            <p className="mb-px text-right">
                                <a target="_blank" href={website}>
                                    {website}
                                </a>
                            </p>
                        )}
                        <p className="mb-px text-right">
                            {phone}
                        </p>
                        <p className="mb-px text-right">
                            RCCM: {rccm}
                        </p>
                        <p className="text-right">
                            NIF: {nif}
                        </p>
                    </div>
                </div>
            </div>
            <div className="w-full text-sm">
                {/* HEADER */}
                <div className="grid grid-cols-[1fr_40px_140px_180px] border-y border-[#bfbfbf] h-12 items-center font-bold">
                    <div className="pl-[27px]">Article</div>
                    <div className="text-right">Qté</div>
                    <div className="text-right">Prix unitaire</div>
                    <div className="pr-[27px] text-right">Prix total</div>
                </div>

                {/* BODY */}
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="grid grid-cols-[1fr_40px_140px_180px] py-2"
                    >
                        {/* ARTICLE */}
                        <div className="pl-7 pr-4">
                            <p className="mb-[3px] font-semibold">
                                {item.reference} {!item.hasTax && <span className="text-blue">*</span>}
                            </p>

                            <p className="whitespace-pre-wrap mb-[8px] leading-snug">
                                {item.description}
                            </p>
                        </div>

                        {/* QTE */}
                        <div className="text-right">{item.quantity}</div>

                        {/* PRIX UNITAIRE */}
                        <div className="text-right">
                            {item.type === "ITEM" ? formatNumber(item.price) : formatNumber(new Decimal(item.price).plus(new Decimal(item.charges || 0)).plus(new Decimal(item.extraCharges || 0)).toNumber())} FCFA
                        </div>

                        {/* PRIX TOTAL */}
                        <div className="pr-[27px] text-right">
                            {formatNumber(item.type === "ITEM" ? item.price * item.quantity : new Decimal(item.price).plus(new Decimal(item.charges || 0)).plus(new Decimal(item.extraCharges || 0)).toNumber() * item.quantity)} FCFA
                        </div>
                    </div>
                ))}

                {/* FOOTER */}
                <div className="mt-6 space-y-2">
                    {/* Sous-total */}
                    <div className="grid grid-cols-[1fr_240px]">
                        <div className="text-right pr-4">Sous-total</div>
                        <div className="pr-[27px] text-right">
                            {formatNumber(result.SubTotal.toNumber())} FCFA
                        </div>
                    </div>

                    {/* Remise */}
                    <div className="grid grid-cols-[1fr_240px]">
                        {discount.length === 2 && (
                            <div className="text-right pr-4">
                                Remise {discount[0]} {discount[1] === "PERCENT" ? "%" : "FCFA"}
                            </div>
                        )}
                        <div className="pr-[27px] text-right">
                            {formatNumber(result.discountAmount.toNumber())} FCFA
                        </div>
                    </div>

                    {/* Sous-total */}
                    <div className="grid grid-cols-[1fr_240px]">
                        <div className="text-right pr-4">Sous-total</div>
                        <div className="pr-[27px] text-right">
                            {formatNumber(result.subTotal.toNumber())} FCFA
                        </div>
                    </div>
                    {/* Taxes */}
                    {amountType === "TTC" &&
                        result.taxes.map((tax) => (
                            <div key={tax.taxName} className="grid grid-cols-[1fr_240px]">
                                <div className="text-right pr-4">
                                    {tax.taxName}
                                </div>
                                <div className="pr-[27px] text-right">
                                    {formatNumber(tax.totalTax.toNumber())} FCFA
                                </div>
                            </div>
                        ))
                    }

                    {/* Total TTC */}
                    {amountType === "TTC" && (
                        <div className="grid grid-cols-[1fr_240px]">
                            <div className="text-right pr-4">
                                Total TTC
                            </div>
                            <div className="pr-[27px] text-right">
                                {formatNumber(result.totalWithTaxes.toNumber())} FCFA
                            </div>
                        </div>
                    )}

                    <div className="h-2"></div>

                    {(type === "INVOICE" || type === "PURCHASE_ORDER") && paid && (
                        <>
                            {/* Payé */}
                            <div className="grid grid-cols-[1fr_240px]">
                                <div className="text-right pr-4">
                                    Payé
                                </div>
                                <div className="pr-[27px] text-right">
                                    {formatNumber(paid.toNumber())} FCFA
                                </div>
                            </div>
                            {/* TOTAL */}
                            <div
                                className="grid grid-cols-[1fr_240px] py-3 text-2xl font-black"
                                style={{ backgroundColor: secondColor }}
                            >
                                <div className="text-right pr-4">Net à payer</div>
                                <div className="pr-[27px] text-right">
                                    {formatNumber(due.toNumber())} FCFA
                                </div>
                            </div>
                        </>
                    )}

                </div>
            </div>
            <div className="px-7 mt-[65px]" >
                <h3 style={{ marginBottom: "7px", fontWeight: 600, }}>
                    Message / remarques
                </h3>

                <p style={{ marginBottom: "3px", }}>
                    Campagne : {company}
                </p>

                <h3 style={{ marginBottom: "3px" }}>NB :</h3>
                <pre
                    className="font-sans text-xs text-[#464646] whitespace-pre-wrap wrap-break-word max-w-[400px] leading-snug "
                >
                    {note}
                </pre>
            </div>
        </div>
    );
}