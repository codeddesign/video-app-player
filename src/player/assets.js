import config from '../../config';
import $ from '../utils/element'

export default function() {
    var head = $(document).find('head'),
        els = [
        {
            tag: 'link',
            options: {
                rel: 'stylesheet',
                href: config.path.player + '/css/style.css'
            }
        },
        {
            tag: 'link',
            options: {
                rel: 'stylesheet',
                href: config.path.player + '/css/glyphter-font/css/adzicons.css'
            }
        },
        {
            tag: 'script',
            options: {
                src: 'https://www.youtube.com/iframe_api'
            }
        }],
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
