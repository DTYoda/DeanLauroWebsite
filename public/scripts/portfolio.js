var hovered = null;

window.onload = () => {
    fadeIn($(".background-text-main")[0], false)
    setTimeout(() => {
        fadeIn($(".background-text-sub")[0], false);
    }, 1000);
};

function fadeIn(element, toggle) {
    if(!element) return;
    
    if(element.style.opacity > 0.1)
    {
        var op = Number(element.style.opacity);
    }
    else
    {
        var op = 0.1;
    }
    var timer = setInterval(function () {
        if(toggle)
        {
            if (op >= 1 || hovered != element) {
                clearInterval(timer);
            }
        }
        else{
            if (op >= 1) {
                clearInterval(timer);
            }
        }
        
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.05;
    }, 10);
}

function fadeOut(element, toggle) {
    if(!element) return;
    if(element.style)
        {
            var op = element.style.opacity;
        }
        else{
            var op = 1;
        }
    var timer = setInterval(function () {
        if(toggle)
            {
                if (op <= 0 || hovered == element) {
                    clearInterval(timer);
                }
            }
            else{
                if (op <= 0) {
                    clearInterval(timer);
                }
            }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.05;
    }, 10);
}

$(".project").hover((obj) => {
    fadeIn(obj.target.children[0], true);
    hovered = obj.target.children[0]
    obj.target.style.opacity = 0.5;
}, (obj) => {
    fadeOut(obj.target.children[0], true);
    hovered = null;
    obj.target.style.opacity = 1;
});