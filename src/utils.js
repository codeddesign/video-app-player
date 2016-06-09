export function toMinutesStr(seconds) {
    var minutes = Math.floor(seconds / 60),
        seconds = Math.floor(seconds % 60);

    minutes = (minutes <= 9) ? ('0' + minutes) : minutes;
    seconds = (seconds <= 9) ? ('0' + seconds) : seconds;

    return [minutes, seconds].join(':');
}

export function progressCursor(e) {
    return e.layerX * this.max / this.offsetWidth;
}

export function onHoverShowEls(player) {
        player.$els.controls.removeClass('hidden');
        player.$els.share.removeClass('hidden');
    }

export function onHoverHideEls(player) {
    player.$els.controls.addClass('hidden');
    player.$els.share.addClass('hidden');
}