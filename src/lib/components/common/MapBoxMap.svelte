<script>
  import { onMount, onDestroy } from 'svelte';
  import { MAP_THEMES } from '$lib/config/mapboxThemes';
  import { PUBLIC_MAPBOX_TOKEN } from '$env/static/public';
  import 'mapbox-gl/dist/mapbox-gl.css';

  export let theme = 'light';
  export let center = [-1.6178, 54.9783];
  export let zoom = 12;
  export let markers = [];

  let map;
  let mapContainer;
  let observer;
  let hasLoaded = false;

  console.log( "Center", center );

  async function initMap() {
    if (hasLoaded) return;
    hasLoaded = true;

    const token = PUBLIC_MAPBOX_TOKEN;

    if (!token) {
      console.error('MapboxMap Error: PUBLIC_MAPBOX_TOKEN missing');
      return;
    }

    const mapboxgl = (await import('mapbox-gl')).default;
    mapboxgl.accessToken = token;

    map = new mapboxgl.Map({
      container: mapContainer,
      style: MAP_THEMES[theme]?.style || MAP_THEMES.light.style,
      center,
      zoom
    });

    map.addControl(new mapboxgl.NavigationControl());

    markers.forEach((m) => {

        console.log( 'Marker:', m.coordinates[0] + ' ' + m.coordinates[1] );
        
      const marker = new mapboxgl.Marker()
        .setLngLat([m.coordinates[0], m.coordinates[1]]);

      if (m.title) {
        marker.setPopup(new mapboxgl.Popup().setText(m.title));
      }

      marker.addTo(map);
    });

    new mapboxgl.Marker({ color: 'red' })
    .setLngLat([-1.6178, 54.9783])
    .addTo(map);

  }

  onMount(() => {
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          initMap();
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px'
      }
    );

    observer.observe(mapContainer);
  });

  onDestroy(() => {
    observer?.disconnect();
    map?.remove();
  });
</script>

<div bind:this={mapContainer} class="map">
  <div class="map__placeholder">
    Loading map…
  </div>
</div>

<style>
  .map {
    width: 100%;
    height: 50vh;
    max-height: 600px;
    position: relative;
    overflow: hidden;
    background: #f3f3f3;

  }

  .map__placeholder {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    font-size: 0.9rem;
    color: #777;
  }
</style>