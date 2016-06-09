import { toMinutesStr, onHoverHideEls } from './utils';

export default function(player) {
    var event = player.event,
        $els = player.$els,
        video = player.$video,
        yt;

    event.on('vast:ready', function() {
        // console.dir(player);

        player.vastTracker._events['skip-countdown'] = function(secondsLeft) {
            var $counter = player.$container.find('.vastCountdown');

            secondsLeft = Math.round(secondsLeft);

            if ($counter) {
                if (secondsLeft > 0) {
                    $counter.show();

                    $counter.html('Skip in ' + secondsLeft + '..');

                    return false;
                }

                $counter.addClass('done');
                $counter.html('Skip');

                $counter.onclick = function() {
                    event.trigger('video:next', 'skipped')
                }
            }
        }
    })

    event.on('video:next', function(ev, mode) {
        var $link = player.$container.find('.vastTarget'),
            $counter = player.$container.find('.vastCountdown');

        if ($link) {
            $link.remove();
        }

        if ($counter) {
            $counter.remove();
        }

        event.trigger('yt:init');
    })

    event.on('video:init', function() {
        var noSources = !player.vast.sources || player.vast.sources.length == 0;
        if (noSources) {
            player.$els.play.hide();

            event.trigger('video:next', 'sourceless');

            return false;
        }

        var source = 0; // player.vast.sources.length;

        video.src = player.vast.sources[source].src;

        video.insertAfter('a', {
            href: player.vastTracker.clickThroughURLTemplate,
            className: "vastTarget",
            target: "_blank"
        });

        video.insertAfter('span', {
            className: 'vastCountdown'
        }, true);

        player.$container.find('.vastTarget').onclick = function() {
            var clicktrackers = player.vastTracker.clickTrackingURLTemplates;
            if (clicktrackers) {
                player.vastTracker.trackURLs(clicktrackers);
            }
        }
    })

    event.on('video:play', function() {
        $els.hideme.forEach(function(el) {
            el.hide();
        });

        video.playVideo();
    })

    event.on('video:loaded', function() {
        event.trigger('video:play');

        player.vastTracker.load();
    })

    event.on('video:playing', function() {
        if (!video.playing) {
            return false;
        }

        player.vastTracker.setProgress(video.getCurrentTime());

        if (video.finished()) {
            player.vastTracker.complete();

            event.trigger('video:next', 'complete');

            return false;
        }
    })

    event.on('yt:init', function() {
        player.yt = new YT.Player(video, {
            videoId: player.videoId,
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
                    var ifr = player.$container.find('.player__video'),
                        seconds = player.yt.getDuration() - 1;

                    player.$els.progress.attr('max', seconds);

                    player.$els.timeTotal.html(toMinutesStr(seconds));

                    player.$els.timeCurrent.html(toMinutesStr(0));

                    player.yt.ended = function() {
                        return player.yt.status == 0;
                    }

                    player.yt.isPlaying = function() {
                        return player.yt.status == 1;
                    }

                    player.yt.isPaused = function() {
                        return player.yt.status == 2;
                    }

                    player.yt.muted = false;
                    player.yt.isFullscreen = false;

                    player.yt.playVideo();
                },
                onStateChange: function(e) {
                    var mapped = {
                        0: 'ended',
                        1: 'playing',
                        2: 'paused'
                    }

                    player.yt.status = e.data;

                    if (mapped[e.data]) {
                        event.trigger('yt:' + mapped[e.data]);
                    }
                }
            }
        });
    });

    event.on('yt:playing', function() {
        if (player.yt.isPlaying()) {
            player.$els.hideme.forEach(function(el) {
                el.hide();
            });

            player.$els.playBtn.addClass('icon-pause');
            player.$els.playBtn.removeClass('icon-play');

            player.$els.code.hide();
        }
    })

    event.on('yt:paused', function() {
        if (player.yt.isPaused()) {
            player.$els.playBtn.addClass('icon-play');
            player.$els.playBtn.removeClass('icon-pause');
        }
    })

    event.on('yt:ended', function() {
        if (player.yt.ended()) {
            player.$els.playBtn.addClass('icon-play');
            player.$els.playBtn.removeClass('icon-pause');
        }
    })

    event.on('yt:mute', function() {
        if (!player.yt.muted) {
            player.$els.volumeBtn.addClass('icon-mute');
            player.$els.volumeBtn.removeClass('icon-volume2');

            player.yt.muted = !player.yt.muted;

            player.yt.mute();

            return false;
        }

        player.$els.volumeBtn.addClass('icon-volume2');
        player.$els.volumeBtn.removeClass('icon-mute');

        player.yt.muted = !player.yt.muted;

        player.yt.unMute();
    })

    event.on('yt:full', function() {
        var ifr = player.$container.find('iframe'),
            doc = document,
            full;

        if (!player.yt.isFullscreen) {
            player.yt.isFullscreen = true;
            full = ifr.requestFullScreen || ifr.mozRequestFullScreen || ifr.webkitRequestFullScreen;
            full.bind(ifr)();

            doc.onkeyup = function(e) {
                if (player.yt.isFullscreen && e.code.toLowerCase() == 'escape') {
                    player.yt.isFullscreen = false;
                }
            }

            return false;
        }

        player.yt.isFullscreen = false;
        full = doc.exitFullscreen || doc.msExitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen;
        full.bind(doc)();
    })

    event.on('yt:progressing', function() {
        var ytInitiated = player.yt && 'function' == typeof player.yt.isPlaying,
            seconds;

        if (ytInitiated && player.yt.isPlaying()) {
            seconds = player.yt.getCurrentTime();

            player.$els.progress.attr('value', seconds);
            player.$els.timeCurrent.html(toMinutesStr(seconds));
        }
    })

    event.on('yt:jump', function(ev, seconds) {
        player.yt.seekTo(seconds);

        player.$els.progress.attr('value', seconds);
        player.$els.timeCurrent.html(toMinutesStr(seconds));
    })
}
