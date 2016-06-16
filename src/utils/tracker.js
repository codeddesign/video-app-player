import config from '../../config'

export default function(player) {
    var self = this;

    this.route = config.path.app + '/vast/track';

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
            data.campaign = player.campaignId;

            var image = new Image();

            image.src = self.route + inlineData(data);
        }
    }
}
