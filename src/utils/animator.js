import {
    isIPhone
} from './mobile';

function AnimatorAudio(video) {
    var audio = new Audio,
        canplay = false,
        _play,
        _pause;

    audio.src = video.src;
    audio.preload = 'metadata';
    audio.isPlaying = false;
    audio.isMuted = true;

    audio.addEventListener('canplaythrough', function() {
        if (!canplay) {
            canplay = true;

            if (isIPhone) audio.play();
        }
    })

    _play = audio.play;
    audio.play = function() {
        if (!canplay) {
            audio.load();

            return false;
        }

        if (!canplay || audio.isPlaying) {
            return false;
        }

        audio.isPlaying = true;

        audio.currentTime = video.currentTime;

        _play.apply(this, arguments);
    }

    _pause = audio.pause;
    audio.pause = function() {
        if (!audio.isPlaying) {
            return false;
        }

        audio.isPlaying = false;

        video.currentTime = audio.currentTime;

        _pause.apply(this, arguments);
    }

    return audio;
}

export default function Animator(video) {
    var self = this,
        fps = 15,
        next,
        hasFuture,
        audio = false,
        _load,
        canplay = false;

    function draw() {
        if (video.isPaused) {
            return false;
        }

        if (!video.hasFinished && !audio.isPlaying) {
            // console.log('from video');

            requestAnimationFrame(draw);
        }

        if (video.currentTime >= video.duration) {
            video.hasFinished = true;

            return false;
        }

        next = video.currentTime + fps / 1000;
        hasFuture = video.readyState >= video.HAVE_FUTURE_DATA;

        if (video.currentTime <= next && hasFuture) {
            video.currentTime = next;
        }
    }

    video.hasFinished = false;
    video.isPaused = true;

    _load = video.load;
    video.load = function() {
        if (!canplay) {
            _load.apply(this, arguments)
        }
    }

    video.addEventListener('canplaythrough', function() {
        if (!audio) {
            audio = new AnimatorAudio(video);
        }

        canplay = true;
    })

    video.addEventListener('timeupdate', function() {
        if (audio.isPlaying && !video.isPaused && !video.hasFinished) {
            // console.log('from audio')

            requestAnimationFrame(draw);
            video.currentTime = audio.currentTime;
        }
    })

    video.play = function(forced) {
        if (!canplay) {
            video.load();
            return false;
        }

        if (!video.isPaused && !forced) return false;

        video.isPaused = false;

        draw();
        if (!audio.isPlaying && !audio.isMuted) {
            audio.play();
        }
    }

    video.pause = function() {
        if (video.isPaused) return false;

        video.isPaused = true;

        if (audio.isPlaying && !audio.isMuted) {
            audio.pause();
        }
    }

    video.stop = function() {
        video.hasFinished = true;
        video.currentTime = video.duration;
    }

    video.unmute = function() {
        if (video.hasFinished || !audio.isMuted) return false;

        audio.isMuted = false;

        if (!video.isPaused) {
            audio.play();
        }
    }

    video.mute = function() {
        if (video.hasFinished || audio.isMuted) return false;

        audio.isMuted = true;

        audio.pause();

        if (!video.isPaused) {
            video.play(true);
        }
    }
}
