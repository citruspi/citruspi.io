function configureMaps() {
    var main = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012',
    });

    var mapElement = document.getElementById('map')

    var browserWidth = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;

    zoomData = mapElement.dataset.zoom;

    if (zoomData === undefined) {
        zoomData = "0,3,";
    }

    zoomLevels = zoomData.split(',');

    if (zoomLevels.length % 2 === 1) {
        zoomLevels.splice(zoomLevels.length-1, 1);
    }

    for (i = 0; i < zoomLevels.length; i+=2) {
        width = parseInt(zoomLevels[i]);
        level = parseInt(zoomLevels[i+1]);

        if (browserWidth >= width) {
            mapZoom = level;
        }
    }

    var map = L.map('map')
                .addLayer(main)
                .setView([mapElement.dataset.lat, mapElement.dataset.long],
                         mapZoom);

    map.scrollWheelZoom.disable();

    markers = mapElement.dataset.markers;

    if (markers !== undefined) {
        markers = markers.split(',');
        markers.splice(markers.length-1, 1);

        for (i = 0; i < markers.length; i+=2) {
            L.marker([markers[i], markers[i+1]]).addTo(map);
        }
    }
}

onLoad(configureMaps);
onResize(configureMaps);
