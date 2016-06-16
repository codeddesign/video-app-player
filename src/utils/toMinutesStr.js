export default function(seconds) {
    var minutes = Math.floor(seconds / 60),
        seconds = Math.floor(seconds % 60);

    minutes = (minutes <= 9) ? ('0' + minutes) : minutes;
    seconds = (seconds <= 9) ? ('0' + seconds) : seconds;

    return [minutes, seconds].join(':');
}
