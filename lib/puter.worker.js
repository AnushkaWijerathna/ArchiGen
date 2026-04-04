//Define your worker routes that call puter KV storage to save the project

const PROJECT_PREFIX = 'archigen_project_';

//👉 Purpose: Send error responses in JSON forma
const jsonError =(status, message, extra = {}) => {
    new Response(JSON.stringify({status, message, ...extra}), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        }
    })
}

// Returns the logged-in user's UUID or null if not available
const getUserId = async (userPuter) => {
    try {
        const user = await userPuter.auth.getUser();

        return user?.uuid || null;
    } catch {
        return null;
    }
}

/*👉 This defines an API endpoint
Method: POST
URL: /api/projects/save*/
router.post('/api/projects/save', async ({request,user}) => {
    try {
        const userPuter = user.puter;

        if (!userPuter) return jsonError(401, 'Unauthorized');

        const body = await request.json();
        const project = body?.project;

        if(!project?.id || !project?.sourceImage) return jsonError(400, 'Project ID and source image are required');

        const payload = {
            ...project,
            updatedAt: new Date().toISOString(),
        }

        const userId = await getUserId(userPuter);
        if(!userId) return jsonError(401, 'Authentication failed');

        //Key under which the project will be stored in KV...Save project data in KV storage using a unique key and return success response
        const key = `${PROJECT_PREFIX}${project.id}`;
        await userPuter.kv.set(key, payload);

        return { saved: true, id: project.id, project: payload }

    }catch (e) {
        return jsonError(500, 'Failed to save project:',{message:e.message || 'Unknown error'});
    }
})

//Fetches and returns a list of projects for the authenticated user, marking them as public, or returns an error if authentication or retrieval fails.
router.get('/api/projects/list', async ({ user }) => {
    try {
        const userPuter = user.puter;
        if (!userPuter) return jsonError(401, 'Authentication failed');

        const userId = await getUserId(userPuter);
        if (!userId) return jsonError(401, 'Authentication failed');

        const projects = (await userPuter.kv.list(PROJECT_PREFIX, true))
            .map(({value}) => ({ ...value, isPublic: true }))

        return { projects };
    } catch (e) {
        return jsonError(500, 'Failed to list projects', { message: e.message || 'Unknown error' });
    }
})

//Fetches and returns a specific project by ID for the authenticated user, or returns an error if authentication fails, the ID is missing, or the project doesn't exist.
router.get('/api/projects/get', async ({ request, user }) => {
    try {
        const userPuter = user.puter;
        if (!userPuter) return jsonError(401, 'Authentication failed');

        const userId = await getUserId(userPuter);
        if (!userId) return jsonError(401, 'Authentication failed');

        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        if (!id) return jsonError(400, 'Project ID is required');

        const key = `${PROJECT_PREFIX}${id}`;
        const project = await userPuter.kv.get(key);

        if (!project) return jsonError(404, 'Project not found');

        return { project };
    } catch (e) {
        return jsonError(500, 'Failed to get project', { message: e.message || 'Unknown error' });
    }
})