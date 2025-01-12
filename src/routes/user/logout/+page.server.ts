import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { invalidateSession, deleteSessionTokenCookie } from "$lib/server/auth";

export const load: PageServerLoad = async (event) => {
        if (!event.locals.session) {
            return fail(401);
        }
        await invalidateSession(event.locals.session.id);
        deleteSessionTokenCookie(event);

        return redirect(302, '/user/login');
};