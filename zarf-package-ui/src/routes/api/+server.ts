import { Octokit } from '@octokit/rest';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ACCESS_TOKEN } from '$env/static/private';

export const POST = (async ({ request }) => {
	const req = await request.json();
	const { endpoint } = req;

	let octokit = new Octokit({ auth: ACCESS_TOKEN });

	try {
		let res;
		if (endpoint === 'listOrgPkgs') {
			res = await listOrgPkgs(octokit);
		} else {
			res = await getPkgTags(octokit, req.pkgName);
		}

		return new Response(JSON.stringify(res.data));
	} catch (err) {
		throw error(403);
	}
}) satisfies RequestHandler;

function listOrgPkgs(octokit: Octokit) {
	return octokit.rest.packages.listPackagesForOrganization({
		package_type: 'container',
		org: 'defenseunicorns'
	});
}

function getPkgTags(octokit: Octokit, pkgName: string) {
	return octokit.rest.packages.getAllPackageVersionsForPackageOwnedByOrg({
		package_type: 'container',
		package_name: pkgName,
		org: 'defenseunicorns'
	});
}
