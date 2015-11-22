window.onload = function() {
    window.menuOpen = false;
    document.getElementsByClassName('navigation-toggle')[0].onclick = function() {
        menu = document.getElementsByClassName('navigation-menu')[0];

        if (window.menuOpen === true) { menu.style.display = "none"; }
        else { menu.style.display = "block"; }

        window.menuOpen = !window.menuOpen;
    }

    /*
    var main = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © OpenStreetMap contributors',
        minZoom: 5,
        maxZoom: 18,
    });
    */

    var main = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012',
    });

    var mapElement = document.getElementById('map')

    var map = L.map('map')
                .addLayer(main)
                .setView([mapElement.dataset.lat, mapElement.dataset.long],
                         mapElement.dataset.zoom);

    markers = mapElement.dataset.markers;

    if (markers !== undefined) {
        markers = markers.split(',');
        markers.splice(markers.length-1, 1);

        for (i = 0; i < markers.length; i+=2) {
            L.marker([markers[i], markers[i+1]]).addTo(map);
        }
    }
}
