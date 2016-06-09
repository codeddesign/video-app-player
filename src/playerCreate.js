import $ from './Element'

var addAssets = function() {
    var head = $(document).find('head'),
        els = [
            { tag: 'link', options: { rel: 'stylesheet', href: 'http://localhost:8000/css/style.css' } },
            { tag: 'link', options: { rel: 'stylesheet', href: 'http://localhost:8000/css/glyphter-font/css/adzicons.css' } },
            { tag: 'script', options: { src: 'https://www.youtube.com/iframe_api' } }
        ],
        attr;

    els.forEach(function(r) {
        attr = 'href';
        if (!r.options[attr]) {
            attr = 'src';
        }

        if (!$(document).find(`${r.tag}[${attr}="${r.options[attr]}"]`, true)) {
            head.insertElement(r.tag, r.options);
        }
    })
}

export default function(player) {
    var scriptAttribute = 'video',
        script = $(document).find('script[' + scriptAttribute + ']'),
        videoId = script.attr(scriptAttribute),
        html = `
        <div class="player__container" id="${videoId}">
            <div class="player__poster hideme" style="background-image: url(http://img.youtube.com/vi/${videoId}/hqdefault.jpg);"></div>
            <span class="player__play hideme"><span class="icon-play"></span></span>
            <video class="player__video"></video>
            <div class="player__controls hidden">
                <progress class="player__progress" min="0" max="0" value="0"></progress>
                <div class="left">
                    <span class="icon-play"></span>
                    <span class="time">
                        <span class="current">00:00</span> / <span class="total">00:00</span>
                    </span>
                </div>
                <div class="right">
                    <span class="icon-volume2"></span>
                    <span class="icon-fullscreen"></span>
                </div>
            </div>
            <div class="player__share hidden">
                <span class="icon-share1"></span>\
                <span class="icon-facebook-sq"></span>\
                <span class="icon-twitter-sq"></span>\
            </div>
            <div class="player__code">
                <span class="close">&#x2715;</span>
                <span>Add this code to your website</span>
                <textarea rows="2">${script.outerHTML.trim()}</textarea>
            </div>
        </div>`;

    addAssets();

    script.replaceElement(html);

    return videoId;
}
