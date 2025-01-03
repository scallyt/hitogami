import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { filesTable } from '$lib/server/db/schema';

export async function POST({ request }: { request: Request }) {
    try {
        const filename = request.headers.get('x-filename');
        if (!filename) {
            return json({ error: 'Filename is missing' }, { status: 400 });
        }

        await db.insert(filesTable).values({ filename }).execute();

        return json({ success: true, message: 'File uploaded and saved successfully' }, { status: 200 });
    } catch (error) {
        console.error('File upload error:', error);
        return json({ error: 'Failed to upload the file' }, { status: 500 });
    }
}
