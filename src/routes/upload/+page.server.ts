import { fail, type Actions } from '@sveltejs/kit';
import { writeFileSync } from 'node:fs';
import path from 'node:path';

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/jpg'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit

export const actions: Actions = {
    upload: async ({ request, fetch }) => {
        try {
            const data = await request.formData();
            const file = data.get('file-upload') as File;
            const languageFrom = data.get('language-from') as string;
            const languageTo = data.get('language-to') as string;

            console.log('Languages:', languageFrom, languageTo);

            if (!file || !(file instanceof File)) {
                return fail(400, { error: true, message: 'No file uploaded' });
            }

            if (!ALLOWED_TYPES.includes(file.type)) {
                return fail(400, { error: true, message: 'Invalid file type. Only .png, .jpeg, .jpg, and .webp formats are allowed' });
            }

            if (file.size > MAX_FILE_SIZE) {
                return fail(400, { error: true, message: 'File size too large. Maximum size is 5MB' });
            }

            const buffer = await file.arrayBuffer();
            const uint8Buffer = new Uint8Array(buffer);
            const filename = `${Date.now()}-${file.name}`;

            const uploadPath = path.join(process.cwd(), 'static', 'uploads', filename);
            writeFileSync(uploadPath, Buffer.from(buffer));

            const response = await fetch('/api/files', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-filename': filename
                },
                body: uint8Buffer
            });

            if (!response.ok) {
                const result = await response.json();
                return fail(500, { error: true, message: result.error || 'Failed to notify API about the file upload' });
            }

            const translateResponse = await fetch('/api/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/octet-stream',
                    'x-filename': filename
                },
                body: JSON.stringify({ "languageFrom": languageFrom, "languageTo": languageTo })
            });

            if (!translateResponse.ok) {
                const result = await translateResponse.json();
                return fail(500, { error: true, message: result.error || 'Failed to notify API about the translation request' });
            }

            return { success: true, message: 'File uploaded and notified to API successfully' };
        } catch (error) {
            console.error('File upload error:', error);
            return fail(500, { error: true, message: 'Failed to upload file' });
        }
    }
} satisfies Actions;
