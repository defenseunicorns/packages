<script lang="ts">
	import { Box, Paper, Typography } from '@defense-unicorns/unicorn-ui';
	import { getPackages, getPkgVersions } from './api/api';
</script>

<Box ssx={{$self: {display: 'flex', flexDirection: 'column'}}}>
<Typography variant="h1" style="align-self: center">Welcome to UDS Packages</Typography>
	{#await getPackages()}
		<Typography>Getting Packages</Typography>
	{:then res}
	{#each res as pkg, index}
	<Paper elevation={16} ssx={{$self: {padding: '1rem', marginBottom: '1rem'}}}>
		<Typography variant="h4">Package: {pkg.name}</Typography>
		<Typography variant="h6">Type: {pkg.package_type}</Typography>
		<Typography variant="h6">Created: {pkg.created_at}</Typography>
		<Typography variant="h6">Last updated: {pkg.updated_at}</Typography>
		<Typography variant="h6">Description: {pkg.repository && pkg.repository.description}</Typography>
		<Typography variant="h6">Repo: <a href={pkg.repository && pkg.repository.html_url}>{pkg.repository && pkg.repository.full_name}</a></Typography>
		<Typography variant="h6">Package URL: <a href={pkg.html_url}>{pkg.html_url}</a></Typography>
		<Typography variant="h6">Versions: </Typography>
		<Paper elevation={20} class="versions-paper">
			{#await getPkgVersions(pkg.name)}
			loading Versions
			{:then versions}
				{#each versions as ver}
				<div class="version">
					<div>Name: {ver.name}</div>
					<div>URL: <a href={ver.html_url}>{ver.html_url}</a></div>
					<div>Tags: 
						{#each ver.metadata.container.tags as tag}
							<span class="tag">{tag}</span>
						{/each}
					</div>

					<div>Use: {`docker pull ghcr.io/defenseunicorns/${pkg.name}@${ver.name}`}</div>
				</div>
				{/each}
			{/await}
		</Paper>
	</Paper>
		{/each}
	{/await}
</Box>

<style global>
	.versions-paper {
		padding: .5rem;
		overflow-y: scroll;
		overflow-x: hidden;
		max-height: 10rem;
	}

	.version {
		margin: .5rem
	}

	.tag {
		margin-left: 1rem;
	}
</style>
