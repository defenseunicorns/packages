<script lang="ts">
	import '../app.css';
	import 'material-symbols/'
	import Footer from '$lib/Footer/Footer.svelte';
	import Navbar from '$lib/Navbar/Navbar.svelte';
	import {Theme } from '@defense-unicorns/unicorn-ui';
</script>
<Theme>
	<Navbar />
	<main>
		<slot />
	</main>
	<Footer />
</Theme>

<style>
	main {
		padding: 1rem;
	}
</style>
