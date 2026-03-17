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


# Voir comment corriger cette erreur lorsque les identifiants sont mauvais
 HTTP  1/1/2028 8:31:32 GET /api/auth/get-session 2324μs
2028-01-01T07:31:36.041Z ERROR [Better Auth]: TypeError 20 |                            message: `Content-Type "${contentType}" is not allowed. Allowed types: ${allowedMediaTypes.join(", ")}`,
21 |                            code: "UNSUPPORTED_MEDIA_TYPE"
22 |                    });
23 |            }
24 |    }
25 |    if (jsonContentTypeRegex.test(normalizedContentType)) return await request.json();
                                                                                 ^
TypeError: Body already used
 code: "ERR_BODY_ALREADY_USED"

      at getBody (/mnt/5E71A13A353493EF/PROJETS/CLIENTS/MR RALPH/APPLICATION/creo/server/node_modules/better-call/dist/utils.mjs:25:77)
      at <anonymous> (/mnt/5E71A13A353493EF/PROJETS/CLIENTS/MR RALPH/APPLICATION/creo/server/node_modules/better-call/dist/router.mjs:68:56)
      at <anonymous> (/mnt/5E71A13A353493EF/PROJETS/CLIENTS/MR RALPH/APPLICATION/creo/server/node_modules/better-call/dist/router.mjs:105:22)

# SERVER_ERROR:  20 |                           message: `Content-Type "${contentType}" is not allowed. Allowed types: ${allowedMediaTypes.join(", ")}`,
21 |                            code: "UNSUPPORTED_MEDIA_TYPE"
22 |                    });
23 |            }
24 |    }
25 |    if (jsonContentTypeRegex.test(normalizedContentType)) return await request.json();
                                                                                 ^
TypeError: Body already used
 code: "ERR_BODY_ALREADY_USED"

      at getBody (/mnt/5E71A13A353493EF/PROJETS/CLIENTS/MR RALPH/APPLICATION/creo/server/node_modules/better-call/dist/utils.mjs:25:77)
      at <anonymous> (/mnt/5E71A13A353493EF/PROJETS/CLIENTS/MR RALPH/APPLICATION/creo/server/node_modules/better-call/dist/router.mjs:68:56)
      at <anonymous> (/mnt/5E71A13A353493EF/PROJETS/CLIENTS/MR RALPH/APPLICATION/creo/server/node_modules/better-call/dist/router.mjs:105:22)

 HTTP  1/1/2028 8:31:36 POST /api/auth/sign-out 14384μs
 HTTP  1/1/2028 8:31:36 GET /api/auth/get-session 4138μs
 HTTP  1/1/2028 8:31:36 GET /api/auth/get-session 3810μs
2028-01-01T07:32:07.335Z ERROR [Better Auth]: TypeError 20 |                            message: `Content-Type "${contentType}" is not allowed. Allowed types: ${allowedMediaTypes.join(", ")}`,
21 |                            code: "UNSUPPORTED_MEDIA_TYPE"
22 |                    });
23 |            }
24 |    }
25 |    if (jsonContentTypeRegex.test(normalizedContentType)) return await request.json();
                                                                                 ^
TypeError: Body already used
 code: "ERR_BODY_ALREADY_USED"

      at getBody (/mnt/5E71A13A353493EF/PROJETS/CLIENTS/MR RALPH/APPLICATION/creo/server/node_modules/better-call/dist/utils.mjs:25:77)
      at <anonymous> (/mnt/5E71A13A353493EF/PROJETS/CLIENTS/MR RALPH/APPLICATION/creo/server/node_modules/better-call/dist/router.mjs:68:56)
      at <anonymous> (/mnt/5E71A13A353493EF/PROJETS/CLIENTS/MR RALPH/APPLICATION/creo/server/node_modules/better-call/dist/router.mjs:105:22)

# SERVER_ERROR:  20 |                           message: `Content-Type "${contentType}" is not allowed. Allowed types: ${allowedMediaTypes.join(", ")}`,
21 |                            code: "UNSUPPORTED_MEDIA_TYPE"
22 |                    });
23 |            }
24 |    }
25 |    if (jsonContentTypeRegex.test(normalizedContentType)) return await request.json();
                                                                                 ^
TypeError: Body already used
 code: "ERR_BODY_ALREADY_USED"

      at getBody (/mnt/5E71A13A353493EF/PROJETS/CLIENTS/MR RALPH/APPLICATION/creo/server/node_modules/better-call/dist/utils.mjs:25:77)
      at <anonymous> (/mnt/5E71A13A353493EF/PROJETS/CLIENTS/MR RALPH/APPLICATION/creo/server/node_modules/better-call/dist/router.mjs:68:56)
      at <anonymous> (/mnt/5E71A13A353493EF/PROJETS/CLIENTS/MR RALPH/APPLICATION/creo/server/node_modules/better-call/dist/router.mjs:105:22)

 HTTP  1/1/2028 8:32:7 POST /api/auth/sign-in/email 3798μs
2028-01-01T07:32:20.365Z ERROR [Better Auth]: TypeError 20 |                            message: `Content-Type "${contentType}" is not allowed. Allowed types: ${allowedMediaTypes.join(", ")}`,
21 |                            code: "UNSUPPORTED_MEDIA_TYPE"
22 |                    });
23 |            }
24 |    }
25 |    if (jsonContentTypeRegex.test(normalizedContentType)) return await request.json();
                                                                                 ^
TypeError: Body already used
 code: "ERR_BODY_ALREADY_USED"

      at getBody (/mnt/5E71A13A353493EF/PROJETS/CLIENTS/MR RALPH/APPLICATION/creo/server/node_modules/better-call/dist/utils.mjs:25:77)
      at <anonymous> (/mnt/5E71A13A353493EF/PROJETS/CLIENTS/MR RALPH/APPLICATION/creo/server/node_modules/better-call/dist/router.mjs:68:56)
      at <anonymous> (/mnt/5E71A13A353493EF/PROJETS/CLIENTS/MR RALPH/APPLICATION/creo/server/node_modules/better-call/dist/router.mjs:105:22)

# SERVER_ERROR:  20 |                           message: `Content-Type "${contentType}" is not allowed. Allowed types: ${allowedMediaTypes.join(", ")}`,
21 |                            code: "UNSUPPORTED_MEDIA_TYPE"
22 |                    });
23 |            }
24 |    }
25 |    if (jsonContentTypeRegex.test(normalizedContentType)) return await request.json();
                                                                                 ^
TypeError: Body already used
 code: "ERR_BODY_ALREADY_USED"

      at getBody (/mnt/5E71A13A353493EF/PROJETS/CLIENTS/MR RALPH/APPLICATION/creo/server/node_modules/better-call/dist/utils.mjs:25:77)
      at <anonymous> (/mnt/5E71A13A353493EF/PROJETS/CLIENTS/MR RALPH/APPLICATION/creo/server/node_modules/better-call/dist/router.mjs:68:56)
      at <anonymous> (/mnt/5E71A13A353493EF/PROJETS/CLIENTS/MR RALPH/APPLICATION/creo/server/node_modules/better-call/dist/router.mjs:105:22)

 HTTP  1/1/2028 8:32:20 POST /api/auth/sign-in/email 4037μs
2028-01-01T07:32:25.169Z ERROR [Better Auth]: TypeError 20 |                            message: `Content-Type "${contentType}" is not allowed. Allowed types: ${allowedMediaTypes.join(", ")}`,
21 |                            code: "UNSUPPORTED_MEDIA_TYPE"
22 |                    });
23 |            }
24 |    }
25 |    if (jsonContentTypeRegex.test(normalizedContentType)) return await request.json();
                                                                                 ^
TypeError: Body already used
 code: "ERR_BODY_ALREADY_USED"

      at getBody (/mnt/5E71A13A353493EF/PROJETS/CLIENTS/MR RALPH/APPLICATION/creo/server/node_modules/better-call/dist/utils.mjs:25:77)
      at <anonymous> (/mnt/5E71A13A353493EF/PROJETS/CLIENTS/MR RALPH/APPLICATION/creo/server/node_modules/better-call/dist/router.mjs:68:56)
      at <anonymous> (/mnt/5E71A13A353493EF/PROJETS/CLIENTS/MR RALPH/APPLICATION/creo/server/node_modules/better-call/dist/router.mjs:105:22)

# SERVER_ERROR:  20 |                           message: `Content-Type "${contentType}" is not allowed. Allowed types: ${allowedMediaTypes.join(", ")}`,
21 |                            code: "UNSUPPORTED_MEDIA_TYPE"
22 |                    });
23 |            }
24 |    }
25 |    if (jsonContentTypeRegex.test(normalizedContentType)) return await request.json();
                                                                                 ^
TypeError: Body already used
 code: "ERR_BODY_ALREADY_USED"

      at getBody (/mnt/5E71A13A353493EF/PROJETS/CLIENTS/MR RALPH/APPLICATION/creo/server/node_modules/better-call/dist/utils.mjs:25:77)
      at <anonymous> (/mnt/5E71A13A353493EF/PROJETS/CLIENTS/MR RALPH/APPLICATION/creo/server/node_modules/better-call/dist/router.mjs:68:56)
      at <anonymous> (/mnt/5E71A13A353493EF/PROJETS/CLIENTS/MR RALPH/APPLICATION/creo/server/node_modules/better-call/dist/router.mjs:105:22)

 HTTP  1/1/2028 8:32:25 POST /api/auth/sign-in/email 6591μs
