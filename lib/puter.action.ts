import puter from "@heyputer/puter.js";
import {getOrCreateHostingConfig, uploadImageToHosting} from "./puter.hosting";
import {isHostedUrl} from "./utils";


export const signIn = async () => await puter.auth.signIn();
export const signOut = () => puter.auth.signOut();

export const getCurrentUser = async () => {
    try {
        return await puter.auth.getUser()
    }catch {
        return null;
    }
};

//Create project chapter
/*This function prepares and saves a project by:

Uploading images (source + rendered)
Cleaning and validating data
Returning a final project object (payload)*/

export const createProject = async ({item}: CreateProjectParams):
    Promise<DesignItem | null | undefined> =>{

    const  projectId = item.id;

    const hosting = await getOrCreateHostingConfig();

    //Upload source image
    const hostedSource = projectId ?
        await uploadImageToHosting({ hosting, url: item.sourceImage, projectId, label: "source",
    }):null;

    //Upload rendered image (optional)
    const hostedRendered = projectId && item.renderedImage ?
        await uploadImageToHosting({ hosting, url: item.renderedImage, projectId, label: "rendered",}):null;

    //Resolve final source image URL
     const resolvedSource = hostedSource?.url || (isHostedUrl(item.sourceImage)
        ? item.sourceImage:""
     );

     //If the source image fails → stop
     if(!resolvedSource) {
         console.warn(`Failed to resolve source image for project ${projectId}, Skipping Save`);
         return null;
     }
     //Resolve rendered image URL
     const resolvedRender = hostedRendered?.url
             ? hostedRendered ?.url :
             item.renderedImage &&  isHostedUrl(item.renderedImage)
                ? item.renderedImage : undefined;

     //Remove unnecessary fields
     const {
         sourcePath: _sourcePath,
         renderedPath:_renderedPath,
         publicPath: _publicPath,
         ...rest
     } = item;

     //Create final payload
     const payload ={
         ...rest,
         sourceImage: resolvedSource,
         renderedImage: resolvedRender
     }

     try {
         //Call the puter worker to store project in KV

         return payload;
     }catch (e) {
         console.log(`Failed to save project ${projectId}: ${e}`);
     }
}