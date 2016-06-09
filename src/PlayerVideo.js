export default function(player) {
    var video = player.$container.find('video');

    video.playing = false;

    video.onloadeddata = function() {
        player.event.trigger('video:loaded');
    };

    video.playVideo = function() {
        this.play();

        this.playing = true;
    }

    video.pauseVideo = function() {
        this.pause();
    }

    video.stopVideo = function() {
        this.currentTime = 0;

        this.pauseVideo();
    }

    video.mute = function() {
        this.muted = true;
    }

    video.unMute = function() {
        this.muted = false;
    }

    video.getDuration = function() {
        return this.duration;
    }

    video.getCurrentTime = function() {
        return this.currentTime;
    }

    video.finished = function() {
        var finished = this.getCurrentTime() >= this.getDuration();

        if (finished) {
            this.playing = false;
        }

        return finished;
    }

    video.seekTo = function(seconds) {
        this.currentTime = seconds

        return seconds;
    }

    return video;
}
