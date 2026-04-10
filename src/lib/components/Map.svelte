<script>
	// @ts-nocheck
	import { onMount, onDestroy } from 'svelte';

	const DEFAULT_ZOOM = 13;
	const MIN_ZOOM     = 10;

	const CENTER_LAT = -37.8136;
	const CENTER_LNG = 144.9631;

	const RADIUS_KM = 50;

	const MELBOURNE_BOUNDS = [
		[-39.30, 143.00],
		[-36.30, 147.00]
	];

	let mapEl;
	let map;
	let maskCanvas;

	function getCSSVar(name) {
		return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
	}

	function circleRadiusPx() {
		const northLat = CENTER_LAT + RADIUS_KM / 111.32;
		const c = map.latLngToContainerPoint([CENTER_LAT, CENTER_LNG]);
		const n = map.latLngToContainerPoint([northLat,   CENTER_LNG]);
		return Math.abs(c.y - n.y);
	}

	function drawMask() {
		if (!maskCanvas || !map) return;

		const w = maskCanvas.offsetWidth;
		const h = maskCanvas.offsetHeight;

		if (maskCanvas.width !== w || maskCanvas.height !== h) {
			maskCanvas.width  = w;
			maskCanvas.height = h;
		}

		const ctx    = maskCanvas.getContext('2d');
		const green  = getCSSVar('--color-green');
		const center = map.latLngToContainerPoint([CENTER_LAT, CENTER_LNG]);
		const radius = circleRadiusPx();

		ctx.clearRect(0, 0, w, h);

		ctx.globalCompositeOperation = 'source-over';
		ctx.globalAlpha = 0.88;
		ctx.fillStyle   = '#000000';
		ctx.fillRect(0, 0, w, h);

		ctx.globalCompositeOperation = 'destination-out';
		ctx.globalAlpha = 1;
		ctx.beginPath();
		ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
		ctx.fill();

		ctx.globalCompositeOperation = 'source-over';
		ctx.globalAlpha = 0.12;
		ctx.fillStyle   = green;
		ctx.beginPath();
		ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
		ctx.fill();

		ctx.globalAlpha = 1;
	}

	onMount(async () => {
		const L = (await import('leaflet')).default;

		if (!document.getElementById('leaflet-css')) {
			const link = document.createElement('link');
			link.id    = 'leaflet-css';
			link.rel   = 'stylesheet';
			link.href  = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
			document.head.appendChild(link);
		}

		map = L.map(mapEl, {
			center:             [CENTER_LAT, CENTER_LNG],
			zoom:               DEFAULT_ZOOM,
			minZoom:            MIN_ZOOM,
			maxZoom:            19,
			maxBounds:          L.latLngBounds(MELBOURNE_BOUNDS[0], MELBOURNE_BOUNDS[1]),
			maxBoundsViscosity: 1.0,
			zoomControl:        true,
			attributionControl: true
		});

		map.on('zoomend', () => console.log('[Map] zoom:', map.getZoom()));
		console.log('[Map] initial zoom:', DEFAULT_ZOOM, '| range:', MIN_ZOOM, '–19');

		L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
			subdomains: 'abcd',
			maxZoom: 19,
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
		}).addTo(map);

		maskCanvas = document.createElement('canvas');
		Object.assign(maskCanvas.style, {
			position:      'absolute',
			top:           '0',
			left:          '0',
			width:         '100%',
			height:        '100%',
			zIndex:        '950',
			pointerEvents: 'none'
		});
		mapEl.appendChild(maskCanvas);

		map.on('move zoom resize', drawMask);
		drawMask();

		map.zoomControl.setPosition('bottomright');
	});

	onDestroy(() => {
		if (map) map.remove();
	});
</script>

<div class="map-container" bind:this={mapEl}></div>

<style>
	.map-container {
		width: 100vw;
		height: 100vh;
		display: block;
	}
</style>
