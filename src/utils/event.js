export default function(app) {
    var event = function() {
        this.list = {};
    };

    event.prototype.on = function(name, callback) {
        this.list[name] = callback;

        return this;
    };

    event.prototype.trigger = function(name, status) {
        if (typeof this.list[name] == 'undefined') {
            throw new Error(name + ': event does not exists');
        }

        if (name.indexOf('ing') == -1) {
            console.info(name + ((status) ? '|' + status : ''));
        }

        this.list[name].apply(this, arguments);

        return this
    };

    return new event;
};
