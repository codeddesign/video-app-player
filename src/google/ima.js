import config from '../../config';
import {
    isMobile,
    isIGadget,
    isIPhone
} from '../utils/mobile';
import r from '../utils/referer';
import isTest from '../utils/isTest';
import random from '../utils/random';
import Animator from '../utils/animator';

var alternativeSize = {
    width: 640,
    height: 360
};

export default function Ad(app) {
    var self = this;

    this.APP = app;

    this.clickedPlay = false;
    this.hadAutoPlay = false;
    this.adError = false;
    this.adsLoader;
    this.adsRequest;
    this.adsManager;
    this.adDisplayContainer;
    this.intervalTimer;
    this.errorSource = false; // false / ad / manager
    this.adLoaded = false;
    this.onScreen = false;

    this.onLoadCallback = false;

    this.adId = 'a' + random();

    this.APP.$container.insertElement('div', {
        className: ['player__video ad hidden', this.adId].join(' ')
    });

    this.$el = this.APP.$container.find('.' + this.adId);

    this.imaVideo = false;
}

Ad.prototype.setUpIMA = function(tagUrl, onLoadCallback) {
    this.tagUrl = tagUrl;

    this.onLoadCallback = onLoadCallback || function() {};

    // Create the ad display container.
    this.adDisplayContainer = new google.ima.AdDisplayContainer(
        this.$el,
        null
    );

    // Create ads loader.
    this.adsLoader = new google.ima.AdsLoader(this.adDisplayContainer);

    // Vpaid set
    this.adsLoader.getSettings().setVpaidMode(google.ima.ImaSdkSettings.VpaidMode.ENABLED);

    this.adsLoader.getSettings().setNumRedirects(10);

    this.adsLoader.addEventListener(
        google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
        this.onAdsManagerLoaded.bind(this),
        false
    );

    this.adsLoader.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        this.onAdsManagerError.bind(this),
        false
    );

    // Create ads request.
    this.adsRequest = new google.ima.AdsRequest();
    this.adsRequest.adTagUrl = tagUrl;

    this.adsRequest.linearAdSlotWidth = this.APP.$container.offsetWidth || alternativeSize.width;
    this.adsRequest.linearAdSlotHeight = this.APP.$container.offsetHeight || alternativeSize.height;

    this.adsRequest.nonLinearAdSlotWidth = this.APP.$container.offsetWidth || alternativeSize.width;
    this.adsRequest.nonLinearAdSlotHeight = this.APP.$container.offsetHeight || alternativeSize.height;

    // Request ads.
    this.adsLoader.requestAds(this.adsRequest);
}

Ad.prototype.onAdsManagerLoaded = function(event) {
    console.info('Manager loaded', this.adId);

    this.APP.$container.show();

    // Get the ads manager.
    var adsRenderingSettings = new google.ima.AdsRenderingSettings();

    adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
    adsRenderingSettings.loadVideoTimeout = 15 * 1000;
    adsRenderingSettings.enablePreloading = true;

    // videoContent should be set to the content video element.
    this.adsManager = event.getAdsManager(
        this.APP.yt,
        adsRenderingSettings
    );

    // Add listeners to the required events.
    this.adsManager.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        this.onAdError.bind(this)
    );

    Object.keys(google.ima.AdEvent.Type).forEach(function(evName) {
        if (evName == 'DURATION_CHANGE') {
            return false;
        }

        this.adsManager.addEventListener(
            google.ima.AdEvent.Type[evName],
            this.onAdEvent.bind(this)
        );
    }.bind(this));

    if (this.onLoadCallback) {
        this.onLoadCallback.apply(this);
    }

    this.onScrollDisplay();

    if (!this.APP.isStream) {
        this.adDisplayContainer.initialize();
        this.adsManager.init(this.APP.$container.offsetWidth, this.APP.$container.offsetHeight, google.ima.ViewMode.NORMAL);
    }

    if (this.APP.isStream && isMobile) {
        this.adDisplayContainer.initialize();
        this.adsManager.init(alternativeSize.width, alternativeSize.height, google.ima.ViewMode.NORMAL);
    }
}


Ad.prototype.onscrollIphone = function() {
    if (!isIPhone) {
        return false;
    }

    var self = this,
        showing = false,
        timeChecker;

    this.imaVideo = this.$el.find('video');
    this.imaVideo.attr('playsinline', 'playsinline');
    this.imaVideo.attr('webkit-playsinline', 'webkit-playsinline');

    new Animator(this.imaVideo);

    timeChecker = setInterval(function() {
        if (self.adsManager.getRemainingTime() == 0) {
            self.adsManager.stop();

            clearInterval(timeChecker);
        }
    }, 500);

    this.imaVideo.addEventListener('canplaythrough', function() {
        self.APP.$els.loading.hide();

        if (self.onScreen.mustShow && !showing) {
            showing = true;
            self.APP.$container.style.paddingBottom = '56.25%';

            self.adsManager.start();

            return false;
        }

        showing = false;
    });
};

Ad.prototype.onScrollDisplay = function() {
    if (!this.APP.isStream) {
        return false;
    }

    var self = this,
        started = false;

    this.APP.$container.style.paddingBottom = '0';

    this.$el.addEventListener('mouseover', function(event) {
        this.adsManager.setVolume(1);
    }.bind(this));

    this.$el.addEventListener('mouseout', function(event) {
        this.adsManager.setVolume(0);
    }.bind(this));

    this.APP.$els.adClose.addEventListener('click', function(ev) {
        ev.stopPropagation();

        this.hide();

        self.APP.$container.style.paddingBottom = '0';

        self.adsManager.stop();
    });

    this.APP.$els.adSound.addEventListener('click', function(ev) {
        ev.stopPropagation();

        var wasMuted = self.APP.$els.adSound.hasClass('icon-mute');

        self.APP.$els.adSound.toggleClasses('icon-mute', 'icon-volume1');

        if (!isIPhone) {
            self.adsManager.setVolume(wasMuted);

            return false;
        }

        self.adsManager.setVolume(wasMuted);

        if (wasMuted) {
            self.imaVideo.unmute();
            return false;
        }

        self.imaVideo.mute();
    });

    ['scroll', 'touchstart', 'touchend'].forEach(function(evName) {
        document.addEventListener(evName, function() {
            if (self.$el.hasClass('hidden')) {
                return false;
            }

            self.onScreen = self.APP.$container.onScreen();

            let shouldAct = (evName == 'touchend' || !isIPhone) ? true : false;
            if (!shouldAct) {
                return false;
            }

            if (started) {
                if (self.onScreen.mustPause) {
                    self.adsManager.pause();
                    return false;
                }

                self.adsManager.resume();

                return false;
            }

            if (!started && self.onScreen.mustShow && self.adLoaded && isMobile) {
                // console.log('mobile case');

                started = true;

                // start
                self.adsManager.start();

                return false;
            }

            if (!started && self.onScreen.mustShow && !isMobile) {
                // console.log('desktop case');

                started = true;

                // init
                self.adDisplayContainer.initialize();
                self.adsManager.init(alternativeSize.width, alternativeSize.height, google.ima.ViewMode.NORMAL);

                // start
                self.adsManager.start();

                return false;
            }
        });
    });
};

Ad.prototype.onAdsManagerError = function(ev) {
    console.info('Manager error', this.adId);

    this.onAdError(ev, 'manager');

    if (!this.APP.isStream) {
        this.APP.$container.show();
    }

    if (this.onLoadCallback) {
        this.onLoadCallback.apply(this);
    }
}

Ad.prototype.onAdError = function(ev, source) {
    this.errorSource = source || 'ad';

    this.adError = ev.getError();

    var code = this.adError.getErrorCode();
    var info = this.adError.getInnerError() || this.adError.getMessage();

    console.warn(this.errorSource + ' error: ', code, `[${code}]`, this.tagUrl);
    console.log(info);

    if (this.errorSource == 'ad') {
        this.APP.tracker.event(this.errorSource, 'failed:' + this.adError.getErrorCode());
        this.APP.$container.addClass('aderror');
    }

    if (this.adsManager) {
        this.adsManager.destroy();
    }

    this.$el.hide();
    this.APP.$els.yt.show();

    if (this.APP.hasYT && (this.hadAutoPlay || this.clickedPlay)) {
        this.APP.event.trigger('yt:init', 'aderror');

        return false;
    }

    if (this.APP.isStream) {
        this.APP.$container.style.paddingBottom = '0';
        return false;
    }
};

Ad.prototype.onAdEvent = function(ev) {
    console.info('ad:', ev.type, this.adId);

    this.APP.tracker.event('ad', ev.type);

    var ad = ev.getAd(),
        self = this;

    switch (ev.type) {
        case google.ima.AdEvent.Type.LOADED:
            this.adLoaded = true;

            self.APP.$els.loading.hide();
            if(self.APP.isStream) {
                self.APP.$container.style.paddingBottom = '56.25%';
            }

            this.onscrollIphone();

            // This is the first event sent for an ad - it is possible to determine whether the ad is a video ad or an overlay.
            if (!ad.isLinear()) {
                // @todo: review if
                this.APP.event.trigger('yt:init');
            }

            if (isIPhone) {
                this.$el.find('iframe').style.opacity = 0;
                this.$el.find('iframe').style.visibility = 'hidden';
            }

            break;
        case google.ima.AdEvent.Type.STARTED:
            console.info('playing..', this.tagUrl);

            if (this.APP.isStream) {
                // mute it as soon as it starts (for aol is the only place where it takes effect.)
                this.adsManager.setVolume(0);

                if (isMobile) {
                    this.APP.$els.adSound.show();
                }

                this.APP.$els.adClose.show();
            }

            if (ad.isLinear()) {
                // For a linear ad, a timer can be started to poll for the remaining time.
                this.intervalTimer = setInterval(function() {
                    var remainingTime = this.adsManager.getRemainingTime();
                }.bind(this), 500);
            }

            break;
        case google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED:
            if (this.APP.isStream) {
                this.APP.$container.style.paddingBottom = '0';

                this.APP.$els.loading.hide();

                this.APP.$els.adClose.hide();
                this.APP.$els.adSound.hide();
            }

            break;
        case google.ima.AdEvent.Type.COMPLETE:
            this.APP.$els.adClose.hide();

            if (ad.isLinear()) {
                clearInterval(this.intervalTimer);
            }

            break;
        case google.ima.AdEvent.Type.ALL_ADS_COMPLETED:
            if (!this.clickedPlay) {
                this.hadAutoPlay = true;
                return false;
            }

            this.APP.event.trigger('yt:init', 'show');
            this.APP.event.trigger('yt:init', 'completed');
            break;
    }
};

Ad.prototype.playAd = function() {
    console.log('using ad id', this.adId);

    this.clickedPlay = true;

    if (this.adError) {
        this.APP.event.trigger('yt:init', 'aderror');

        return false;
    }

    if (this.hadAutoPlay) {
        this.APP.event.trigger('yt:init', 'show');
        this.APP.event.trigger('yt:init', 'completed');

        return false;
    }

    // Initialize the container. Must be done via a user action on mobile devices.
    try {
        this.adsManager.start();

        this.APP.$els.overlay.hide();
        this.APP.$els.logo.hide();
    } catch (err) {
        // An error may be thrown if there was a problem with the VAST response.
        this.$el.hide();
        this.APP.$els.yt.show();
    }
}
