window.onload = function() {
    window.menuOpen = false;
    document.getElementsByClassName('navigation-toggle')[0].onclick = function() {
        menu = document.getElementsByClassName('navigation-menu')[0];

        if (window.menuOpen === true) { menu.style.display = "none"; }
        else { menu.style.display = "block"; }

        window.menuOpen = !window.menuOpen;
    }

    var main = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © OpenStreetMap contributors',
        minZoom: 5,
        maxZoom: 18,
    });

    var mapElement = document.getElementById('map')

    var map = L.map('map')
                .addLayer(main)
                .setView([mapElement.dataset.lat, mapElement.dataset.long],
                         mapElement.dataset.zoom);

    L.marker([mapElement.dataset.lat, mapElement.dataset.long]).addTo(map);
}
