import Decimal from "decimal.js";
import type {
  CalculateTaxesInput,
  CalculateTaxesResult,
  TaxResult,
} from "@/types/tax";

function parseTaxValue(taxValue: string): Decimal {
  const cleaned = taxValue.replace(/[%\s]/g, "");
  return new Decimal(cleaned || "0");
}

function applyDiscount(
  basePrice: Decimal,
  discount: Decimal,
  discountType: "PERCENT" | "MONEY"
): Decimal {
  if (discountType === "MONEY") {
    return Decimal.max(new Decimal(0), basePrice.minus(discount));
  } else {
    const discountAmount = basePrice.mul(discount).div(100);
    return Decimal.max(new Decimal(0), basePrice.minus(discountAmount));
  }
}

function roundToOneDecimal(value: Decimal): Decimal {
  return value.mul(10).round().div(10);
}

export function calculateTaxes(
  input: CalculateTaxesInput
): CalculateTaxesResult {
  const { items, taxes = [], discount, amountType = "HT" } = input;

  if (!items || items.length === 0) {
    return {
      taxes: [],
      totalTax: new Decimal(0),
      totalWithTaxes: new Decimal(0),
      totalWithoutTaxes: new Decimal(0),
      currentPrice: new Decimal(0),
      SubTotal: new Decimal(0),
      subTotal: new Decimal(0),
      subtotal: new Decimal(0),
      discountAmount: new Decimal(0),
    };
  }

  const taxResults = new Map<string, TaxResult>();
  let totalHT = new Decimal(0);
  let totalHTWithTaxable = new Decimal(0);
  let globalDiscountAmount = new Decimal(0);

  // -----------------------------
  // Initialisation des taxes
  // -----------------------------
  for (const tax of taxes) {
    taxResults.set(tax.name, {
      taxName: tax.name,
      appliedRates: [],
      totalTax: new Decimal(0),
      totalTaxMain: new Decimal(0),
      taxPrice: new Decimal(0),
      cumulsDetails: [],
    });
  }

  // -----------------------------
  // 1. Calcul des items
  // -----------------------------
  for (const item of items) {
    const basePrice = new Decimal(item.price);
    const quantity = new Decimal(Math.max(0.5, item.quantity));
    const itemTotal = basePrice.mul(quantity);

    const itemTotalWithDiscount = applyDiscount(
      itemTotal,
      new Decimal(item.discount || 0),
      item.discountType || "PERCENT"
    );

    const roundedItemTotal = roundToOneDecimal(itemTotalWithDiscount);

    totalHT = totalHT.plus(roundedItemTotal);

    if (item.hasTax) {
      totalHTWithTaxable = totalHTWithTaxable.plus(roundedItemTotal);
    }
  }

  const SubTotal = roundToOneDecimal(totalHT);

  // -----------------------------
  // 2. Remise globale
  // -----------------------------
  if (discount) {
    const [discountValue, discountType] = discount;
    const decDiscountValue = new Decimal(discountValue);
    const totalHTBeforeDiscount = totalHT;

    if (discountType === "MONEY") {
      globalDiscountAmount = decDiscountValue;
      totalHT = totalHT.minus(globalDiscountAmount);

      if (totalHTWithTaxable.greaterThan(0)) {
        const proportion = totalHTWithTaxable.div(totalHTBeforeDiscount);
        totalHTWithTaxable = totalHTWithTaxable.minus(
          globalDiscountAmount.mul(proportion)
        );
      }
    } else {
      globalDiscountAmount = totalHT.mul(decDiscountValue).div(100);
      totalHT = totalHT.minus(globalDiscountAmount);

      totalHTWithTaxable = totalHTWithTaxable.minus(
        totalHTWithTaxable.mul(decDiscountValue).div(100)
      );
    }
  }

  totalHT = roundToOneDecimal(totalHT);
  totalHTWithTaxable = roundToOneDecimal(totalHTWithTaxable);
  globalDiscountAmount = roundToOneDecimal(globalDiscountAmount);

  const subTotal = roundToOneDecimal(totalHT);

  // -----------------------------
  // 3. Calcul des taxes principales
  // -----------------------------
  for (const tax of taxes) {
    const taxResult = taxResults.get(tax.name)!;
    const rate = parseTaxValue(tax.value);

    const taxAmount = totalHTWithTaxable.mul(rate).div(100);

    taxResult.taxPrice = totalHTWithTaxable;
    taxResult.totalTaxMain = roundToOneDecimal(taxAmount);
    taxResult.totalTax = roundToOneDecimal(taxAmount);
    taxResult.appliedRates = [rate.toNumber()];
  }

  // -----------------------------
  // 4. Gestion des cumuls (CORRIGÉ)
  // -----------------------------
  for (const tax of taxes) {
    if (!tax.cumuls || tax.cumuls.length === 0) continue;

    const currentTaxResult = taxResults.get(tax.name);
    if (!currentTaxResult) continue;

    for (const c of tax.cumuls) {
      const cumulRate = parseTaxValue(c.value);

      // ✅ Correction : calcul basé sur la taxe parent
      const cumulAmount = currentTaxResult.totalTaxMain
        .mul(cumulRate)
        .div(100);

      currentTaxResult.cumulsDetails.push({
        from: c.name,
        rate: cumulRate.toNumber(),
        amount: roundToOneDecimal(cumulAmount).toNumber(),
      });
    }

    // recalcul total taxe avec cumuls
    currentTaxResult.totalTax = roundToOneDecimal(
      currentTaxResult.totalTaxMain.plus(
        currentTaxResult.cumulsDetails.reduce(
          (acc, cd) => acc.plus(cd.amount),
          new Decimal(0)
        )
      )
    );
  }

  // -----------------------------
  // 5. Total général des taxes
  // -----------------------------
  let totalTaxAmount = new Decimal(0);

  for (const taxResult of taxResults.values()) {
    totalTaxAmount = totalTaxAmount.plus(taxResult.totalTax);
  }

  totalTaxAmount = roundToOneDecimal(totalTaxAmount);

  const totalWithTaxes = roundToOneDecimal(
    totalHT.plus(totalTaxAmount)
  );

  const currentPrice =
    amountType === "TTC" ? totalWithTaxes : totalHT;

  return {
    taxes: Array.from(taxResults.values()),
    totalTax: totalTaxAmount,
    totalWithTaxes,
    totalWithoutTaxes: totalHT,
    currentPrice,
    SubTotal,
    subTotal,
    subtotal: totalHT,
    discountAmount: globalDiscountAmount,
  };
}