window.onload = function() {
    window.menuOpen = false;
    document.getElementsByClassName('navigation-toggle')[0].onclick = function() {
        menu = document.getElementsByClassName('navigation-menu')[0];

        if (window.menuOpen === true) { menu.style.display = "none"; }
        else { menu.style.display = "block"; }

        window.menuOpen = !window.menuOpen;
    }
}
