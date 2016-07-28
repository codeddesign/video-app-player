import config from '../config';
import Event from './utils/event';
import Tracker from './utils/tracker';
import assets from './assets';
import template from './template';
import ima from './google/ima';
import youtube from './google/youtube';
import { isMobile } from './utils/mobile';
import $ from './utils/element';
import ajax from './utils/ajax';

function googleLoaded() {
    return typeof google !== 'undefined' && typeof YT !== 'undefined' && typeof YT.Player !== 'undefined'
}

let App = function() {
    var self = this,
        script = $(document).find(`script[src^="${config.path.player}"]:not([active])`),
        data = script.attr('src').split('/p')[1].split('.'),
        campaignId = data[0],
        waitGoogle;

    script.attr('active', true);

    this.campaignId = campaignId;
    this.event = new Event(this);
    this.tracker = new Tracker(this);

    this.yt = false;

    this.data = false;

    assets();

    ajax().get(config.path.app + '/campaign/' + campaignId, function(request) {
        if (request.status != 200) {
            console.warn('Something went wrong while loading campaign');
            return false;
        }

        self.data = JSON.parse(request.response);

        waitGoogle = setInterval(function() {
            if (googleLoaded()) {
                clearInterval(waitGoogle);

                template(self, script);

                if (self.hasYT) {
                    youtube(self);
                }

                new ima(self);

                setInterval(function() {
                    if (self.hasYT) {
                        self.event.trigger('yt:progressing');
                    }
                }, 1000);
            }
        }, 10);
    });
};


// init
new App;

window.fbAsyncInit = function() {
    FB.init({
        appId: config.fbId,
        xfbml: true,
        version: 'v2.6'
    });
};

(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }

    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
