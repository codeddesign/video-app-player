export var isMobile = (function() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
})()

export var isIGadget = (function() {
    return /webOS|iPhone|iPad|iPod/i.test(navigator.userAgent)
})()


export var isIPhone = (function() {
    var agent = /iPhone|iPod/i.test(navigator.userAgent),
        platform = /iPhone|iPod/i.test(navigator.platform);

    return agent && platform;
})()
