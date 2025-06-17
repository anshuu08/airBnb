
       
	   mapboxgl.accessToken = mapToken;
       const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v11', 
        center: [77.209,28.6139], // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
      });

      const marker1 = new mapboxgl.Marker()
        .setLngLat(coordinates)//listing geometry cordinates
        .addTo(map);
      console.log(coordinates);
