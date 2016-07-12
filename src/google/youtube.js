import toMinutesStr from '../utils/toMinutesStr';
import { isMobile, isIGadget } from '../utils/mobile';

export default function(app) {
    app.event.on('yt:init', function(evName, status) {
        if (app.ytReady) {
            if (status == 'show') {
                app.$els.ad.hide();
                app.$els.yt.show();
            }

            if (status == 'completed') {
                if (!isMobile) {
                    app.yt.playVideo();
                }
            }

            if (status == 'aderror') {
                if (isMobile && !isIGadget) {
                    app.yt.playVideo();
                }
            }

            return false;
        }

        app.yt = app.yt || new YT.Player(app.$els.yt, {
            videoId: app.videoId,
            playerVars: {
                enablejsapi: 1,
                disablekb: 1,
                controls: 0,
                showinfo: 0,
                modestbranding: 1,
                rel: 0,
                autoplay: 0,
                iv_load_policy: 3,
                fs: 0 // no full screen
            },
            events: {
                onReady: function(e) {
                    app.ytReady = true;

                    app.yt.status = false;
                    app.yt.muted = false;
                    app.yt.isFullscreen = false;

                    app.yt.ended = function() {
                        return app.yt.status == 0;
                    }

                    app.yt.isPlaying = function() {
                        return app.yt.status == 1;
                    }

                    app.yt.isPaused = function() {
                        return app.yt.status == 2;
                    }

                    app.event.trigger('yt:ready');
                },
                onStateChange: function(e) {
                    var mapped = {
                        0: 'ended',
                        1: 'playing',
                        2: 'paused',
                        3: 'loading'
                    }

                    app.yt.status = e.data;

                    if (mapped[e.data]) {
                        app.event.trigger('yt:' + mapped[e.data]);
                    }
                }
            }
        });
    });

    app.event.on('yt:ready', function() {
        var seconds = app.yt.getDuration() - 1;

        app.$els.yt = app.$container.find('iframe');

        app.$els.progress.attr('max', seconds);

        app.$els.timeTotal.html(toMinutesStr(seconds));

        app.$els.timeCurrent.html(toMinutesStr(0));

        if (isMobile) {
            if (isIGadget) {
                app.$els.yt.show();
            }
        } else {
            app.yt.playVideo();
        }
    })

    app.event.on('yt:playing', function(evName) {
        if (!app.ytReady) {
            return false;
        }

        if (app.yt.isPlaying()) {
            // show: logo, youtube and it's hovering elements
            app.$els.logo.show();
            app.$els.yt.show();
            app.event.trigger('template:hovering');

            // hide: play overlay
            app.$els.overlay.hide();
            app.$els.ad.hide();

            // add proper icon class for play control
            app.$els.playBtn.addClass('icon-pause');
            app.$els.playBtn.removeClass('icon-play');

            // make request to app with event this name
            app.tracker.event({
                event: evName
            });
        }
    })

    app.event.on('yt:progressing', function() {
        var seconds,
            mustUpdate = app.ytReady && typeof app.yt.isPlaying == 'function' && app.yt.isPlaying();

        if (mustUpdate) {
            seconds = app.yt.getCurrentTime();

            app.$els.progress.attr('value', seconds);
            app.$els.timeCurrent.html(toMinutesStr(seconds));
        }
    })

    app.event.on('yt:paused', function() {
        if (app.yt.isPaused()) {
            app.$els.playBtn.addClass('icon-play');
            app.$els.playBtn.removeClass('icon-pause');

            app.event.trigger('template:hovering', 'show');
        }
    })

    app.event.on('yt:loading', function() {
        app.$els.yt.show();
        app.$els.logo.show();

        app.$els.overlay.find('.icon-play').hide();
    })

    app.event.on('yt:ended', function() {
        if (app.yt.ended()) {
            app.$els.playBtn.addClass('icon-play');
            app.$els.playBtn.removeClass('icon-pause');
        }
    })

    app.event.on('yt:mute', function() {
        if (!app.yt.muted) {
            app.$els.volumeBtn.addClass('icon-mute');
            app.$els.volumeBtn.removeClass('icon-volume2');

            app.yt.muted = !app.yt.muted;

            app.yt.mute();

            return false;
        }

        app.$els.volumeBtn.addClass('icon-volume2');
        app.$els.volumeBtn.removeClass('icon-mute');

        app.yt.muted = !app.yt.muted;

        app.yt.unMute();
    })

    app.event.on('yt:full', function() {
        var ifr = app.$container.find('iframe'),
            doc = document,
            full;

        if (!app.yt.isFullscreen) {
            app.yt.isFullscreen = true;
            full = ifr.requestFullScreen || ifr.mozRequestFullScreen || ifr.webkitRequestFullScreen;
            full.bind(ifr)();

            doc.onkeyup = function(e) {
                if (app.yt.isFullscreen && e.code.toLowerCase() == 'escape') {
                    app.yt.isFullscreen = false;
                }
            }

            return false;
        }

        app.yt.isFullscreen = false;
        full = doc.exitFullscreen || doc.msExitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen;
        full.bind(doc)();
    })

    app.event.on('yt:jump', function(ev, seconds) {
        app.yt.seekTo(seconds);

        app.$els.progress.attr('value', seconds);
        app.$els.timeCurrent.html(toMinutesStr(seconds));
    })

    if (isMobile) {
        app.event.trigger('yt:init', 'onload');
    }
}
