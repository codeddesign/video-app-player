import progressCursor from '../utils/progressCursor';

export default function(player) {
    player.$els.target.onclick = function() {
        player.event.trigger('video:click');
    }

    player.$els.overlay.onclick = function() {
        // Don't play if not ready
        if (player.$els.overlay.find('.icon-play').hasClass('hidden')) {
            console.log('not ready?!');
            return false;
        }

        player.$els.overlay.find('.icon-play').hide();

        player.event.trigger('video:play');

        if (player.adUnit) {
            player.adUnit.startAd();

            return false;
        }

        player.video.playVideo();
    }

    player.$els.playBtn.onclick = function() {
        if (player.yt.isPlaying()) {
            player.yt.pauseVideo();
        }

        if (player.yt.ended() || player.yt.isPaused()) {
            player.yt.playVideo();
        }
    }

    player.$els.volumeBtn.onclick = function() {
        player.event.trigger('yt:mute');
    }

    player.$els.fullBtn.onclick = function() {
        player.event.trigger('yt:full');
    }

    player.$els.progress.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();

        player.event.trigger('yt:jump', progressCursor.call(this, e));
    }

    player.$container.onmouseover = function() {
        if (!player.ytReady || !player.yt.isPlaying()) {
            return false;
        }

        player.event.trigger('template:hovering', 'show');
    }

    player.$container.onmouseout = function() {
        if (!player.ytReady || !player.yt.isPlaying()) {
            return false;
        }

        player.event.trigger('template:hovering', 'hide');
    }

    player.$els.fbBtn.onclick = function() {
        player.yt.pauseVideo();

        FB.ui({
            method: 'share',
            mobile_iframe: true,
            href: 'http://google.com',
        }, function(response) {});
    }

    player.$els.twBtn.onclick = function(e) {
        player.yt.pauseVideo();

        window.open(
            'https://twitter.com/share?url=' + escape(parent.top.location.href) + '&text=hello',
            '',
            'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600'
        );
    }

    player.$els.codeBtn.onclick = function() {
        player.$els.code.show();
        player.yt.pauseVideo();
    }

    player.$els.textarea.onclick = function() {
        this.select();
    }

    player.$els.codeClose.onclick = function() {
        player.$els.code.hide();

        player.yt.playVideo();
    }
}
