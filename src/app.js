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
import Tags from './utils/tags';

function googleLoaded() {
    return typeof google !== 'undefined' && typeof YT !== 'undefined' && typeof YT.Player !== 'undefined'
}

function isDashbid(ad) {
    return ad.tagUrl.indexOf('dashbid') !== -1;
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

    this.isStream = false;

    this.AD = false;

    assets();

    ajax().get(config.path.app + '/campaign/' + campaignId, function(request) {
        if (request.status != 200) {
            console.warn('Something went wrong while loading campaign');
            return false;
        }

        self.data = JSON.parse(request.response);

        self.isStream = self.data.info.type == 'onscrolldisplay';

        var tags = new Tags(self),
            ad,
            ads = [];

        waitGoogle = setInterval(function() {
            if (googleLoaded()) {
                clearInterval(waitGoogle);

                template(self, script);

                youtube(self);

                var tagUrls = (new Tags(self)).urls();

                tagUrls.forEach(function(tagUrl) {
                    ad = new ima(self);
                    ad.setUpIMA(tagUrl, function() {
                        ads.push(this);

                        if (ads.length == tagUrls.length) {
                            self.$els.overlay.find('.icon-play').show();

                            for (var i = 0; i < ads.length; i++) {
                                if (ads[i].adError) {
                                    continue;
                                }

                                if (!self.AD) {
                                    self.AD = ads[i];
                                    self.AD.$el.show();
                                }

                                // switch from dashbid
                                if (self.AD && isDashbid(self.AD) && !isDashbid(ads[i])) {
                                    self.AD.$el.hide();

                                    self.AD = ads[i];
                                    self.AD.$el.show();
                                    continue;
                                }
                            }
                        }
                    });
                });

                self.$els.overlay.addEventListener('click', function() {
                    self.$els.overlay.find('.icon-play').hide();

                    if (self.AD) {
                        self.AD.playAd();

                        return false;
                    }

                    self.event.trigger('yt:init');
                });

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
