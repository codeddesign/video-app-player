export var isMobile = (function() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
})()

export var isIGadget = (function() {
    return /webOS|iPhone|iPad|iPod/i.test(navigator.userAgent)
})()
