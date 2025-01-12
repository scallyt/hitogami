import { loadFlash } from 'sveltekit-flash-message/server';

export const load = loadFlash(async (event) => {
  console.log("Hello world")
});