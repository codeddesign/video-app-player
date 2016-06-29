import toMinutesStr from '../utils/toMinutesStr';
import isMobile from '../utils/isMobile';

export default function(player) {
    /**
     * If on mobile: initiate youtube video
     */
    window.onYouTubeIframeAPIReady = function() {
        if (isMobile()) {
            player.event.trigger('yt:init');
        }
    }

    player.yt = false;

    player.ytReady = false;

    var youtubeShow = function() {
        player.$els.yt.show();

        player.event.trigger('template:hovering', 'show');
    }

    player.event.on('yt:init', function(evName, status) {
        /**
         * If youtube player is ready play the video from callback
         */
        if (player.ytReady) {
            if (status != 'complete') {
                player.yt.playVideo();

                return false;
            }

            youtubeShow();

            return false;
        }

        player.yt = new YT.Player(player.$els.yt, {
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
                    player.event.trigger('yt:ready');
                },
                onStateChange: function(e) {
                    var mapped = {
                        0: 'ended',
                        1: 'playing',
                        2: 'paused'
                    }

                    player.yt.status = e.data;

                    if (mapped[e.data]) {
                        player.event.trigger('yt:' + mapped[e.data]);
                    }
                }
            }
        });
    });

    player.event.on('yt:ready', function() {
        var seconds = player.yt.getDuration() - 1;

        player.$els.yt = player.$container.find('iframe');

        player.$els.progress.attr('max', seconds);

        player.$els.timeTotal.html(toMinutesStr(seconds));

        player.$els.timeCurrent.html(toMinutesStr(0));

        player.yt.status = false;

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
        player.ytReady = true;

        if (!isMobile()) {
            player.yt.playVideo();
        }
    })

    player.event.on('yt:playing', function(evName) {
        if (!player.ytReady) {
            return false;
        }

        player.$els.logo.show();

        if (player.yt.isPlaying()) {
            youtubeShow();

            player.$els.playBtn.addClass('icon-pause');
            player.$els.playBtn.removeClass('icon-play');

            player.tracker.event({
                event: evName
            });
        }
    })

    player.event.on('yt:progressing', function() {
        var seconds,
            mustUpdate = player.ytReady && typeof player.yt.isPlaying == 'function' && player.yt.isPlaying();

        if (mustUpdate) {
            seconds = player.yt.getCurrentTime();

            player.$els.progress.attr('value', seconds);
            player.$els.timeCurrent.html(toMinutesStr(seconds));
        }
    })

    player.event.on('yt:paused', function() {
        if (player.yt.isPaused()) {
            player.$els.playBtn.addClass('icon-play');
            player.$els.playBtn.removeClass('icon-pause');
        }
    })

    player.event.on('yt:ended', function() {
        if (player.yt.ended()) {
            player.$els.playBtn.addClass('icon-play');
            player.$els.playBtn.removeClass('icon-pause');
        }
    })

    player.event.on('yt:mute', function() {
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

    player.event.on('yt:full', function() {
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

    player.event.on('yt:jump', function(ev, seconds) {
        player.yt.seekTo(seconds);

        player.$els.progress.attr('value', seconds);
        player.$els.timeCurrent.html(toMinutesStr(seconds));
    })
}
