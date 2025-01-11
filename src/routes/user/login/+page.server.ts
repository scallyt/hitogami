import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { loginSchema } from '$lib/server/zod-schema'
import { generateSessionToken, createSession, setSessionTokenCookie } from '$lib/server/auth'
import * as argon2 from 'argon2'
import type { z } from 'zod';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
    if (event.locals.user) {
        return redirect(302, '/user/me');
    }
    return {};
};

export const actions: Actions = {
    login: async (event) => {
        const formData = Object.fromEntries(await event.request.formData());

        let validated: z.infer<typeof loginSchema>
        try {
            validated = loginSchema.parse(formData);
        } catch (err) {
            const { fieldErrors } = err.flatten();
            return fail(400, {
                data: formData,
                errors: {
                    email: fieldErrors.email || [],
                    password: fieldErrors.password || []
                }
            });
        }

        const results = await db.select().from(table.user).where(eq(table.user.email, validated.email))
        const existingUser = results.at(0);

        if (!existingUser || !existingUser.passwordHash) {
            return fail(400, { errors: { email: ['Invalid email or password'] } });
        }
        const validPassword = await argon2.verify(existingUser.passwordHash, validated.password);
        if (!validPassword) {
            return fail(400, { message: 'Incorrect username or password' });
        }

        const sessionToken = generateSessionToken();
        const session = await createSession(sessionToken, existingUser.id);
        setSessionTokenCookie(event, sessionToken, session.expiresAt);

        return redirect(302, '/user/me');
    },
}