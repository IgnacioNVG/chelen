/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
type Runtime = import('@astrojs/cloudflare').Runtime<Env>;
declare namespace App {
	interface Locals extends Runtime {
		user?: { id: number, username: string };
	}
}

interface Env {
	DB: D1Database;
	STORAGE: R2Bucket;
}
