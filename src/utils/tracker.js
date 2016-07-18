import config from '../../config';
import isPreview from './isPreview';

export default function(app) {
    var self = this;

    this.route = config.path.app + '/track';

    this.tracked = {};

    var inlineData = function(data) {
        var inline = [];

        Object.keys(data).forEach(function(key) {
            inline.push(`${key}=${data[key]}`);
        });

        if (!inline.length) {
            return ''
        }

        return '?' + inline.join('&');
    }

    return {
        event: function(name, event, unique) {
            var _trackId = name + '|' + event;

            if (isPreview) {
                return false;
            }

            if (unique && self.tracked[_trackId]) {
                return false;
            }

            self.tracked[_trackId] = Date.now();

            var image = new Image();
            image.src = self.route + inlineData({
                i: app.campaignId,
                n: name,
                e: event
            });
        }
    }
}
