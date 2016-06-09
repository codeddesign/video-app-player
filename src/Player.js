import $ from './Element'
import Event from './Event';
import Video from './PlayerVideo'
import playerCreate from './playerCreate'
import addPlayerHandlers from './playerHandlers'
import addPlayerEvents from './playerEvents'
import vastInit from './vastInit';

export default function(settings) {
    var self = this;

    this.settings = settings;

    this.videoId = playerCreate(this);

    this.$container = $(document).find('#' + this.videoId);

    this.$video = new Video(this);

    this.yt = null;

    this.$els = {
        play: this.$container.find('.player__play'),
        hideme: this.$container.findAll('.hideme'),
        controls: this.$container.find('.player__controls'),
        share: this.$container.find('.player__share'),
        timeCurrent: this.$container.find('.player__controls .time .current'),
        timeTotal: this.$container.find('.player__controls .time .total'),
        progress: this.$container.find('progress'),
        playBtn: this.$container.find('.player__controls .icon-play'),
        volumeBtn: this.$container.find('.player__controls .icon-volume2'),
        fullBtn: this.$container.find('.player__controls .icon-fullscreen'),
        fbBtn: this.$container.find('.player__share .icon-facebook-sq'),
        twBtn: this.$container.find('.player__share .icon-twitter-sq'),
        codeBtn: this.$container.find('.player__share .icon-share1'),
        code: this.$container.find('.player__code'),
        codeClose: this.$container.find('.player__code .close'),
        textarea: this.$container.find('.player__code textarea')
    };

    this.event = new Event;

    this.vast = {};

    addPlayerHandlers(this);

    addPlayerEvents(this);

    vastInit(this);

    /** Checks interval */
    setInterval(function() {
        self.event.trigger('video:playing');

        self.event.trigger('yt:progressing');
    }, 1000);
}
