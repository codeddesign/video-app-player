export default function(player) {
    player.event.on('video:loaded', function() {
        player.vastTracker.load();
    })

    player.event.on('video:play', function() {
        player.$els.play.hide();
        player.$els.poster.hide();

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

        player.vastTracker.setProgress(player.video.getCurrentTime());

        if (player.video.finished()) {
            player.event.trigger('video:next', 'complete');

            return false;
        }
    })

    player.event.on('video:next', function(evName, status) {
        player.$els.video.hide();
        player.$els.countdown.hide();
        player.$els.target.hide();

        if (status == 'complete') {
            player.vastTracker.complete();
        }

        if (status == 'skip') {
            player.video.pauseVideo();
        }

        player.event.trigger('yt:init', status);
    })
}
