export default function(player) {
    var video = player.$els.video;

     /**
     * Initiate variables,
     * Add load video onload event
     * Add video helper methods
     */

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
        if (isNaN(this.duration)) {
            return 0;
        }

        return this.duration;
    }

    video.getCurrentTime = function() {
        return this.currentTime;
    }

    video.finished = function() {
        if (this.getDuration() <= 0 || this.getCurrentTime() < this.getDuration()) {
            this.playing = true;

            return false;
        }

        this.playing = false;

        return true;
    }

    video.seekTo = function(seconds) {
        this.currentTime = seconds

        return seconds;
    }

    return video;
}
