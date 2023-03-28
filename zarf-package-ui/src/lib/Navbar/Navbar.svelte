<script lang="ts">
	import { Paper, currentTheme, IconButton, Box } from '@defense-unicorns/unicorn-ui';
	import type { NavbarProps } from './Navbar.tpes';
	import GithubIcon from '$lib/assets/svg/GithubIcon.svelte';
	import SlackIcon from '$lib/assets/svg/SlackIcon.svelte';

	type T = $$Generic<EventTarget>;
	type $$Props = NavbarProps<T>;

	function changeTheme() {
		currentTheme.update((theme) => {
			return theme === 'dark' ? 'light' : 'dark'
		})
	}
</script>

<Paper elevation={20} class="navbar">
		<img src="images/zarf-bubbles-right.png" width="40" height="40" alt="zarf logo"/>
		<Box ssx={{$self: {display: 'flex', gap: '1rem'}}}>
		<a href="https://zarf.dev/slack"><SlackIcon /></a>
		<a href="https://github.com/defenseunicorns"><GithubIcon /></a>
		<IconButton
			on:click={changeTheme}
			iconContent="dark_mode"
			toggledIconContent="light_mode"
			toggleable
			toggled={$currentTheme === 'dark'}
			iconClass="material-symbols-outlined"
			toggledIconClass="material-symbols-outlined"
		/>
	</Box>
</Paper>

<style lang="scss">
	:global(.navbar) {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem;
		height: 3.5rem;
	}
</style>
