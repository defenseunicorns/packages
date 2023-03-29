export async function getPackages() {
	const res = await fetch('/api/packages', {
		method: 'GET',
		headers: { 'content-type': 'application/json' }
	});
	return await res.json();
}

export async function getPkgVersions(pkgName: string) {
	const res = await fetch(`/api/packages/${pkgName}/versions`, {
		method: 'GET',
		headers: { 'content-type': 'application/json' }
	});
	return await res.json();
}
