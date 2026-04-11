<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { base } from '$app/paths';

	let { children } = $props();
	let count = $state(0);

	onMount(async () => {
		try {
			const res = await fetch(`${base}/data/markers.json`);
			if (res.ok) {
				const markers = await res.json();
				count = markers.length;
			}
		} catch (_) {}
	});
</script>

<header class="site-header">
	Melbourne book crawl 2026
	<span class="site-subtitle">{count}/39 scribbled</span>
</header>

<a class="by-josh" href="https://joshnicholas.com" rel="me">by Josh</a>
<p class="map-attribution">Data from OpenStreetMap</p>

<div class="app">
	{@render children()}
</div>
