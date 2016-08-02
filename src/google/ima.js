import config from '../../config';
import { isMobile, isIGadget } from '../utils/mobile';
import r from '../utils/referer';
import isTest from '../utils/isTest';

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

    // init
    this.setUpIMA();

    this.APP.$els.overlay.addEventListener('click', this.playAd.bind(this));
}

Ad.prototype.getAdTagUrl = function() {
    var mapped = {
            '[description_url]': encodeURIComponent(r.path.full),
            '[width]': this.APP.$container.offsetWidth,
            '[height]': this.APP.$container.offsetHeight
        },
        tags = this.APP.data.tags,
        usingTest = isTest && TESTING.tag,
        url = isMobile ? tags.general.mobile : tags.general.desktop;

    if (this.APP.isStream) {
        url = isMobile ? tags.stream.mobile : tags.stream.desktop;

        console.info('Using stream tag:', url);
    }

    if (usingTest) {
        url = TESTING.tag;

        console.info('Using test tag:', url);
    }

    Object.keys(mapped).forEach(function(key) {
        url = url.replace(key, mapped[key]);
    });

    return url;
}

Ad.prototype.setUpIMA = function() {
    google.ima.settings.setVpaidMode(google.ima.ImaSdkSettings.VpaidMode.ENABLED);

    // Create the ad display container.
    this.adDisplayContainer = new google.ima.AdDisplayContainer(
        this.APP.$els.ad,
        null
    );

    // Create ads loader.
    this.adsLoader = new google.ima.AdsLoader(this.adDisplayContainer);

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
    this.adsRequest.adTagUrl = this.getAdTagUrl();

    this.adsRequest.linearAdSlotWidth = this.APP.$container.offsetWidth;
    this.adsRequest.linearAdSlotHeight = this.APP.$container.offsetHeight;
    this.adsRequest.nonLinearAdSlotWidth = this.APP.$container.offsetWidth;
    this.adsRequest.nonLinearAdSlotHeight = this.APP.$container.offsetHeight;

    // Request ads.
    this.adsLoader.requestAds(this.adsRequest);
}

Ad.prototype.onAdsManagerLoaded = function(event) {
    console.info('Manager loaded');

    this.APP.$container.show();

    // Get the ads manager.
    var adsRenderingSettings = new google.ima.AdsRenderingSettings();

    adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;

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

    this.onScrollDisplay();
}

Ad.prototype.onScrollDisplay = function() {
    if (!this.APP.isStream) {
        return false;
    }

    var self = this,
        backupPadding = window.getComputedStyle(this.APP.$container).getPropertyValue('padding-bottom');

    this.APP.$container.style.paddingBottom = 0;

    var onScreenInterval = setInterval(function() {
        if (self.APP.$container.isOnScreen()) {
            clearInterval(onScreenInterval);

            setTimeout(function() {
                // use original padding
                self.APP.$container.style.paddingBottom = '56.25%';

                // start ad
                self.adsManager.init(640, 360, google.ima.ViewMode.NORMAL);
                self.adsManager.start();

                console.log(self.adsManager);
            }, 500);
        }
    }, 500);
}

Ad.prototype.onAdsManagerError = function(ev) {
    console.info('Manager error');

    this.onAdError(ev, 'manager');

    if (!this.APP.isStream) {
        this.APP.$container.show();
    }
}

Ad.prototype.onAdError = function(ev, source) {
    this.errorSource = source || 'ad';

    this.adError = ev.getError();

    console.warn(this.errorSource, '[error:', this.adError.getErrorCode(), '-' + this.adError.getMessage() + ']');

    this.APP.tracker.event(this.errorSource, 'failed:' + this.adError.getErrorCode());

    if (this.adsManager) {
        this.adsManager.destroy();
    }

    this.APP.$els.ad.hide();
    this.APP.$els.yt.show();

    this.APP.$container.addClass('aderror');
};

Ad.prototype.onAdEvent = function(ev) {
    console.info('ad:', ev.type);

    this.APP.tracker.event('ad', ev.type);

    var ad = ev.getAd();

    switch (ev.type) {
        case google.ima.AdEvent.Type.LOADED:
            // This is the first event sent for an ad - it is possible to determine whether the ad is a video ad or an overlay.
            if (!ad.isLinear()) {
                this.APP.event.trigger('yt:init');
            }

            break;
        case google.ima.AdEvent.Type.STARTED:
            if (ad.isLinear()) {
                // For a linear ad, a timer can be started to poll for the remaining time.
                this.intervalTimer = setInterval(function() {
                    var remainingTime = this.adsManager.getRemainingTime();
                }.bind(this), 300);
            }

            break;
        case google.ima.AdEvent.Type.COMPLETE:
            if(this.APP.isStream) {
                this.APP.$container.style.paddingBottom = '0';
            }

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
        case google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED:
            break;
        case google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED:
            break;
    }
};

Ad.prototype.playAd = function() {
    this.clickedPlay = true;

    this.APP.$els.overlay.find('.icon-play').hide();

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
    this.adDisplayContainer.initialize();

    try {
        this.adsManager.init(this.APP.$container.offsetWidth, this.APP.$container.offsetHeight, google.ima.ViewMode.NORMAL);

        this.adsManager.start();

        this.APP.$els.overlay.hide();
        this.APP.$els.logo.hide();
    } catch (err) {
        // An error may be thrown if there was a problem with the VAST response.
        this.APP.$els.ad.hide();
        this.APP.$els.yt.show();
    }
}
