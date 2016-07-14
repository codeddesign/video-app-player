import config from '../../config';
import { isMobile, isIGadget } from '../utils/mobile';
import r from '../utils/referer';

export default function(app) {
    var clickedPlay = false;
    var hadAutoPlay = false;
    var adError = false;
    var adsLoader;
    var adsRequest;
    var adsManager;
    var adDisplayContainer;
    var intervalTimer;
    var playButton = app.$els.overlay;

    function getAdTagUrl() {
        var mapped = {
            __pathmain: encodeURIComponent(r.path.main),
            __pathfull: encodeURIComponent(r.path.full)
        };

        var url = isMobile ? config.path.vast.mobile : config.path.vast.desktop;

        Object.keys(mapped).forEach(function(key) {
            url = url.replace(key, mapped[key]);
        });

        return url;
    }

    function setUpIMA() {
        google.ima.settings.setVpaidMode(google.ima.ImaSdkSettings.VpaidMode.ENABLED);

        // Create the ad display container.
        adDisplayContainer = new google.ima.AdDisplayContainer(
            app.$els.ad,
            null
        );

        // Create ads loader.
        adsLoader = new google.ima.AdsLoader(adDisplayContainer);

        // Listen and respond to ads loaded and error events.
        adsLoader.addEventListener(
            google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
            onAdsManagerLoaded,
            false
        );

        adsLoader.addEventListener(
            google.ima.AdErrorEvent.Type.AD_ERROR,
            onAdError,
            false
        );

        // Request video ads.
        adsRequest = new google.ima.AdsRequest();
        adsRequest.adTagUrl = getAdTagUrl();

        // Set ad sizes the same as container's in px
        adsRequest.linearAdSlotWidth = app.$container.offsetWidth;
        adsRequest.linearAdSlotHeight = app.$container.offsetHeight;
        adsRequest.nonLinearAdSlotWidth = app.$container.offsetWidth;
        adsRequest.nonLinearAdSlotHeight = app.$container.offsetHeight;

        adsLoader.requestAds(adsRequest);
    }

    function playAds() {
        clickedPlay = true;

        app.$els.overlay.find('.icon-play').hide();

        if (adError) {
            app.event.trigger('yt:init', 'aderror');

            return false;
        }

        if (hadAutoPlay) {
            app.event.trigger('yt:init', 'show');
            app.event.trigger('yt:init', 'completed');

            return false;
        }

        // Initialize the container. Must be done via a user action on mobile devices.
        adDisplayContainer.initialize();

        try {
            adsManager.init(app.$container.offsetWidth, app.$container.offsetHeight, google.ima.ViewMode.NORMAL);

            adsManager.start();

            app.$els.overlay.hide();
            app.$els.logo.hide();
        } catch (err) {
            // An error may be thrown if there was a problem with the VAST response.
            app.$els.ad.hide();
            app.$els.yt.show();
        }
    }

    function onAdsManagerLoaded(adsManagerLoadedEvent) {
        // Get the ads manager.
        var adsRenderingSettings = new google.ima.AdsRenderingSettings();

        adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;

        // videoContent should be set to the content video element.
        adsManager = adsManagerLoadedEvent.getAdsManager(
            app.yt,
            adsRenderingSettings
        );

        // Add listeners to the required events.
        adsManager.addEventListener(
            google.ima.AdErrorEvent.Type.AD_ERROR,
            onAdError
        );

        adsManager.addEventListener(
            google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
            onAdEvent
        );

        adsManager.addEventListener(
            google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
            onAdEvent
        );

        adsManager.addEventListener(
            google.ima.AdEvent.Type.SKIPPED,
            onAdEvent
        );

        adsManager.addEventListener(
            google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
            onAdEvent
        );

        adsManager.addEventListener(
            google.ima.AdEvent.Type.LOADED,
            onAdEvent
        );

        adsManager.addEventListener(
            google.ima.AdEvent.Type.STARTED,
            onAdEvent
        );

        adsManager.addEventListener(
            google.ima.AdEvent.Type.COMPLETE,
            onAdEvent
        );

        // in view port
        if (!app.hasYT && !isMobile) {
            var backupPadding = window.getComputedStyle(app.$container).getPropertyValue('padding-bottom');
            app.$container.style.paddingBottom = '0';

            var onScreenInterval = setInterval(function() {
                if (app.$container.isOnScreen()) {
                    clearInterval(onScreenInterval);

                    setTimeout(function() {
                        // use original padding
                        app.$container.style.paddingBottom = backupPadding;

                        // start ad
                        adsManager.init(app.$container.offsetWidth, app.$container.offsetHeight, google.ima.ViewMode.NORMAL);
                        adsManager.start();
                    }, 500);
                }
            }, 500);
        }
    }

    function onAdEvent(ev) {
        console.info('ad:' + ev.type);

        var ad = ev.getAd();

        switch (ev.type) {
            case google.ima.AdEvent.Type.LOADED:
                // This is the first event sent for an ad - it is possible to determine whether the ad is a video ad or an overlay.
                if (!ad.isLinear()) {
                    app.event.trigger('yt:init');
                }
                break;
            case google.ima.AdEvent.Type.STARTED:
                if (ad.isLinear()) {
                    // For a linear ad, a timer can be started to poll for the remaining time.
                    intervalTimer = setInterval(
                        function() {
                            var remainingTime = adsManager.getRemainingTime();
                        },
                        300);
                }
                break;
            case google.ima.AdEvent.Type.COMPLETE:
                if (ad.isLinear()) {
                    clearInterval(intervalTimer);
                }
                break;
            case google.ima.AdEvent.Type.ALL_ADS_COMPLETED:
                if (!app.hasYT) {
                    app.$container.hide();
                    return false;
                }

                if (!clickedPlay) {
                    hadAutoPlay = true;
                    return false;
                }

                app.event.trigger('yt:init', 'show');
                app.event.trigger('yt:init', 'completed');
                break;
            case google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED:
                break;
            case google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED:
                break;
        }
    }

    function onAdError(ev) {
        adError = ev.getError();

        console.info(adError.getMessage());

        if (adsManager) {
            adsManager.destroy();
        }

        app.$els.ad.hide();
        app.$els.yt.show();

        app.$container.addClass('aderror');
        if (!app.hasYT) {
            app.$container.hide();
        }
    }

    // init
    playButton.addEventListener('click', playAds);
    setUpIMA();
}
