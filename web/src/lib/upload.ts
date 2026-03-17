export async function urlToFile(url: string,): Promise<File> {
    console.log({ url })
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Impossible de récupérer le fichier: ${res.status}`);
    }

    const blob = await res.blob();

    const name = url.split("/").pop() ??
        `${crypto.randomUUID()}`;

    return new File([blob], name, {
        type: blob.type,
    });
}