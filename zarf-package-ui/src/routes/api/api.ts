export async function getPackages() {
	const res = await fetch('/api', {
		method: 'POST',
		body: JSON.stringify({ endpoint: 'listOrgPkgs' }),
		headers: { 'content-type': 'application/json' }
	});
	return await res.json();
}

export async function getPkgVersions(pkgName: string) {
	const res = await fetch('/api', {
		method: 'POST',
		body: JSON.stringify({
			endpoint: 'getPkgVersions',
			pkgName: pkgName
		}),
		headers: { 'content-type': 'application/json' }
	});
	return await res.json();
}
