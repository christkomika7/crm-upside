# ActionHeader
- Corriger le bug du composant

# Dashboard
- Finaliser le dashboard

# Sidebar
- Mettre le scroll
- Mettre les bonnes icones
- Gerer le systeme du lien actif

# Owners
- View: Relevé du proprietaire ce bouton doit renvoyer vers quoi ?

# Tenant
- Statement: completer le formulaire

# Property Management
- Section info Tab accounting voir le filtre monthly

# ExportTo
- Revoir le composant 


# Owner statement
- Generer un pdf

# Revoir les deletes
- Au niveau des données connectées



| Example:
62 |   await prisma.$executeRawUnsafe(\`ALTER USER prisma WITH PASSWORD '\${password}'\`)
63 | 
64 | More Information: https://pris.ly/d/execute-raw
65 | `)}var ci=({clientMethod:e,activeProvider:t})=>r=>{let n="",i;if(mr(r))n=r.sql,i={values:tt(r.values),__prismaRawParameters__:!0};else if(Array.isArray(r)){let[o,...s]=r;n=o,i={values:tt(s||[]),__prismaRawParameters__:!0}}else switch(t){case"sqlite":case"mysql":{n=r.sql,i={values:tt(r.values),__prismaRawParameters__:!0};break}case"cockroachdb":case"postgresql":case"postgres":{n=r.text,i={values:tt(r.values),__prismaRawParameters__:!0};break}case"sqlserver":{n=gl(r),i={values:tt(r.values),__prismaRawParameters__:!0};break}default:throw new Error(`The ${t} provider does not support ${e}`)}return i?.values?El(`prisma.${e}(${n}, ${i.values})`):El(`prisma.${e}(${n})`),{query:n,parameters:i}},Tl={requestArgsToMiddlewareArgs(e){return[e.strings,...e.values]},middlewareArgsToRequestArgs(e){let[t,...r]=e;return new Pl.Sql(t,r)}},Sl={requestArgsToMiddlewareArgs(e){return[e]},middlewareArgsToRequestArgs(e){return e[0]}};function pi(e){return function(r,n){let i,o=(s=e)=>{try{return s===void 0||s?.kind==="itx"?i??=vl(r(s | ... truncated 

PrismaClientKnownRequestError: 
Invalid `tx.invoice.update()` invocation in
/mnt/5E71A13A353493EF/PROJETS/CLIENTS/MR RALPH/APPLICATION/creo/server/src/modules/invoice/invoice.route.ts:249:34

  246 console.log(invoice)
  247 console.log(data)
  248 
→ 249 await tx.invoice.update(
Foreign key constraint violated on the constraint: `invoice_tenantId_fkey`
       meta: {
  modelName: "Invoice",
  driverAdapterError: 646 |       this.onError(e);
647 |     }
648 |   }
649 |   onError(error) {
650 |     debug("Error in performIO: %O", error);
651 |     throw new DriverAdapterError(convertDriverError(error));
                ^
DriverAdapterError: ForeignKeyConstraintViolation
 cause: [Object ...],

      at onError (/mnt/5E71A13A353493EF/PROJETS/CLIENTS/MR RALPH/APPLICATION/creo/server/node_modules/@prisma/adapter-pg/dist/index.mjs:651:11)
      at performIO (/mnt/5E71A13A353493EF/PROJETS/CLIENTS/MR RALPH/APPLICATION/creo/server/node_modules/@prisma/adapter-pg/dist/index.mjs:646:12)
      at async queryRaw (/mnt/5E71A13A353493EF/PROJETS/CLIENTS/MR RALPH/APPLICATION/creo/server/node_modules/@prisma/adapter-pg/dist/index.mjs:566:41)
,
},
 clientVersion: "7.6.0",
       code: "P2003"

      at handleRequestError (/mnt/5E71A13A353493EF/PROJETS/CLIENTS/MR RALPH/APPLICATION/creo/server/node_modules/@prisma/client/runtime/client.js:65:8286)
      at handleAndLogRequestError (/mnt/5E71A13A353493EF/PROJETS/CLIENTS/MR RALPH/APPLICATION/creo/server/node_modules/@prisma/client/runtime/client.js:65:7581)
      at request (/mnt/5E71A13A353493EF/PROJETS/CLIENTS/MR RALPH/APPLICATION/creo/server/node_modules/@prisma/client/runtime/client.js:65:7288)

