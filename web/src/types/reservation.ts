export type ReservationTab = {
    id: string;
    name: string;
    unit: string;
    start: string;
    end: string;
    isDeleting: boolean;
    rent: string;
    charges: string;
    createdAt: Date
}

export type Reservation = {
    id: string;
    name: string;
    contact: string;
    start: Date;
    end: Date;
    price: string;
    unitId: string;
    createdAt: Date;
    updatedAt: Date;
}