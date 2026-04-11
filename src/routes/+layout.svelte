<script>
	import '../app.css';
	let { children } = $props();
</script>

<header class="site-header">Scribbling every bookshop on the Melbourne book crawl</header>

<div class="app">
	{@render children()}
</div>
