import Event from '../utils/event';
import Tracker from '../utils/tracker';
import assets from './assets';
import template from './template';
import templateListeners from './templateListeners';
import vastEvents from './vastEvents';
import vast from './vast';
import Video from './video';
import videoEvents from './videoEvents';
import youtubeEvents from './youtubeEvents';

export default function() {
    var self = this;

    this.event = new Event(this);
    this.tracker = new Tracker(this);

    assets();

    template(this);
    templateListeners(this);

    vastEvents(this);
    vast(this);

    videoEvents(this);
    this.video = new Video(this);

    youtubeEvents(this);

    setInterval(function() {
        if (self.vast) {
            self.event.trigger('video:playing');
        }

        self.event.trigger('yt:progressing');
    }, 1000);
}
