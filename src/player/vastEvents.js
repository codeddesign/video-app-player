import Video from './video';
import { isMobile } from '../utils/mobileCheck';

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

    player.event.on('vast:canceled', function() {
        player.vast = false;

        player.$els.video.hide();

        if (!isMobile) {
            player.event.trigger('vast:init-video');
        }
    });

    player.event.on('vast:init-video', function() {
        if (!player.vast) {
            player.$els.overlay.find('.icon-play').show();
            return false;
        }

        // todo:
        var source = player.vast.sources[0];
        if (source.type.indexOf('javascript') !== -1 || source.type.indexOf('flash') !== -1) {
            player.vast = false;

            console.log(`\tunhandled case "${source.type}": skipping..`);
            player.event.trigger('vast:canceled');
            return false;
        }

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
        player.$els.video.src = source.src;
    })
}
