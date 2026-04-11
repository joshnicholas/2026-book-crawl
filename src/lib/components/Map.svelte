<script>
	// @ts-nocheck
	import { onMount, onDestroy } from 'svelte';
	import { base } from '$app/paths';

	const DEFAULT_ZOOM = 10;
	const MIN_ZOOM     = 10;

	const CENTER_LAT = -37.8136;
	const CENTER_LNG = 144.9631;

	const RADIUS_KM = 50;

	const MELBOURNE_BOUNDS = [
		[143.00, -39.30],
		[147.00, -36.30]
	];

	let mapEl;
	let map;
	let maskCanvas;
	let byJoshEl;
	let attrObserver;

	function getCSSVar(name) {
		return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
	}

	function buildStyle(c) {
		return {
			version: 8,
			glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
			sources: {
				ofm: {
					type: 'vector',
					url: 'https://tiles.openfreemap.org/planet'
				}
			},
			layers: [
				{ id: 'background', type: 'background',
					paint: { 'background-color': c.background } },

				{ id: 'water', type: 'fill', source: 'ofm', 'source-layer': 'water',
					paint: { 'fill-color': c.water } },

				{ id: 'waterway', type: 'line', source: 'ofm', 'source-layer': 'waterway',
					paint: { 'line-color': c.water,
						'line-width': ['interpolate', ['linear'], ['zoom'], 8, 0.5, 16, 3] } },

				{ id: 'landcover', type: 'fill', source: 'ofm', 'source-layer': 'landcover',
					paint: { 'fill-color': c.land } },

				{ id: 'landuse-park', type: 'fill', source: 'ofm', 'source-layer': 'landuse',
					filter: ['match', ['get', 'class'],
						['park', 'cemetery', 'recreation_ground', 'nature_reserve', 'forest'], true, false],
					paint: { 'fill-color': c.park } },

				{ id: 'landuse-urban', type: 'fill', source: 'ofm', 'source-layer': 'landuse',
					filter: ['match', ['get', 'class'],
						['residential', 'commercial', 'industrial', 'retail'], true, false],
					paint: { 'fill-color': c.urban } },

				{ id: 'road-minor', type: 'line', source: 'ofm', 'source-layer': 'transportation',
					filter: ['match', ['get', 'class'], ['minor', 'service', 'track', 'path'], true, false],
					layout: { 'line-cap': 'round', 'line-join': 'round' },
					paint: { 'line-color': c.roadMinor,
						'line-width': ['interpolate', ['linear'], ['zoom'], 11, 0.4, 16, 2] } },

				{ id: 'road-secondary', type: 'line', source: 'ofm', 'source-layer': 'transportation',
					filter: ['match', ['get', 'class'], ['secondary', 'tertiary'], true, false],
					layout: { 'line-cap': 'round', 'line-join': 'round' },
					paint: { 'line-color': c.roadSecondary,
						'line-width': ['interpolate', ['linear'], ['zoom'], 9, 0.8, 16, 5] } },

				{ id: 'road-primary', type: 'line', source: 'ofm', 'source-layer': 'transportation',
					filter: ['match', ['get', 'class'], ['primary', 'trunk'], true, false],
					layout: { 'line-cap': 'round', 'line-join': 'round' },
					paint: { 'line-color': c.roadPrimary,
						'line-width': ['interpolate', ['linear'], ['zoom'], 8, 1, 16, 7] } },

				{ id: 'road-motorway', type: 'line', source: 'ofm', 'source-layer': 'transportation',
					filter: ['==', ['get', 'class'], 'motorway'],
					layout: { 'line-cap': 'round', 'line-join': 'round' },
					paint: { 'line-color': c.roadMotorway,
						'line-width': ['interpolate', ['linear'], ['zoom'], 7, 1, 16, 9] } },

				{ id: 'building', type: 'fill', source: 'ofm', 'source-layer': 'building',
					paint: { 'fill-color': c.building, 'fill-outline-color': c.buildingOutline } },

				{ id: 'label-place', type: 'symbol', source: 'ofm', 'source-layer': 'place',
					filter: ['match', ['get', 'class'],
						['city', 'town', 'village', 'suburb', 'neighbourhood'], true, false],
					layout: {
						'text-field': ['get', 'name'],
						'text-font': [c.labelFont],
						'text-size': ['interpolate', ['linear'], ['zoom'], 10, 10, 15, 14],
						'text-max-width': 8
					},
					paint: { 'text-color': c.label,
						'text-halo-color': c.labelHalo, 'text-halo-width': 1.5 } }
			]
		};
	}

	function circleRadiusPx() {
		const northLat = CENTER_LAT + RADIUS_KM / 111.32;
		const c = map.project([CENTER_LNG, CENTER_LAT]);
		const n = map.project([CENTER_LNG, northLat]);
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
		const cp     = map.project([CENTER_LNG, CENTER_LAT]);
		const radius = circleRadiusPx();

		ctx.clearRect(0, 0, w, h);

		ctx.globalCompositeOperation = 'source-over';
		ctx.globalAlpha = 0.88;
		ctx.fillStyle   = '#000000';
		ctx.fillRect(0, 0, w, h);

		ctx.globalCompositeOperation = 'destination-out';
		ctx.globalAlpha = 1;
		ctx.beginPath();
		ctx.arc(cp.x, cp.y, radius, 0, Math.PI * 2);
		ctx.fill();

		ctx.globalCompositeOperation = 'source-over';
		ctx.globalAlpha = 0.12;
		ctx.fillStyle   = green;
		ctx.beginPath();
		ctx.arc(cp.x, cp.y, radius, 0, Math.PI * 2);
		ctx.fill();

		ctx.globalAlpha = 1;
	}

	onMount(async () => {
		const maplibregl = (await import('maplibre-gl')).default;

		if (!document.getElementById('maplibre-css')) {
			const link = document.createElement('link');
			link.id   = 'maplibre-css';
			link.rel  = 'stylesheet';
			link.href = 'https://unpkg.com/maplibre-gl@5/dist/maplibre-gl.css';
			document.head.appendChild(link);
		}

		const colors = {
			background:      getCSSVar('--map-background'),
			land:            getCSSVar('--map-land'),
			water:           getCSSVar('--map-water'),
			park:            getCSSVar('--map-park'),
			urban:           getCSSVar('--map-urban'),
			roadMinor:       getCSSVar('--map-road-minor'),
			roadSecondary:   getCSSVar('--map-road-secondary'),
			roadPrimary:     getCSSVar('--map-road-primary'),
			roadMotorway:    getCSSVar('--map-road-motorway'),
			building:        getCSSVar('--map-building'),
			buildingOutline: getCSSVar('--map-building-outline'),
			label:           getCSSVar('--map-label'),
			labelHalo:       getCSSVar('--map-label-halo'),
			labelFont:       getCSSVar('--map-label-font')
		};

		map = new maplibregl.Map({
			container:        mapEl,
			style:            buildStyle(colors),
			center:           [CENTER_LNG, CENTER_LAT],
			zoom:             DEFAULT_ZOOM,
			minZoom:          MIN_ZOOM,
			maxZoom:          19,
			maxBounds:        MELBOURNE_BOUNDS,
			attributionControl: false
		});

		map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
		map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

		// "by Josh" toggles the attribution; hide it when credits are open.
		setTimeout(() => {
			const attrEl = mapEl.querySelector('.maplibregl-ctrl-attrib');
			if (!attrEl) return;

			byJoshEl.addEventListener('click', (e) => {
				e.preventDefault();
				attrEl.classList.toggle('maplibregl-compact-show');
			});

			attrObserver = new MutationObserver(() => {
				byJoshEl.style.display = attrEl.classList.contains('maplibregl-compact-show') ? 'none' : 'block';
			});
			attrObserver.observe(attrEl, { attributes: true, attributeFilter: ['class'] });
		}, 0);

		maskCanvas = document.createElement('canvas');
		Object.assign(maskCanvas.style, {
			position:      'absolute',
			top:           '0',
			left:          '0',
			width:         '100%',
			height:        '100%',
			zIndex:        '1',
			pointerEvents: 'none'
		});
		mapEl.appendChild(maskCanvas);

		map.on('move', drawMask);
		map.on('resize', drawMask);
		map.on('zoomend', () => console.log('[Map] zoom:', map.getZoom()));

		map.on('load', async () => {
			drawMask();
			try {
				const res = await fetch(`${base}/data/markers.json`);
				if (!res.ok) return;
				const markers = await res.json();
				if (!markers.length) return;

				const rotationRange = parseFloat(getCSSVar('--marker-rotation-range')) || 0;

				// Shared state to prevent flicker when moving between
				// nearby markers or from a marker into its popup.
				let hideTimer = null;
				let visiblePopup = null;

				function showPopup(popup, lngLat) {
					clearTimeout(hideTimer);
					if (visiblePopup && visiblePopup !== popup) visiblePopup.remove();
					visiblePopup = popup;
					popup.setLngLat(lngLat).addTo(map);
				}

				function scheduleHide(popup) {
					hideTimer = setTimeout(() => {
						popup.remove();
						if (visiblePopup === popup) visiblePopup = null;
					}, 180);
				}

				markers.forEach((m) => {
					const el = document.createElement('div');
					el.className = 'map-marker';

					// Use both thumb sizes so the browser picks the right one.
					const thumbMobile = m.thumb_mobile ?? m.thumb;
					el.innerHTML = `<img
						src="${base}${m.thumb}"
						srcset="${base}${thumbMobile} 100w, ${base}${m.thumb} 150w"
						sizes="(max-width: 768px) 100px, 150px"
						alt="${m.cafe_name}">`;

					const deg = (Math.random() * 2 - 1) * rotationRange;
					el.querySelector('img').style.rotate = `${deg}deg`;

					const popup = new maplibregl.Popup({
						closeButton: false,
						closeOnClick: false,
						className: 'marker-popup-wrap'
					}).setHTML(`
						<div class="marker-popup">
							<button class="popup-close" aria-label="Close">✕</button>
							<img src="${base}${m.image}" alt="${m.caption}">
							<div class="popup-text">
								<p><strong>${m.cafe_name}</strong></p>
								<p>${m.caption}</p>
							</div>
						</div>
					`);

					// Cancel hide when popup itself is hovered.
					popup.on('open', () => {
						const popupEl = popup.getElement();
						if (popupEl) {
							popupEl.addEventListener('mouseenter', () => clearTimeout(hideTimer));
							popupEl.addEventListener('mouseleave', () => scheduleHide(popup));
							const closeBtn = popupEl.querySelector('.popup-close');
							if (closeBtn) {
								closeBtn.addEventListener('click', (e) => {
									e.stopPropagation();
									popup.remove();
									if (visiblePopup === popup) visiblePopup = null;
								});
							}
						}
					});

					new maplibregl.Marker({ element: el })
						.setLngLat([m.lng, m.lat])
						.addTo(map);

					el.addEventListener('mouseenter', () => showPopup(popup, [m.lng, m.lat]));
					el.addEventListener('mouseleave', () => scheduleHide(popup));
					el.addEventListener('click', (e) => {
						e.stopPropagation();
						if (visiblePopup === popup) {
							popup.remove();
							visiblePopup = null;
						} else {
							showPopup(popup, [m.lng, m.lat]);
						}
					});
				});


			} catch (_) {}
		});
	});

	onDestroy(() => {
		if (attrObserver) attrObserver.disconnect();
		if (map) map.remove();
	});
</script>

<div class="map-container" bind:this={mapEl}></div>
<a class="by-josh" href="https://joshnicholas.com" rel="me" bind:this={byJoshEl}>by Josh</a>

<style>
	.map-container {
		width: 100vw;
		height: 100vh;
		display: block;
	}
</style>
