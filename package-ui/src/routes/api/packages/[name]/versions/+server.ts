import type { RequestHandler } from '../../../$types';
import { ACCESS_TOKEN } from '$env/static/private';
import { Octokit } from '@octokit/rest';

export const GET = (async ({ params }) => {
	let octokit = new Octokit({ auth: ACCESS_TOKEN });
	const pkgName = (params as Record<string, string>)['name'];
	try {
		const versions = await octokit.rest.packages.getAllPackageVersionsForPackageOwnedByOrg({
			package_type: 'container',
			package_name: pkgName || '',
			org: 'defenseunicorns'
		});

		return new Response(JSON.stringify(versions.data));
	} catch (err) {
		throw err;
	}
}) satisfies RequestHandler;
