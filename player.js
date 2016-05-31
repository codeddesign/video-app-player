(function() {
    var htmlOverlay = '\
<div class="overlay">\
    <div class="controls">\
        <progress class="mouseover off first" min="0" max="10" value="0"></progress>\
        <div class="center-play">\
            <span class="icon-play"></span>\
        </div>\
        <div class="bottom mouseover off first">\
            <div class="left">\
                <span class="papl-btn icon-play"></span>\
                <span class="time">\
            <span class="current"></span> / <span class="total"></span>\
                </span>\
            </div>\
            <div class="right">\
                <span class="muun-btn icon-volume2"></span>\
                <span class="icon-fullscreen"></span>\
            </div>\
        </div>\
        <div class="social mouseover off first">\
            <span class="icon-share1"></span>\
            <span class="icon-facebook-sq"></span>\
            <span class="icon-twitter-sq"></span>\
        </div>\
    </div>\
</div>',
        htmlEmbedOverlay = '\
<div class="embed-overlay">\
    <span>Embed this video in your site using code bellow:</span>\
    <textarea rows="3" cols="50"><iframe width="560" height="315" src="{{link}}" frameborder="0" allowfullscreen></iframe></textarea>\
</div>';

    var $ = function(source) {
        var element = function(source) {
            this.source = source || document;

            this.source.find = function(selector) {
                var found = this.querySelector(selector);
                if (!found) {
                    console.warn('failed to find: ' + selector);
                    return false;
                }

                return new element(found);
            }

            this.source.findAll = function(selector) {
                var els = this.querySelectorAll(selector),
                    i,
                    list = [];

                for (i = 0; i < els.length; i++) {
                    list.push(new element(els[i]));
                }

                return list;
            }

            this.source.data = function() {
                return this.dataset;
            }

            this.source.html = function(html) {
                if (html) {
                    this.innerHTML = html.trim();
                    return this;
                }

                return this.innerHTML;
            }

            this.source.appendHtml = function(html, data) {
                var virtual = document.createElement('div');

                if (data) {
                    Object.keys(data).forEach(function(key) {
                        key = key.replace('-')
                        html = html.replace('{{' + key + '}}', data[key]);
                    });
                }

                virtual.innerHTML = html.trim();

                this.appendChild(virtual.firstChild);

                return this;
            }

            this.source.appendElement = function(tag, properties, chain) {
                chain = chain || false;

                var node = document.createElement(tag);

                Object.keys(properties).forEach(function(key) {
                    node[key] = properties[key];
                });

                this.appendChild(node);

                if (chain) {
                    return new element(node);
                }

                return this;
            }

            this.source.css = function(property, value) {
                this.style[property] = value;
                return this;
            }

            this.source.hide = function() {
                this.css('display', 'none');
                return this;
            }

            this.source.show = function() {
                this.css('display', 'block');
                return this;
            }

            this.source.removeClass = function(class_) {
                this.classList.remove(class_);
                return this;
            }

            this.source.addClass = function(class_) {
                this.classList.add(class_);
                return this;
            }

            this.source.hasClass = function(class_) {
                return this.classList.contains(class_);
            }

            this.source.toggleClasses = function(add, remove) {
                var classlist = this.classList,
                    temp;

                if (classlist.contains(add)) {
                    temp = add;
                    add = remove;
                    remove = temp;
                }

                this.addClass(add);
                this.removeClass(remove);

                return this;
            }

            this.source.attr = function(name, value) {
                if (name && !value) {
                    return this.getAttribute(name);
                }

                if (name && value) {
                    this.setAttribute(name, value);
                }
            }

            return this.source;
        }

        return new element(source);
    };

    var Event = (function() {
        var event = function() {
            this.list = {};
        };

        event.prototype.subscribe = function(name, callback) {
            this.list[name] = callback;

            return this;
        };

        event.prototype.publish = function(name) {
            this.list[':' + name].apply(this, arguments);

            return this
        };


        return new event;
    });

    var toMinutesStr = function(seconds) {
        var minutes = Math.floor(seconds / 60),
            seconds = Math.floor(seconds % 60);

        minutes = (minutes <= 9) ? ('0' + minutes) : minutes;
        seconds = (seconds <= 9) ? ('0' + seconds) : seconds;

        return [minutes, seconds].join(':');
    };

    var progressCursor = function(e) {
        return e.layerX * this.max / this.offsetWidth;
    };

    var Controller = function($video, evHandler) {
        var controller,
            data = $video.data();

        if (data.videoYt) {
            controller = new YT.Player($video, {
                videoId: data.videoYt,
                playerVars: {
                    enablejsapi: 1,
                    disablekb: 1,
                    controls: 0,
                    showinfo: 0,
                    modestbranding: 1,
                    rel: 0,
                    autoplay: 0,
                    iv_load_policy: 3,
                    allowfullscreen: true
                },
                events: {
                    onReady: function(e) {
                        evHandler.publish('ready');
                    }
                }
            });
        }

        if (data.video) {
            $video.attr('src', data.video);

            $video.onloadeddata = function() {
                evHandler.publish('ready');
            }

            $video.playVideo = function() {
                this.play();
            }

            $video.pauseVideo = function() {
                this.pause();
            }

            $video.stopVideo = function() {
                this.currentTime = 0;

                this.pauseVideo();
            }

            $video.mute = function() {
                this.muted = true;
            }

            $video.unMute = function() {
                this.muted = false;
            }

            $video.getDuration = function() {
                return this.duration + 1; // !required
            }

            $video.getCurrentTime = function() {
                return this.currentTime;
            }

            $video.seekTo = function(seconds) {
                this.currentTime = seconds

                return seconds;
            }
        }

        return controller || $video;
    }

    var Video = function(player, $video) {
        var self = this,
            isSecondary = player.$el.hasClass('secondary');

        this.event = new Event;

        this.controller = new Controller($video, this.event);

        this.status = {
            played: false,
            started: false,
            stoped: true,
            playing: false,
            muted: false,
            full: false,
            time: {
                current: 0,
                total: 0,
            }
        };

        this.$els = {
            play: player.$el.find('.center-play'),
            overlay: player.$el.find('.overlay'),
            time: player.$el.find('.time'),
            timeCurrent: player.$el.find('.time .current'),
            timeTotal: player.$el.find('.time .total'),
            progress: player.$el.find('progress'),
            iframe: player.$el.find('iframe'),
            controls: {
                play: player.$el.find('.papl-btn'),
                mute: player.$el.find('.muun-btn'),
                full: player.$el.find('.icon-fullscreen'),
            },
            embedOverlay: player.$el.find('.embed-overlay'),
            embedTextarea: player.$el.find('.embed-overlay textarea'),
            share: {
                embed: player.$el.find('.icon-share1'),
                fb: player.$el.find('.icon-facebook-sq'),
                tw: player.$el.find('.icon-twitter-sq'),
            }
        };

        if (isSecondary) {
            this.$els.progress.hide();
            this.$els.time.hide();
        }

        this.fullTimeout = false;

        self.event.subscribe(':ready', function(e) {
            var seconds = self.controller.getDuration() - 1; // !required

            self.status.time.total = seconds;

            self.$els.progress.attr('max', seconds);

            self.$els.timeTotal.html(toMinutesStr(seconds));
            self.$els.timeCurrent.html(toMinutesStr(0));
        });

        self.event.subscribe(':started', function(e) {
            if (!self.status.started) {
                self.status.started = true;

                player.$el.findAll('.mouseover').forEach(function(el) {
                    el.removeClass('first')
                });
            }
        });

        self.event.subscribe(':toggle-play', function(e) {
            self.$els.controls.play.toggleClasses('icon-pause', 'icon-play');
        });

        self.event.subscribe(':play', function(e) {
            self.event.publish('started');
            self.event.publish('toggle-play');

            self.status.playing = true;

            self.$els.play.hide();

            self.controller.playVideo();
        });

        self.event.subscribe(':playing', function() {
            if (!self.status.playing || !self.controller || 'undefined' == typeof self.controller.getCurrentTime) {
                if (self.status.stoped) {
                    self.$els.play.show();
                }

                return false;
            }

            var seconds = self.controller.getCurrentTime();

            self.$els.progress.attr('value', seconds);
            self.$els.timeCurrent.html(toMinutesStr(seconds));

            self.status.time.current = seconds;
            self.status.stoped = false;

            self.event.publish('stoped');

            self.event.publish('secondary-play', seconds);
        });

        self.event.subscribe(':secondary-play', function(e, seconds) {
            var currentSeconds = Math.floor(seconds),
                afterSeconds = parseInt($video.data().after),
                timeToPlay = currentSeconds == afterSeconds,
                secondaryNotPlayed = players.secondary.video.status.played == false,
                wasJumped = currentSeconds > afterSeconds && secondaryNotPlayed;

            if (!isSecondary && secondaryNotPlayed && (timeToPlay || wasJumped)) {
                self.event.publish('pause');

                player.$el.hide();

                if (players.secondary) {
                    players.secondary.$el.show();
                    players.secondary.video.event.publish('play');
                }
            }
        });

        self.event.subscribe(':secondary-stopped', function() {
            if (isSecondary) {
                player.$el.hide();
                players.primary.$el.show();
                players.primary.video.event.publish('play');
            }
        });

        self.event.subscribe(':stoped', function(e) {
            if (self.status.time.current < self.status.time.total) {
                return false;
            }

            self.status.playing = false;
            self.status.stoped = true;
            self.status.played = true;

            self.controller.stopVideo();

            self.event.publish('toggle-play');
            self.event.publish('secondary-stopped');
        });

        self.event.subscribe(':pause', function(e) {
            self.event.publish('toggle-play');

            self.status.playing = false;
            self.controller.pauseVideo();
        });

        self.event.subscribe(':mute', function(e, video) {
            self.$els.controls.mute.toggleClasses('icon-volume2', 'icon-mute');

            if (!self.status.muted) {
                self.controller.mute();
            } else {
                self.controller.unMute();
            }

            self.status.muted = !self.status.muted;
        });

        self.event.subscribe(':full', function(e) {
            var ifr = self.$els.iframe || $video,
                full;

            full = ifr.requestFullScreen || ifr.mozRequestFullScreen || ifr.webkitRequestFullScreen;
            if (full) {
                self.status.full = true;
                full.bind(ifr)();
            }
        });

        self.event.subscribe(':jump', function(e, seconds) {
            self.$els.progress.attr('value', seconds);
            self.$els.timeCurrent.html(toMinutesStr(seconds));

            self.controller.seekTo(seconds)

            if (self.status.stoped) {
                self.event.publish('toggle-play');
                self.$els.play.hide();

                self.status.playing = true;
                self.status.stoped = false;

                self.controller.play ? self.controller.play() : self.controller.playVideo();
            }
        });

        self.event.subscribe(':toggle-overlay', function(e, action) {
            if (!self.status.started) {
                return false;
            }

            player.$el.findAll('.mouseover').forEach(function(el) {
                action == 'over' ? el.removeClass('off') : el.addClass('off');
            });
        });

        self.event.subscribe(':full-move', function(e) {
            if (!self.status.full) {
                return false;
            }

            if (self.fullTimeout) {
                clearTimeout(self.fullTimeout);
            }

            self.$els.overlay.removeClass('fullscreen');
            self.event.publish('toggle-overlay', 'over');

            if (self.status.playing || self.status.stoped) {
                fullTimeout = setTimeout(function() {
                    self.$els.overlay.addClass('fullscreen');

                    self.event.publish('toggle-overlay', 'out');
                }, 2000);
            }
        });

        self.$els.share.embed.onclick = function(e) {
            e.stopPropagation();

            self.event.publish('pause');

            self.$els.overlay.hide();
            self.$els.embedOverlay.show()
        }

        self.$els.embedOverlay.onclick = function(e) {
            self.event.publish('play');

            self.$els.overlay.show();
            self.$els.embedOverlay.hide()
        }

        self.$els.embedTextarea.onclick = function(e) {
            e.stopPropagation();

            this.select();
        }

        self.$els.share.fb.onclick = function(e) {
            e.stopPropagation();
            self.event.publish('pause');

            FB.ui({
                method: 'share',
                mobile_iframe: true,
                href: 'http://google.com',
            }, function(response) {});
        }

        self.$els.share.tw.onclick = function(e) {
            e.stopPropagation();
            self.event.publish('pause');

            window.open(
                "https://twitter.com/share?url=" + escape(parent.top.location.href) + "&text=hello",
                '',
                'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600'
            );
        }

        self.$els.play.onclick = function(e) {
            e.stopPropagation();
            self.event.publish('play');
        };

        self.$els.progress.onclick = function(e) {
            e.stopPropagation();
            self.event.publish('jump', progressCursor.call(this, e));
        };

        self.$els.controls.play.onclick = function(e) {
            e.stopPropagation();

            if (!self.status.playing) {
                self.event.publish('play');

                return false;
            }

            self.event.publish('pause');
        };

        self.$els.controls.mute.onclick = function(e) {
            e.stopPropagation();
            self.event.publish('mute');
        };

        self.$els.controls.full.onclick = function(e) {
            e.stopPropagation();
            self.event.publish('full');
        };

        self.$els.overlay.onmouseover = function() {
            self.event.publish('toggle-overlay', 'over');
        };

        self.$els.overlay.onmouseout = function() {
            self.event.publish('toggle-overlay', 'out');
        };

        self.$els.overlay.onmousemove = function() {
            self.event.publish('full-move');
        };

        self.$els.overlay.onclick = function() {
            self.$els.controls.play.click();
        };

        setInterval(function() {
            self.event.publish('playing');
        }, 1000);
    };

    var Player = function(container, primary) {
        this.$el = container;

        container.appendHtml(htmlOverlay);
        container.appendHtml(htmlEmbedOverlay, { link: parent.location.href });

        this.video = new Video(this, container.find('.video'));
        if (container.hasClass('secondary')) {
            container.hide();
        }

        return this;
    };

    var players = {
        primary: null,
        secondary: null,
        init: function() {
            this.primary = new Player($(document).find('.player.primary'));

            this.secondary = new Player($(document).find('.player.secondary'));
        }
    };

    window.onYouTubePlayerAPIReady = function() {
        players.init();
    }
})();
