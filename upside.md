# MISE EN PRODUCTION

# WEB
- host.ts
    . SERVER_HOST
        dev: import.meta.env.BUN_PUBLIC_API_URL || "http://localhost:3000"
        prod: "https://api.upside-gabon.com"
- vite.config.ts
    . target
        dev : http://localhost:3001
        prod : https://api.upside-gabon.com
- .env
    . BUN_PUBLIC_API_URL
        dev: http://localhost:3001
        prod: https://api.upside-gabon.com

# SERVER
- cors.ts
    . origin:
        dev: http://localhost:5173
        prod: https://crm.upside-gabon.com
- auth.ts
    . domain:
        dev: localhost
        prod: upside-gabon.com




