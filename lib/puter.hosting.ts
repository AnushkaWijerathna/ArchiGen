//Checking if a subdomain is available in the key value store (Database) if not create a new one
import puter from "@heyputer/puter.js";
import {
    createHostingSlug,
    fetchBlobFromUrl, getHostedUrl,
    getImageExtension,
    HOSTING_CONFIG_KEY,
    imageUrlToPngBlob,
    isHostedUrl
} from "./utils";

// Ensures the app has a single unique subdomain for hosting.
// Checks if a subdomain exists in storage; if not, generates and creates one.
// Used to store, access, and share app files (e.g., uploads, renders) via a stable URL.
export const getOrCreateHostingConfig = async (): Promise<HostingConfig | null> => {
    const existing = (await puter.kv.get(HOSTING_CONFIG_KEY)) as HostingConfig | null ;

    if(existing?.subdomain) return {
        subdomain: existing.subdomain
    };
    const subdomain = createHostingSlug();

    try {
        const created = await puter.hosting.create(subdomain,'.');

        return {
            subdomain: created.subdomain
        };
    }catch (e) {
        console.warn(`Could not find subdomain: ${e}`);
        return null;
    }
}

//Upload functions to upload blob files to the hosting subdomain...👉 It takes an image (URL or blob) and uploads it to your hosted site, then returns a public link.
export const uploadImageToHosting = async ({hosting,url,projectId,label}:
    StoreHostedImageParams): Promise<HostedAsset | null> => {

    if (!hosting || !url) return null;
    if (isHostedUrl(url)) return {url};

    try {
        // Resolve the image into a usable file (Blob). If the image is a generated/rendered one, convert it to PNG format.
        // Otherwise, fetch the image data directly from the given URL. Result: a Blob object with its content type, ready for upload.
        const resolved = label === "rendered" ?
            await imageUrlToPngBlob(url).then((blob) => blob ? {blob,contentType: "image/png"} : null)
            : await fetchBlobFromUrl(url);

        if (!resolved) return null;

        const contentType = resolved.contentType || resolved.blob.type || '';
        const ext = getImageExtension(contentType, url);
        const dir = `projects/${projectId}`;
        const filePath = `${dir}/${label}.${ext}`;

        const uploadFile = new File([resolved.blob], `${label}.${ext}`, {
            type: contentType
            });

        //In case creating this directory for the first time
        await puter.fs.mkdir(dir, {createMissingParents:true});

        await  puter.fs.write(filePath, uploadFile);

        const hostedUrl =  getHostedUrl({subdomain:hosting.subdomain},filePath);

        return hostedUrl ? {url:hostedUrl} : null;

    }catch (e) {
        console.warn(`Failed to store hosted image: ${e}`);

        return null;
    }

}