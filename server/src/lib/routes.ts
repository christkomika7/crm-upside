import Elysia from "elysia";

import { userRoutes } from "../modules/user/user.route";
import { ownerRoutes } from "../modules/owner/owner.route";
import { taxRoutes } from "../modules/tax/tax.route";
import { noteRoutes } from "../modules/note/note.route";
import { lotTypeRoutes } from "../modules/lot-type/lot-type.route";
import { buildingRoutes } from "../modules/building/building.route";
import { typeRoutes } from "../modules/type/type.route";
import { unitRoutes } from "../modules/unit/unit.route";
import { tenantRoutes } from "../modules/tenant/tenant.route";
import { rentalRoutes } from "../modules/rental/rental.route";
import { referenceRoutes } from "../modules/reference/reference.route";
import { deletionRoutes } from "../modules/deletion/deletion.route";
import { reservationRoutes } from "../modules/reservation/reservation.route";
import { personalServiceRoutes } from "../modules/personal-service/personal-service.route";
import { propertyManagementRoutes } from "../modules/property-mangement/property-mangement.route";
import { productServiceRoutes } from "../modules/product-service/product-service.route";
import { invoiceRoutes } from "../modules/invoice/invoice.route";
import { documentRoutes } from "../modules/document/document.route";
import { quoteRoutes } from "../modules/quote/quote.route";
import { contractRoutes } from "../modules/contract/contract.route";
import { clientRoutes } from "../modules/client/client.route";
import { appointmentRoutes } from "../modules/appointment/appointment.route";

export const route = new Elysia()
    .use(userRoutes)
    .use(deletionRoutes)
    .use(ownerRoutes)
    .use(taxRoutes)
    .use(noteRoutes)
    .use(referenceRoutes)
    .use(lotTypeRoutes)
    .use(buildingRoutes)
    .use(typeRoutes)
    .use(unitRoutes)
    .use(tenantRoutes)
    .use(rentalRoutes)
    .use(reservationRoutes)
    .use(personalServiceRoutes)
    .use(propertyManagementRoutes)
    .use(productServiceRoutes)
    .use(clientRoutes)
    .use(invoiceRoutes)
    .use(quoteRoutes)
    .use(contractRoutes)
    .use(appointmentRoutes)
    .use(documentRoutes)
    .use(deletionRoutes)