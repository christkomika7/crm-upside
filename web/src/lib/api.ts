import { SERVER_HOST } from "./host";

const BASE_URL = import.meta.env.VITE_SERVER_URL ?? SERVER_HOST;

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface ApiOptions<T> {
    method?: HttpMethod;
    body?: T;
    headers?: HeadersInit;
}

interface ApiResponse<T> {
    data: T;
    message?: string;
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
    });

    if (!res.ok) throw new Error(await res.text());
    return res.json() as Promise<T>;
}



export async function apiClient<TRequest = unknown, TResponse = unknown>(
    path: string,
    { method = "GET", body, headers }: ApiOptions<TRequest> = {}
): Promise<ApiResponse<TResponse>> {
    const isFormData = body instanceof FormData;

    const response = await fetch(`${BASE_URL}${path}`, {
        method,
        credentials: "include",
        headers: {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            ...headers,
        },
        body: body
            ? isFormData
                ? (body as FormData)
                : JSON.stringify(body)
            : undefined,
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
        console.log({ result })
        throw new Error(result?.message || "Une erreur est survenue");
    }

    return result;
}

export const crudService = {
    get: <T>(url: string) =>
        apiClient<never, T>(url, { method: "GET" }),

    post: <TReq, TRes>(url: string, body: TReq) =>
        apiClient<TReq, TRes>(url, { method: "POST", body }),

    put: <TReq, TRes>(url: string, body: TReq) =>
        apiClient<TReq, TRes>(url, { method: "PUT", body }),

    delete: <T>(url: string) =>
        apiClient<never, T>(url, { method: "DELETE" }),
};