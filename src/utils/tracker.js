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
        event: function(data) {
            if (self.tracked[data.event] || isPreview) {
                return false;
            }

            self.tracked[data.event] = Date.now();

            data.campaign = app.campaignId;

            var image = new Image();
            image.src = self.route + inlineData(data);
        }
    }
}
