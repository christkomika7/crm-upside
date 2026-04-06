import { Elysia, t } from "elysia";
import { authPlugin } from "../auth/auth";
import { prisma } from "../../lib/prisma";
import { canAccess } from "../auth/permission";
import { deleteFile, uploadFiles, uploadFileSingle } from "../../lib/storage";
import { safeSignedUrls } from "../../lib/utils";
import request from "./type";
import { serviceProvidersSchema } from "../../lib/zod/service-providers";

export const serviceProviderRoutes = new Elysia({ prefix: "/service-provider" })
    .use(authPlugin)
    .get("/", async ({ permission, status }) => {

        if (!canAccess(permission, "serviceProviders", "read")) {
            return status(403, { message: "Accès refusé" });
        }

        const serviceProviders = await prisma.serviceProvider.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                profession: true
            }
        });

        const serviceProvidersWithSignedUrl = await Promise.all(
            serviceProviders.map(async (serviceProvider) => {
                return {
                    id: serviceProvider.id,
                    name: `${serviceProvider.firstname} ${serviceProvider.lastname}`,
                    profession: `${serviceProvider.profession.name}`,
                    rating: serviceProvider.note,
                    phone: serviceProvider.phone,
                    isDeleting: serviceProvider.isDeleting,
                    email: serviceProvider.email,
                    due: '-',
                    paid: '-',
                    createdAt: serviceProvider.createdAt,
                };
            })
        );

        return serviceProvidersWithSignedUrl;

    }, {
        auth: true,
    })
    .get("/:id", async ({ params, permission, status, server }) => {
        if (!canAccess(permission, "serviceProviders", "read")) {
            return status(403, { message: "Accès refusé" });
        }

        const serviceProvider = await prisma.serviceProvider.findUnique({
            where: { id: params.id },
            include: {
                profession: true
            }

        });

        if (!serviceProvider) {
            return status(404, { message: "Aucun prestataire trouvé" });
        }

        return {
            ...serviceProvider,
            profession: serviceProvider.profession.id,
            rcc: serviceProvider.rcc ? (await safeSignedUrls(serviceProvider.rcc)).urls : "",
            idCard: serviceProvider.idCard ? (await safeSignedUrls(serviceProvider.idCard)).urls : "",
            taxCertificate: serviceProvider.taxCertificate ? (await safeSignedUrls(serviceProvider.taxCertificate)).urls : "",
        };

    }, { auth: true, params: request.params })
    .post("/", async ({ body, permission, status }) => {
        if (!canAccess(permission, "serviceProviders", "create")) {
            return status(403, { message: "Accès refusé" });
        }

        const uploadedKeys: string[] = [];

        try {
            const { success, data } = serviceProvidersSchema.safeParse(body);

            if (!success) {
                return status(400, { message: "Les informations du prestataire sont invalide" });
            }

            let rcc: string | null = null;
            let idCard: string | null = null;
            let taxCertificate: string | null = null;

            try {
                rcc = data.rcc ? await uploadFileSingle(uploadedKeys, data.rcc[0]) : null;
                idCard = data.idCard ? await uploadFileSingle(uploadedKeys, data.idCard[0]) : "";
                taxCertificate = data.taxCertificate ? await uploadFileSingle(uploadedKeys, data.taxCertificate[0]) : "";
            } catch (error) {
                console.error(error);
                return status(500, { message: "Erreur lors de l'upload des fichiers, veuillez réessayer" });
            }

            await prisma.serviceProvider.create({
                data: {
                    firstname: data.firstname,
                    lastname: data.lastname,
                    company: data.company,
                    phone: data.phone,
                    email: data.email,
                    address: data.address,
                    professionId: data.profession,
                    nif: data.nif,
                    registerNumber: data.registerNumber,
                    paymentMode: data.paymentMode,
                    note: data.rating.note,
                    comment: data.rating.comment,
                    rcc,
                    idCard,
                    taxCertificate,
                },
            });

            return status(201, { message: "Prestataire créé avec succès" });

        } catch (error) {
            console.error(error);

            await Promise.all(
                uploadedKeys.map(async (key) => {
                    try {
                        await deleteFile(key);
                    } catch (e) {
                        console.error("Erreur suppression fichier:", key, e);
                    }
                })
            );

            return status(500, {
                message: "Erreur lors de la création du prestataire",
            });
        }
    },
        {
            auth: true,
            body: request.body
        })
    .put("/:id", async ({ params, body, permission, status }) => {
        if (!canAccess(permission, "serviceProviders", "update")) {
            return status(403, { message: "Accès refusé" });
        }

        const id = params.id;

        const serviceProvider = await prisma.serviceProvider.findUnique({
            where: { id },
        });


        if (!serviceProvider) {
            return status(404, { message: "Prestataire non trouvé" });
        }

        const oldRcc = serviceProvider.rcc;
        const oldIdCard = serviceProvider.idCard;
        const oldTaxCertificate = serviceProvider.taxCertificate;

        const uploadedKeys: string[] = [];

        try {
            const { success, data } = serviceProvidersSchema.safeParse(body);

            if (!success) {
                return status(400, { message: "Les informations du prestataire sont invalide" });
            }

            await prisma.$transaction(async tx => {
                let rcc: string | null = null;
                let idCard: string | null = null;
                let taxCertificate: string | null = null;

                try {
                    rcc = data.rcc ? await uploadFileSingle(uploadedKeys, data.rcc[0]) : null;
                    idCard = data.idCard ? await uploadFileSingle(uploadedKeys, data.idCard[0]) : null;
                    taxCertificate = data.taxCertificate ? await uploadFileSingle(uploadedKeys, data.taxCertificate[0]) : null;
                } catch (error) {
                    console.error(JSON.stringify(error));
                    return status(500, { message: "Erreur lors de l'upload des fichiers, veuillez réessayer" });
                }

                await tx.serviceProvider.update({
                    where: {
                        id: params.id
                    },
                    data: {
                        firstname: data.firstname,
                        lastname: data.lastname,
                        company: data.company,
                        phone: data.phone,
                        email: data.email,
                        address: data.address,
                        professionId: data.profession,
                        nif: data.nif,
                        registerNumber: data.registerNumber,
                        paymentMode: data.paymentMode,
                        note: data.rating.note,
                        comment: data.rating.comment,
                        rcc,
                        idCard,
                        taxCertificate,
                    },
                });

                await Promise.all([
                    oldRcc && await deleteFile(oldRcc),
                    oldIdCard && await deleteFile(oldIdCard),
                    oldTaxCertificate && await deleteFile(oldTaxCertificate),
                ]);

            })


            return status(201, { message: "Prestataire modifié avec succès" });

        } catch (error) {

            await Promise.all(
                uploadedKeys.map(async (key) => {
                    try {
                        await deleteFile(key);
                    } catch (e) {
                        console.error("Erreur suppression fichier:", key, e);
                    }
                })
            );
            return status(500, {
                message: "Erreur lors de la modification du prestataire.",
            });
        }
    }, { auth: true, body: request.body, params: request.params })
    .delete("/:id", async ({ params, permission, user, status }) => {
        if (!canAccess(permission, "serviceProviders", "update")) {
            return status(403, { message: "Accès refusé" });
        }

        const id = params.id;
        const serviceProvider = await prisma.serviceProvider.findUnique({
            where: { id },
        });

        if (!serviceProvider) return status(400, { message: "Aucun prestataire trouvé." });

        await prisma.$transaction([
            prisma.deletion.create({
                data: {
                    recordId: serviceProvider.id,
                    type: 'SERVICE_PROVIDER',
                    state: "WAIT",
                    user: {
                        connect: { id: user.id }
                    }
                }
            }),
            prisma.serviceProvider.update({
                where: { id: serviceProvider.id },
                data: {
                    isDeleting: true
                }
            })
        ]);

        return status(200, { message: `La suppression du prestataire ${serviceProvider.firstname} ${serviceProvider.lastname} est en attente de validation.` });
    }, { auth: true, params: request.params })

