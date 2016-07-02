export default function(player) {
    player.event.on('video:ready', function() {
        player.vastTracker.load();

        player.$els.overlay.find('.icon-play').show();
    })

    player.event.on('video:play', function() {
        if (player.vast) {
            player.$els.video.show();
            player.$els.target.show();

            return false;
        }

        player.event.trigger('yt:init', 'vastless');
    })

    player.event.on('video:click', function() {
        var clicktrackers = player.vastTracker.clickTrackingURLTemplates;
        if (clicktrackers) {
            player.vastTracker.trackURLs(clicktrackers);
        }
    })

    player.event.on('video:playing', function() {
        if (!player.video.playing) {
            return false;
        }

        player.$els.overlay.hide();
        player.$els.logo.hide();

        player.vastTracker.setProgress(player.video.getCurrentTime());

        if (player.video.finished()) {
            player.event.trigger('video:next', 'complete');

            return false;
        }
    })

    player.event.on('video:next', function(evName, status) {
        // hide VAST elements: video, countdown, ad link
        player.$els.video.hide();
        player.$els.countdown.hide();
        player.$els.target.hide();

        // meanwhile: show overlay
        player.$els.overlay.show();

        // when complete send vast track event
        if (status == 'complete') {
            player.vastTracker.complete();
        }

        // stop video on skip
        if (status == 'skip') {
            player.video.stopVideo();
        }

        // init youtube
        player.event.trigger('yt:init', status);
    })
}
