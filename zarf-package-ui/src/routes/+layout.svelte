<script lang="ts">
	import '../app.css';
	import Footer from '$lib/Footer/Footer.svelte';
	import Navbar from '$lib/Navbar/Navbar.svelte';
	import { Box, Theme } from '@defense-unicorns/unicorn-ui';

	const layoutBox = {
		display: 'flex',
		'flex-direction': 'column',
		'justify-content': ' space-between',
		height: '100vh',
		'flex-grow': 1
	};
</script>

<Theme>
	<Box ssx={{ $self: layoutBox }}>
		<Navbar />
		<main>
			<slot />
		</main>
		<Footer />
	</Box>
</Theme>

<style>
	main {
		padding: 1rem;
	}
</style>
