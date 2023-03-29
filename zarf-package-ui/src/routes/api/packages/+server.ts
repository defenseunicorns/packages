import { ACCESS_TOKEN } from '$env/static/private';
import { Octokit } from '@octokit/rest';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from '../$types';

export const GET = (async () => {
	let octokit = new Octokit({ auth: ACCESS_TOKEN });

	try {
		const pkgs = await octokit.rest.packages.listPackagesForOrganization({
			package_type: 'container',
			org: 'defenseunicorns'
		});

		return new Response(JSON.stringify(pkgs.data));
	} catch (err) {
		throw error(403);
	}
}) satisfies RequestHandler;
