window.onload = () => {
    $(".background-text-sub")[0].style.opacity = 0;
    fadeIn($(".background-text-main")[0])
    setTimeout(() => {
        fadeIn($(".background-text-sub")[0])
    }, 1000);
};

function fadeIn(element) {
    var op = 0.1;  // initial opacity
    var timer = setInterval(function () {
        if (op >= 1){
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.05;
    }, 10);
}