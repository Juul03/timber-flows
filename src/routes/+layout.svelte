<script>
	import { injectAnalytics, Analytics } from '@vercel/analytics/sveltekit';

	injectAnalytics();
</script>

<slot />
<Analytics />
