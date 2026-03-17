import { t } from "elysia"
import { env } from '@yolk-oss/elysia-env'

export const envPlugin = env({
    BETTER_AUTH_SECRET: t.String({
        error: 'Le secret de better auth est requis',
    }),
    DATABASE_URL: t.String({
        error: 'L\'url de la base de données est requis',
    }),
    CLIENT_URL: t.String({
        error: 'L\'url du client est requis',
    }),
    USER_FIRSTNAME: t.String({
        error: 'Le prénom de l\'utilisateur est requis',
    }),
    USER_LASTNAME: t.String({
        error: 'Le nom de l\'utilisateur est requis',
    }),
    USER_EMAIL: t.String({
        error: 'L\'email de l\'utilisateur est requis',
    }),
    USER_PASSWORD: t.String({
        error: 'Le mot de passe de l\'utilisateur est requis',
    }),
    S3_ENDPOINT: t.String({
        error: 'L\'endpoint de S3 est requis',
    }),
    S3_ACCESS_KEY: t.String({
        error: 'La clé d\'accès de S3 est requise',
    }),
    S3_ID: t.String({
        error: 'L\'identifiant de S3 est requis',
    }),
    S3_SECRET_KEY: t.String({
        error: 'La clé secrète de S3 est requise',
    }),
    S3_BUCKET: t.String({
        error: 'Le bucket de S3 est requis',
    }),
    S3_REGION: t.String({
        error: 'La région de S3 est requise',
    }),
    S3_PUBLIC_DOMAIN: t.String({
        error: 'Le domaine public de S3 est requis',
    }),
});
