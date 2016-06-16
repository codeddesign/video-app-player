import Video from './video';

export default function(player) {
    player.event.on('vast:loaded', function() {
        var $countdown = player.$els.countdown;

        player.vastTracker._events['skip-countdown'] = function(secondsLeft) {
            secondsLeft = Math.round(secondsLeft);

            if ($countdown) {
                $countdown.show();

                if (secondsLeft > 0) {
                    $countdown.html('Skip in ' + secondsLeft + '..');

                    return false;
                }

                $countdown.addClass('done');
                $countdown.html('Skip');

                $countdown.onclick = function() {
                    $countdown = false;

                    player.event.trigger('video:next', 'skip')
                }
            }
        }

        player.event.trigger('vast:init-video');
    });

    player.event.on('vast:init-video', function() {
        player.$els.play.show();

        if (!player.vast) {
            return false;
        }

        var source = 0; // todo

        /**
         * Add ad's link
         */
        player.$els.target.attr(
            'href',
            player.vastTracker.clickThroughURLTemplate
        );

        /**
         * Add video's source
         */
        player.$els.video.src = player.vast.sources[source].src;
    })
}
