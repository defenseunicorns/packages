<script lang="ts">
	import { Button, Paper, currentTheme } from '@defense-unicorns/unicorn-ui';
	import type { SupportedThemes } from '@defense-unicorns/unicorn-ui';
	import type { NavbarProps } from './Navbar.tpes';

	type T = $$Generic<EventTarget>;
	type $$Props = NavbarProps<T>;

	let curTheme: string;

	currentTheme.subscribe((theme) => {
		curTheme = theme;
	});

	function changeTheme() {
		let themeChange: SupportedThemes;
		if (curTheme === 'dark') {
			themeChange = 'light';
		} else {
			themeChange = 'dark';
		}
		currentTheme.set(themeChange);
	}
</script>

<Paper elevation={20}>
	<div class="navbar">
		<img src="images/zarf-bubbles-right.png" width="40" height="40"/>
		<Button variant="text" on:click={changeTheme}>Theme Mode</Button>
	</div>
</Paper>

<style lang="scss">
	.navbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem;
		height: 3.5rem;
	}
</style>
