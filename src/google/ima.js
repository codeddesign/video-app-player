import config from '../../config';
import { isMobile, isIGadget, isIPhone } from '../utils/mobile';
import r from '../utils/referer';
import isTest from '../utils/isTest';
import random from '../utils/random';

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

    this.onLoadCallback = false;

    this.adId = 'a' + random();

    this.APP.$container.insertElement('div', { className: ['player__video ad hidden', this.adId].join(' ') });

    this.$el = this.APP.$container.find('.' + this.adId);

    this.imaVideo = false;
}

Ad.prototype.setUpIMA = function(tagUrl, onLoadCallback) {
    this.tagUrl = tagUrl;

    this.onLoadCallback = onLoadCallback || function() {};

    google.ima.settings.setVpaidMode(google.ima.ImaSdkSettings.VpaidMode.ENABLED);

    // Create the ad display container.
    this.adDisplayContainer = new google.ima.AdDisplayContainer(
        this.$el,
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

    // videoContent should be set to the content video element.
    this.adsManager = event.getAdsManager(
        this.APP.yt,
        adsRenderingSettings
    );

    // console.dir(event);

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
}

let VideoAnimator = function(cb) {
    let rafId;
    let previousLoopTime;

    function loop(now) {
        // must be requested before cb() because that might call .stop()
        rafId = requestAnimationFrame(loop);
        cb(now - (previousLoopTime || now)); // ms since last call. 0 on start()
        previousLoopTime = now;
    }

    this.start = () => {
        if (!rafId) { // prevent double starts
            loop(0);
        }
    };

    this.stop = () => {
        cancelAnimationFrame(rafId);
        rafId = null;
        previousLoopTime = 0;
    };
}


Ad.prototype.onScrollDisplay = function() {
    if (!this.APP.isStream) {
        return false;
    }

    var self = this,
        initialized = false,
        transitioned = false,
        started = false,
        audio = false;

    this.$el.addEventListener('mouseover', function(event) {
        this.adsManager.resume();
        this.adsManager.setVolume(1);
    }.bind(this));

    this.$el.addEventListener('mouseout', function(event) {
        this.adsManager.setVolume(0);
    }.bind(this));

    this.APP.$container.style.paddingBottom = 0;

    ['scroll', 'touchstart', 'touchend'].forEach(function(evName) {
        document.addEventListener(evName, function() {
            if (self.$el.hasClass('hidden')) {
                return false;
            }

            var onscreen = self.APP.$container.onScreen();

            if (!initialized) {
                initialized = true;

                self.adDisplayContainer.initialize();
                self.adsManager.init(alternativeSize.width, alternativeSize.height, google.ima.ViewMode.NORMAL);

                self.adsManager.setVolume(0);

                self.APP.$els.adClose.addEventListener('click', function(ev) {
                    ev.stopPropagation();

                    self.adsManager.stop();

                    audio ? audio.pause() : false;
                });

                self.APP.$els.adSound.addEventListener('click', function(ev) {
                    ev.stopPropagation();

                    var wasMuted = self.APP.$els.adSound.hasClass('icon-mute');

                    self.APP.$els.adSound.toggleClasses('icon-mute', 'icon-volume1');

                    if (!isIPhone) {
                        self.adsManager.setVolume(wasMuted);

                        return false;
                    }

                    if (!audio.canplaythrough) {
                        audio.load();

                        return false;
                    }

                    audio.volume = wasMuted ? 1 : 0;
                });

                if (isMobile) {
                    self.adsManager.setVolume(0);

                    self.imaVideo = self.$el.find('video');

                    self.imaVideo.attr('playsinline', 'playsinline');
                    self.imaVideo.attr('webkit-playsinline', 'webkit-playsinline');

                    if (isIPhone) {
                        self.imaVideo.hide();

                        var updater = new VideoAnimator(function(timeDiff) {
                            if (self.imaVideo.readyState >= self.imaVideo.HAVE_FUTURE_DATA) {
                                self.imaVideo.currentTime = self.imaVideo.currentTime + (timeDiff * self.imaVideo.playbackRate) / 1000;
                            }
                        });

                        self.imaVideo.play = function() {
                            if (!audio) {
                                audio = new Audio;
                                audio.src = self.imaVideo.src;
                                audio.preload = 'metadata';
                                audio.canplaythrough = false;

                                audio.addEventListener('canplaythrough', function(ev) {
                                    ev.stopPropagation();

                                    audio.canplaythrough = true;

                                    this.currentTime = self.imaVideo.currentTime;

                                    this.play();
                                })
                            }

                            self.imaVideo.addEventListener('canplaythrough', function(ev) {
                                self.imaVideo.show();

                                updater.start();
                            });
                        }
                    }
                }
            }

            if (started) {
                (onscreen.mustPause) ? self.adsManager.pause(): self.adsManager.resume()

                return false;
            }

            if (onscreen.itIs) {
                if (!transitioned) {
                    transitioned = true;

                    self.APP.$container.style.paddingBottom = '56.25%';
                }

                if (!started && transitioned && (evName == 'touchend' || !isMobile)) {
                    started = true;

                    self.adsManager.start();
                }
            }
        });
    });
}

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

    console.warn(this.errorSource, '[', code, '-', info, ']', this.adId);

    this.APP.tracker.event(this.errorSource, 'failed:' + this.adError.getErrorCode());

    if (this.adsManager) {
        this.adsManager.destroy();
    }

    this.$el.hide();
    this.APP.$els.yt.show();

    this.APP.$container.addClass('aderror');

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

    var ad = ev.getAd();

    switch (ev.type) {
        case google.ima.AdEvent.Type.LOADED:
            // This is the first event sent for an ad - it is possible to determine whether the ad is a video ad or an overlay.
            if (!ad.isLinear() && 1==2) {
                this.APP.event.trigger('yt:init');
            }

            if (isIPhone) {
                this.$el.find('iframe').style.opacity = 0;
                this.$el.find('iframe').style.visibility = 'hidden';
            }

            break;
        case google.ima.AdEvent.Type.STARTED:
            if (this.APP.isStream) {
                if (isMobile) {
                    this.APP.$els.adSound.show();
                }

                this.APP.$els.adClose.show();
            }

            if (ad.isLinear()) {
                // For a linear ad, a timer can be started to poll for the remaining time.
                this.intervalTimer = setInterval(function() {
                    var remainingTime = this.adsManager.getRemainingTime();
                }.bind(this), 300);
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
    this.adDisplayContainer.initialize();

    try {
        this.adsManager.init(this.APP.$container.offsetWidth, this.APP.$container.offsetHeight, google.ima.ViewMode.NORMAL);

        this.adsManager.start();

        this.APP.$els.overlay.hide();
        this.APP.$els.logo.hide();
    } catch (err) {
        // An error may be thrown if there was a problem with the VAST response.
        this.$el.hide();
        this.APP.$els.yt.show();
    }
}
