<script lang="ts">
	import GithubIcon from '$lib/assets/svg/GithubIcon.svelte';
	import SlackIcon from '$lib/assets/svg/SlackIcon.svelte';
	import { Box, Paper, Typography } from '@defense-unicorns/unicorn-ui';
	import type { FooterProps } from './Footer.types';

	type T = $$Generic<EventTarget>;
	type $$Props = FooterProps<T>;
</script>

<Paper elevation={20} class="footer">
	<Typography variant="body1" class="footer-copyright">Copyright &copy 2023 Zarf Project, All right reserved.</Typography>
	<Box ssx={{$self: {display: 'flex', alignItems: 'center', gap: '1rem'}}}>
		<a href="https://zarf.dev/slack"><SlackIcon /></a>
		<a href="https://github.com/defenseunicorns"><GithubIcon /></a>
	</Box>
</Paper>

<style>
	:global(.footer) {
		display: flex;
		align-items: center;
		padding: .5rem;
		justify-content: space-between;
	}

	:global(.footer-copyright) {
		flex-grow: 1; 
		text-align:center;
	}
</style>
