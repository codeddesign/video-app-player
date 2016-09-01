import { isMobile } from './mobile';
import r from './referer';
import isTest from './isTest';

export default function Tags(app) {
    this.APP = app;

    this.list = app.data.tags;

    this.type = this.APP.isStream ? 'stream' : 'general';

    this.mode = isMobile ? 'mobile' : 'desktop';
}

Tags.prototype.urls = function(first) {
    var first = first || false,
        tag = this.list[this.type][this.mode];

    if (isTest && typeof TESTING !== 'undefined' && TESTING.tag) {
        tag = [TESTING.tag];
    }

    if (tag instanceof Array) {
        tag.forEach(function(url, index) {
            tag[index] = this.replaceData(url);
        }.bind(this));

        return tag;
    }

    return this.replaceData(tag);
}

Tags.prototype.replaceData = function(url) {
    let mapped = {
        '[description_url]': encodeURIComponent(r.path.full),
        '[width]': this.APP.$container.offsetWidth || 640,
        '[height]': this.APP.$container.offsetHeight || 360,
        '[cache_breaker]': Date.now() + Math.random()
    };

    Object.keys(mapped).forEach(function(key) {
        url = url.replace(key, mapped[key]);
    });

    return url;
}
