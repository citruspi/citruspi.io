function onLoad(callback) {
    if (window.addEventListener) {
        window.addEventListener('load',callback,false);
    } else{
        window.attachEvent('onload',callback);
    }
}

function onResize(callback) {
    if (window.addEventListener) {
        window.addEventListener('resize',callback,false);
    } else{
        window.attachEvent('onresize',callback);
    }
}
