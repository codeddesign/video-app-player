import { progressCursor, onHoverShowEls, onHoverHideEls } from './utils';

export default function(player) {
    player.$els.play.onclick = function() {
        player.event.trigger('video:init');
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
        if (!player.yt) {
            return false;
        }

        onHoverShowEls(player);
    }

    player.$container.onmouseout = function() {
        if (!player.yt) {
            return false;
        }

        onHoverHideEls(player);
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