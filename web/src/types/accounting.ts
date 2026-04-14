export type AccountElement = {
    id: string;
    name: string;
}

export type AccountingTab = {
    id: string;
    type: "INCOME" | "OUTCOME";
    date: string;
    category: string;
    nature: string;
    secondNature: string;
    thirdNature: string;
    description: string;
    amount: string;
    amountType: "TTC" | "HT";
    paymentMode: string;
    checkNumber: string;
    unit: string;
    period: string;
    allocation: string;
    source: string;
    documents: string[];
}


export type IncomeAccounting = {
    id: string;
    date: Date;
    paymentMode: "CASH" | "BANK" | "CHECK";
    amount: string;
    isTTC: boolean;
    description: string;
    categoryId: string;
    natureId: string;
    secondNatureId?: string;
    thirdNatureId?: string;
    allocationId?: string;
    sourceId: string;
    documents: string[];
}

export type OutcomeAccounting = {
    id: string;
    date: Date;
    paymentMode: "CASH" | "BANK" | "CHECK";
    amount: string;
    isTTC: boolean;
    description: string;
    categoryId: string;
    natureId: string;
    checkNumber?: string;
    secondNatureId?: string;
    thirdNatureId?: string;
    allocationId?: string;
    unitId?: string;
    period?: string;
    sourceId: string;
    documents: string[];
}

export type IncomeAccountingFile = Omit<IncomeAccounting, "documents"> & {
    documents: File[];
}

export type OutcomeAccountingFile = Omit<OutcomeAccounting, "documents"> & {
    documents: File[];
}