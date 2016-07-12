import config from '../config';
import Event from './utils/event';
import Tracker from './utils/tracker';
import assets from './assets';
import template from './template';
import ima from './google/ima';
import youtube from './google/youtube';
import { isMobile } from './utils/mobile';

let App = function() {
    var self = this;

    this.event = new Event(this);
    this.tracker = new Tracker(this);

    this.yt = false;
    this.hasYT = true;

    assets();

    function googleLoaded() {
        return typeof google !== 'undefined' && typeof YT !== 'undefined' && typeof YT.Player !== 'undefined'
    }

    var waitGoogle = setInterval(function() {
        if (googleLoaded()) {
            clearInterval(waitGoogle);

            template(self);

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
