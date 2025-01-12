import { fail } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import { registerSchema } from "$lib/server/zod-schema";
import * as argon2 from "argon2";
import type { Actions, PageServerLoad } from "./$types";
import { redirect } from "sveltekit-flash-message/server";

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, "/user/me");
	}
	return {};
};

export const actions: Actions = {
	register: async (event) => {
		const formData = Object.fromEntries(await event.request.formData());

		try {
			const validated = registerSchema.parse(formData);

			try {
				const hash = await argon2.hash(validated.password);
				await db.insert(table.user).values({
					username: validated.username,
					email: validated.email,
					passwordHash: hash,
				});
			} catch (e) {
				console.error("Database error:", e);
				return fail(400, {
					data: formData,
					errors: {
						username: ["Username may already be taken"],
						email: ["Email may already be in use"],
					},
				});
			}
		} catch (err) {
			const { fieldErrors } = err.flatten();
			return fail(400, {
				data: formData,
				errors: {
					username: fieldErrors.username || [],
					email: fieldErrors.email || [],
					password: fieldErrors.password || [],
				},
			});
		}
		redirect(
			"/user/login",
			{ type: "success", message: "Confirm your email before logging in" },
			event,
		);
	},
};
