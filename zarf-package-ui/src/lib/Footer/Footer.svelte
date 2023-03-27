<script lang="ts">
	import { Paper } from '@defense-unicorns/unicorn-ui';
	import type { FooterProps } from './Footer.types';

	type T = $$Generic<EventTarget>;
	type $$Props = FooterProps<T>;
</script>

<Paper elevation={20}>
	<div class="footer">
		<div>Logo Zarf</div>
		<p>Copyright @ 2023 Zarf Project, All right reserved.</p>
		<div>slack logo button</div>
		<div>github logo button</div>
	</div>
</Paper>

<style lang="scss">
	.footer {
		display: flex;
		align-items: center;
		justify-content: space-around;
	}
</style>
