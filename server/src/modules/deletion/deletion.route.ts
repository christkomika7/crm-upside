import { Elysia } from "elysia"
import { authPlugin } from "../auth/auth"
import request from "./type";
import { canAccess } from "../auth/permission";
import { prisma } from "../../lib/prisma";
import { deleteFile } from "../../lib/storage";
import { formatDateToString, generateRef } from "../../lib/utils";

export const deletionRoutes = new Elysia({ prefix: "/deletion" })
    .use(authPlugin)
    .get("/by", async ({ status, permission, query, user }) => {
        if (!canAccess(permission, "settings", "read")) {
            return status(403, { message: "Accès refusé" });
        }

        const type = query.type;

        if (!type) return status(404, { message: "Aucun type trouvé." });

        const deletions = await prisma.deletion.findMany({
            where: {
                type,
                state: "WAIT"
            },
        });

        switch (type) {
            case "BUILDING":
                const buildingDeltion = [];
                for (const deletion of deletions) {
                    const building = await prisma.building.findUnique({
                        where: { id: deletion.recordId }
                    });

                    if (!building) return status(400, { message: "Aucun bàtiment trouvée." });

                    buildingDeltion.push({
                        id: deletion.id,
                        type: deletion.type,
                        reference: `${building.reference}`,
                        name: building.name,
                        date: formatDateToString(deletion.createdAt),
                        actionBy: user.name
                    });
                }
                return buildingDeltion;
            case "OWNER":
                const ownerParsed = [];
                for (const deletion of deletions) {
                    const owner = await prisma.owner.findUnique({
                        where: { id: deletion.recordId }
                    });

                    if (!owner) return status(400, { message: "Aucun propriétaire trouvé." });

                    ownerParsed.push({
                        id: deletion.id,
                        type: deletion.type,
                        reference: owner.reference,
                        name: `${owner.firstname} ${owner.lastname}`,
                        date: formatDateToString(deletion.createdAt),
                        actionBy: user.name
                    });
                }
                return ownerParsed;
            case "TENANT":
                const tenantParsed = [];
                let tenantIndex = 0;
                for (const deletion of deletions) {
                    const tenant = await prisma.tenant.findUnique({
                        where: { id: deletion.recordId }
                    });

                    if (!tenant) return status(400, { message: "Aucun locataire trouvé." });

                    tenantParsed.push({
                        id: deletion.id,
                        reference: `${tenantIndex + 1}`,
                        type: deletion.type,
                        name: `${tenant.firstname} ${tenant.lastname}`,
                        date: formatDateToString(deletion.createdAt),
                        actionBy: user.name
                    });
                }
                return tenantParsed;
            case "UNIT":
                const unitParsed = [];
                for (const deletion of deletions) {
                    const unit = await prisma.unit.findUnique({
                        where: { id: deletion.recordId },
                        include: { type: true }
                    });

                    if (!unit) return status(400, { message: "Aucune unitée trouvée." });

                    unitParsed.push({
                        id: deletion.id,
                        reference: unit.reference,
                        type: deletion.type,
                        name: unit.type.name,
                        date: formatDateToString(deletion.createdAt),
                        actionBy: user.name
                    });
                }
                return unitParsed;
            case "RENTAL":
                const rentalParsed = [];
                let index = 0;
                for (const deletion of deletions) {
                    const rental = await prisma.rental.findUnique({
                        where: { id: deletion.recordId },
                        include: { unit: true }
                    });

                    if (!rental) return status(400, { message: "Aucune location trouvée." });

                    rentalParsed.push({
                        id: deletion.id,
                        reference: index++,
                        type: deletion.type,
                        name: `Location unitée ${rental.unit.reference}`,
                        date: formatDateToString(deletion.createdAt),
                        actionBy: user.name
                    });
                }
                return rentalParsed;
            case "RESERVATION":
                const reservationParsed = [];
                let reservationIndex = 0;
                for (const deletion of deletions) {
                    const reservation = await prisma.reservation.findUnique({
                        where: { id: deletion.recordId }
                    });

                    if (!reservation) return status(400, { message: "Aucune réservation trouvée." });

                    reservationParsed.push({
                        id: deletion.id,
                        reference: `${reservationIndex + 1}`,
                        type: deletion.type,
                        name: reservation.name,
                        date: formatDateToString(deletion.createdAt),
                        actionBy: user.name
                    });
                }
                return reservationParsed;
            case "PROPERTY_MANAGEMENT":
                const propertyManagementParsed = [];
                let propertyManagementIndex = 0;
                for (const deletion of deletions) {
                    const propertyManagement = await prisma.propertyManagement.findUnique({
                        where: { id: deletion.recordId },
                        include: {
                            unit: true,
                            building: true
                        }
                    });

                    if (!propertyManagement) return status(400, { message: "Aucune gestion de propriété trouvée." });

                    propertyManagementParsed.push({
                        id: deletion.id,
                        reference: `${propertyManagementIndex + 1}`,
                        type: deletion.type,
                        name: propertyManagement.building.name + " - " + propertyManagement.unit.reference,
                        date: formatDateToString(deletion.createdAt),
                        actionBy: user.name
                    });
                }
                return propertyManagementParsed;
            case "PRODUCT_SERVICE":
                const productServiceParsed = [];
                for (const deletion of deletions) {
                    const productService = await prisma.productService.findUnique({
                        where: { id: deletion.recordId },
                    });

                    if (!productService) return status(400, { message: "Aucun service ou produit trouvé." });

                    productServiceParsed.push({
                        id: deletion.id,
                        reference: productService.reference,
                        type: deletion.type,
                        name: "-",
                        date: formatDateToString(deletion.createdAt),
                        actionBy: user.name
                    });
                }
                return productServiceParsed;
            case "INVOICING":
                const invoiceParsed = [];
                for (const deletion of deletions) {
                    const invoice = await prisma.invoice.findUnique({
                        where: { id: deletion.recordId },
                        include: {
                            owner: true,
                            tenant: true
                        }
                    });

                    if (!invoice) return status(400, { message: "Aucune facture trouvée." });

                    invoiceParsed.push({
                        id: deletion.id,
                        reference: invoice.reference,
                        type: deletion.type,
                        name: invoice.type === "OWNER" ? `${invoice.owner?.firstname} ${invoice.owner?.lastname}` : `${invoice.tenant?.firstname} ${invoice.tenant?.lastname}`,
                        date: formatDateToString(deletion.createdAt),
                        actionBy: user.name
                    });
                }
                return invoiceParsed;
            case "QUOTE":
                const quoteParsed = [];
                for (const deletion of deletions) {
                    const quote = await prisma.quote.findUnique({
                        where: { id: deletion.recordId },
                        include: {
                            owner: true,
                            tenant: true
                        }
                    });

                    if (!quote) return status(400, { message: "Aucune devis trouvé." });

                    quoteParsed.push({
                        id: deletion.id,
                        reference: quote.reference,
                        type: deletion.type,
                        name: quote.type === "OWNER" ? `${quote.owner?.firstname} ${quote.owner?.lastname}` : `${quote.tenant?.firstname} ${quote.tenant?.lastname}`,
                        date: formatDateToString(deletion.createdAt),
                        actionBy: user.name
                    });
                }
                return quoteParsed;
            case "CONTRACT":
                const contractParsed = [];
                for (const deletion of deletions) {
                    const contract = await prisma.contract.findUnique({
                        where: { id: deletion.recordId },
                        include: {
                            rental: {
                                include: {
                                    unit: true
                                }
                            },
                            building: true
                        }
                    });

                    if (!contract) return status(400, { message: "Aucun contrat trouvé." });
                    const reference = contract.type === "CONTRACT" ? contract.rental?.unit.reference : contract.building?.name;

                    contractParsed.push({
                        id: deletion.id,
                        reference: reference,
                        type: deletion.type,
                        name: "-",
                        date: formatDateToString(deletion.createdAt),
                        actionBy: user.name
                    });
                }
                return contractParsed;
            case "CHECK_IN":
            case "APPOINTMENT":
                const appointmentParsed = [];
                for (const deletion of deletions) {
                    const appointment = await prisma.appointment.findUnique({
                        where: { id: deletion.recordId },
                        include: {
                            owner: true,
                            tenant: true
                        }
                    });

                    if (!appointment) return status(400, { message: "Aucun rendez-vous trouvé." });

                    appointmentParsed.push({
                        id: deletion.id,
                        reference: appointment.type === "OWNER" ? `${appointment.owner?.firstname} ${appointment.owner?.lastname}` : `${appointment.tenant?.firstname} ${appointment.tenant?.lastname}`,
                        type: deletion.type,
                        name: "-",
                        date: formatDateToString(deletion.createdAt),
                        actionBy: user.name
                    });
                }
                return appointmentParsed;
            case "SERVICE_PROVIDER":
            case "COMMUNICATION":
        }
    }, { auth: true, query: request.query })
    .put("/:id", async ({ status, params, body, permission, user }) => {

        if (!canAccess(permission, "settings", "read")) {
            return status(403, { message: "Accès refusé." });
        }

        if (user.role !== "ADMIN") {
            return status(403, { message: "Accès autorisé uniquement pour l'administrateur." })
        }

        const [deletion, reference] = await prisma.$transaction([
            prisma.deletion.findUnique({
                where: { id: params.id }
            }),
            prisma.reference.findFirst()
        ])


        if (!deletion) return status(400, { message: "Identifiant invalide." })

        switch (body) {
            case "CANCEL":
                try {
                    const deletion = await prisma.deletion.update({
                        where: {
                            id: params.id
                        },
                        data: {
                            state: "NOTHING"
                        }
                    });

                    switch (deletion.type) {
                        case "BUILDING":
                            const [building] = await prisma.$transaction([
                                prisma.building.update({
                                    where: { id: deletion.recordId },
                                    data: {
                                        isDeleting: false
                                    }
                                }),
                                prisma.deletion.delete({
                                    where: { id: deletion.id }
                                })
                            ]);
                            return status(200, { message: `La suppression du bâtiment ${building.name} a été annulé avec succès.` });
                        case "OWNER":
                            const [owner] = await prisma.$transaction([
                                prisma.owner.update({
                                    where: { id: deletion.recordId },
                                    data: {
                                        isDeleting: false
                                    }
                                }),
                                prisma.deletion.delete({
                                    where: { id: deletion.id }
                                })
                            ]);
                            return status(200, { message: `La suppression du propriétaire ${owner.firstname} ${owner.lastname} a été annulé avec succès.` });
                        case "TENANT":
                            const [tenant] = await prisma.$transaction([
                                prisma.tenant.update({
                                    where: { id: deletion.recordId },
                                    data: {
                                        isDeleting: false
                                    }
                                }),
                                prisma.deletion.delete({
                                    where: { id: deletion.id }
                                })
                            ]);
                            return status(200, { message: `La suppression du locataire ${tenant.firstname} ${tenant.lastname} a été annulé avec succès.` });
                        case "UNIT":
                            const [unit] = await prisma.$transaction([
                                prisma.unit.update({
                                    where: { id: deletion.recordId },
                                    data: {
                                        isDeleting: false
                                    }
                                }),
                                prisma.deletion.delete({
                                    where: { id: deletion.id }
                                })
                            ]);
                            return status(200, { message: `La suppression de l'unité ${unit.reference} a été annulé avec succès.` });
                        case "RENTAL":
                            const [rental] = await prisma.$transaction([
                                prisma.rental.update({
                                    where: { id: deletion.recordId },
                                    data: {
                                        isDeleting: false
                                    },
                                    include: { unit: true }
                                }),
                                prisma.deletion.delete({
                                    where: { id: deletion.id }
                                })
                            ]);
                            return status(200, { message: `La suppression de la location de l'unité ${rental.unit.reference}  a été annulé avec succès.` });
                        case "RESERVATION":
                            const [reservation] = await prisma.$transaction([
                                prisma.reservation.update({
                                    where: { id: deletion.recordId },
                                    data: {
                                        isDeleting: false
                                    }
                                }),
                                prisma.deletion.delete({
                                    where: { id: deletion.id }
                                })
                            ]);
                            return status(200, { message: `La suppression de la reservation ${reservation.name} a été annulé avec succès.` });
                        case "PROPERTY_MANAGEMENT":
                            await prisma.$transaction([
                                prisma.propertyManagement.update({
                                    where: { id: deletion.recordId },
                                    data: {
                                        isDeleting: false
                                    }
                                }),
                                prisma.deletion.delete({
                                    where: { id: deletion.id }
                                })
                            ]);
                            return status(200, { message: `La suppression de la gestion de propriété a été annulé avec succès.` });
                        case "PRODUCT_SERVICE":
                            const [productService] = await prisma.$transaction([
                                prisma.productService.update({
                                    where: { id: deletion.recordId },
                                    data: {
                                        isDeleting: false
                                    }
                                }),
                                prisma.deletion.delete({
                                    where: { id: deletion.id }
                                })
                            ]);
                            return status(200, { message: `La suppression du service ou produit ${productService.reference} a été annulé avec succès.` });
                        case "INVOICING":
                            const [invoice] = await prisma.$transaction([
                                prisma.invoice.update({
                                    where: { id: deletion.recordId },
                                    data: {
                                        isDeleting: false
                                    }
                                }),
                                prisma.deletion.delete({
                                    where: { id: deletion.id }
                                })
                            ]);
                            return status(200, { message: `La suppression de la facture ${generateRef(reference?.invoice, invoice.reference)} a été annulé avec succès.` });
                        case "QUOTE":
                            const [quote] = await prisma.$transaction([
                                prisma.quote.update({
                                    where: { id: deletion.recordId },
                                    data: {
                                        isDeleting: false
                                    }
                                }),
                                prisma.deletion.delete({
                                    where: { id: deletion.id }
                                })
                            ]);
                            return status(200, { message: `La suppression du devis ${generateRef(reference?.quote, quote.reference)} a été annulé avec succès.` });
                        case "CONTRACT":
                            const [contract] = await prisma.$transaction([
                                prisma.contract.update({
                                    where: { id: deletion.recordId },
                                    data: {
                                        isDeleting: false
                                    }
                                }),
                                prisma.deletion.delete({
                                    where: { id: deletion.id }
                                })
                            ]);
                            return status(200, { message: `La suppression du contrat a été annulé avec succès.` });
                        case "CHECK_IN":
                        // const [checkIn] = await prisma.$transaction([
                        //     prisma.checkIn.update({
                        //         where: { id: deletion.recordId },
                        //         data: {
                        //             isDeleting: false
                        //         }
                        //     }),
                        //     prisma.deletion.delete({
                        //         where: { id: deletion.id }
                        //     })
                        // ]);
                        // return status(200, { message: `La suppression du check-in ${generateRef(reference?.checkIn, checkIn.reference)} a été annulé avec succès.` });
                        case "APPOINTMENT":
                            const [appointment] = await prisma.$transaction([
                                prisma.appointment.update({
                                    where: { id: deletion.recordId },
                                    data: {
                                        isDeleting: false
                                    },
                                    include: {
                                        owner: true,
                                        tenant: true
                                    }
                                }),
                                prisma.deletion.delete({
                                    where: { id: deletion.id }
                                })
                            ]);
                            return status(200, { message: `La suppression du rendez-vous ${appointment.type === "OWNER" ? `${appointment.owner?.firstname} ${appointment.owner?.lastname}` : `${appointment.tenant?.firstname} ${appointment.tenant?.lastname}`} a été annulé avec succès.` });
                        case "SERVICE_PROVIDER":
                        // const [serviceProvider] = await prisma.$transaction([
                        //     prisma.serviceProvider.update({
                        //         where: { id: deletion.recordId },
                        //         data: {
                        //             isDeleting: false
                        //         }
                        //     }),
                        //     prisma.deletion.delete({
                        //         where: { id: deletion.id }
                        //     })
                        // ]);
                        // return status(200, { message: `La suppression du prestataire ${generateRef(reference?.serviceProvider, serviceProvider.reference)} a été annulé avec succès.` });
                        case "COMMUNICATION":
                        // const [communication] = await prisma.$transaction([
                        //     prisma.communication.update({
                        //         where: { id: deletion.recordId },
                        //         data: {
                        //             isDeleting: false
                        //         }
                        //     }),
                        //     prisma.deletion.delete({
                        //         where: { id: deletion.id }
                        //     })
                        // ]);
                        // return status(200, { message: `La suppression de la communication ${generateRef(reference?.communication, communication.reference)} a été annulé avec succès.` });
                    }

                } catch (error) {
                    console.log(error)
                    return status(500, { message: "Une erreur est survenu lors de l'annulation de la suppression." })
                }
            case "DELETE":
                try {
                    switch (deletion.type) {
                        case "BUILDING":
                            const building = await prisma.building.findUnique({
                                where: { id: deletion.recordId },
                            });

                            if (!building) return status(400, { message: "Aucun bâtiment trouvé." })

                            if (building.photos) {
                                await Promise.all(building.photos.map(async (key) => {
                                    await deleteFile(key)
                                }))
                            }

                            if (building.deeds) {
                                await Promise.all(building.deeds.map(async (key) => {
                                    await deleteFile(key)
                                }))
                            }

                            if (building.documents) {
                                await Promise.all(building.documents.map(async (key) => {
                                    await deleteFile(key)
                                }))
                            }

                            await prisma.$transaction([
                                prisma.deletion.update({
                                    where: {
                                        id: deletion.id
                                    },
                                    data: {
                                        state: "TERMINED"
                                    }
                                }),
                                prisma.building.delete({ where: { id: building.id } })
                            ])

                            return status(200, { message: `Le bâtiment ${building.name} a été supprimé avec succès.` });
                        case "OWNER":
                            const owner = await prisma.owner.findUnique({
                                where: { id: deletion.recordId },
                            });

                            if (!owner) return status(400, { message: "Aucun propriétaire trouvé." })

                            await prisma.$transaction([
                                prisma.deletion.update({
                                    where: {
                                        id: deletion.id
                                    },
                                    data: {
                                        state: "TERMINED"
                                    }
                                }),
                                prisma.owner.delete({ where: { id: owner.id } })
                            ])


                            if (owner.documents) {
                                await Promise.all(owner.documents.map(async (key) => {
                                    await deleteFile(key)
                                }))
                            }

                            return status(200, { message: `Le propriétaire ${owner.firstname} ${owner.lastname} a été supprimé avec succès.` });
                        case "TENANT":
                            const tenant = await prisma.tenant.findUnique({
                                where: { id: deletion.recordId },
                            });

                            if (!tenant) return status(400, { message: "Aucun locataire trouvé." })

                            await prisma.$transaction([
                                prisma.deletion.update({
                                    where: {
                                        id: deletion.id
                                    },
                                    data: {
                                        state: "TERMINED"
                                    }
                                }),
                                prisma.tenant.delete({ where: { id: tenant.id } })
                            ])


                            if (tenant.documents) {
                                await Promise.all(tenant.documents.map(async (key) => {
                                    await deleteFile(key)
                                }))
                            }

                            return status(200, { message: `Le locataire ${tenant.firstname} ${tenant.lastname} a été supprimé avec succès.` });
                        case "UNIT":
                            const unit = await prisma.unit.findUnique({
                                where: { id: deletion.recordId },
                            });

                            if (!unit) return status(400, { message: "Aucune unité trouvée." })

                            await prisma.$transaction([
                                prisma.deletion.update({
                                    where: {
                                        id: deletion.id
                                    },
                                    data: {
                                        state: "TERMINED"
                                    }
                                }),
                                prisma.unit.delete({ where: { id: unit.id } })
                            ])


                            if (unit.documents) {
                                await Promise.all(unit.documents.map(async (key) => {
                                    await deleteFile(key)
                                }))
                            }

                            return status(200, { message: `L'unité ${unit.reference} a été supprimé avec succès.` });
                        case "RENTAL":
                            const rental = await prisma.rental.findUnique({
                                where: { id: deletion.recordId },
                                include: { unit: true }
                            });

                            if (!rental) return status(400, { message: "Aucune location trouvée." })

                            await prisma.$transaction([
                                prisma.deletion.update({
                                    where: {
                                        id: deletion.id
                                    },
                                    data: {
                                        state: "TERMINED"
                                    }
                                }),
                                prisma.rental.delete({ where: { id: rental.id } })
                            ])

                            return status(200, { message: `La location de l'unité ${rental.unit.reference} a été supprimé avec succès.` });
                        case "RESERVATION":
                            const reservation = await prisma.reservation.findUnique({
                                where: { id: deletion.recordId },
                            });

                            if (!reservation) return status(400, { message: "Aucun réservation trouvé." })


                            await prisma.$transaction([
                                prisma.deletion.update({
                                    where: {
                                        id: deletion.id
                                    },
                                    data: {
                                        state: "TERMINED"
                                    }
                                }),
                                prisma.reservation.delete({ where: { id: reservation.id } })
                            ])

                            return status(200, { message: `La réservation de ${reservation.name} a été supprimé avec succès.` });
                        case "PROPERTY_MANAGEMENT":
                            const propertyManagement = await prisma.propertyManagement.findUnique({
                                where: { id: deletion.recordId },
                                include: {
                                    unit: true,
                                    building: true
                                }
                            });

                            if (!propertyManagement) return status(400, { message: "Aucune gestion de propriété trouvée." })

                            await prisma.$transaction([
                                prisma.deletion.update({
                                    where: {
                                        id: deletion.id
                                    },
                                    data: {
                                        state: "TERMINED"
                                    }
                                }),
                                prisma.propertyManagement.delete({ where: { id: propertyManagement.id } })
                            ])

                            return status(200, { message: `La gestion de propriété de ${propertyManagement.building.name} a été supprimé avec succès.` });
                        case "PRODUCT_SERVICE":
                            const productService = await prisma.productService.findUnique({
                                where: { id: deletion.recordId },
                            });

                            if (!productService) return status(400, { message: "Aucun service ou produit trouvé." })

                            await prisma.$transaction([
                                prisma.deletion.update({
                                    where: {
                                        id: deletion.id
                                    },
                                    data: {
                                        state: "TERMINED"
                                    }
                                }),
                                prisma.productService.delete({ where: { id: productService.id } })
                            ])

                            return status(200, { message: `Le service ou produit ${productService.reference} a été supprimé avec succès.` });
                        case "INVOICING":
                            const invoice = await prisma.invoice.findUnique({
                                where: { id: deletion.recordId },
                            });

                            if (!invoice) return status(400, { message: "Aucune facture trouvée." })

                            await prisma.$transaction([
                                prisma.deletion.update({
                                    where: {
                                        id: deletion.id
                                    },
                                    data: {
                                        state: "TERMINED"
                                    }
                                }),
                                prisma.invoice.delete({ where: { id: invoice.id } })
                            ])

                            return status(200, { message: `La facture ${generateRef(reference?.invoice, invoice.reference)} a été supprimé avec succès.` });
                        case "QUOTE":
                            const quote = await prisma.quote.findUnique({
                                where: { id: deletion.recordId },
                            });

                            if (!quote) return status(400, { message: "Aucun devis trouvé." })

                            await prisma.$transaction([
                                prisma.deletion.update({
                                    where: {
                                        id: deletion.id
                                    },
                                    data: {
                                        state: "TERMINED"
                                    }
                                }),
                                prisma.quote.delete({ where: { id: quote.id } })
                            ])

                            return status(200, { message: `Le devis ${generateRef(reference?.quote, quote.reference)} a été supprimé avec succès.` });
                        case "CONTRACT":
                            const contract = await prisma.contract.findUnique({
                                where: { id: deletion.recordId },
                            });

                            if (!contract) return status(400, { message: "Aucun contrat trouvé." })

                            await prisma.$transaction([
                                prisma.deletion.update({
                                    where: {
                                        id: deletion.id
                                    },
                                    data: {
                                        state: "TERMINED"
                                    }
                                }),
                                prisma.contract.delete({ where: { id: contract.id } })
                            ])

                            return status(200, { message: `Le contrat a été supprimé avec succès.` });
                        case "CHECK_IN":
                        case "APPOINTMENT":
                            const appointment = await prisma.appointment.findUnique({
                                where: { id: deletion.recordId },
                                include: {
                                    owner: true,
                                    tenant: true
                                }
                            });

                            if (!appointment) return status(400, { message: "Aucun rendez-vous trouvé." })

                            await prisma.$transaction([
                                prisma.deletion.update({
                                    where: {
                                        id: deletion.id
                                    },
                                    data: {
                                        state: "TERMINED"
                                    }
                                }),
                                prisma.appointment.delete({ where: { id: appointment.id } })
                            ])

                            return status(200, { message: `Le rendez-vous a été supprimé avec succès.` });
                        case "SERVICE_PROVIDER":
                        case "COMMUNICATION":
                    }

                } catch (e) {
                    console.log(e);
                    return status(500, "Une erreur est survenu lors de la suppression.")

                }
            default:
                return status(400, "Le type d'action est invalide.");


        }

    }, { auth: true, params: request.params, body: request.body, })