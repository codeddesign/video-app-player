import $ from './utils/element';
import config from '../config';
import { isMobile, isIGadget } from './utils/mobile';
import progressCursor from './utils/progressCursor';

export default function(app, script) {
    app.videoId = app.data.campaign.id;

    app.hasYT = false;

    if (app.data.campaign.videos.length) {
        app.hasYT = true;
        app.videoId = app.data.campaign.videos[0].url;
    }

    var random = Math.random().toString().replace('.', '');
    var uniqueId = `a${app.videoId}_${random}`;

    var html = `<div style="max-width:640px;position:relative;margin: 0px auto;"><div class="player__container" id="${uniqueId}">
            <div class="player__overlay" ${app.hasYT ? `style="background-image: url(http://img.youtube.com/vi/${app.videoId}/hqdefault.jpg);"` : ''}>
                <span class="icon-play"></span>
            </div>
            <div class="player__video yt hidden"></div>

            <div class="player__controls hidden hovering">
                <progress class="player__progress" min="0" max="0" value="0"></progress>
                <div class="left">
                    <span class="icon-play"></span>
                    <span class="time">
                        <span class="current">00:00</span> / <span class="total">00:00</span>
                    </span>
                </div>
                <div class="right">
                    <span class="icon-volume2-hold"></span>
                    <span class="icon-fullscreen-hold"></span>
                </div>
            </div>
            <a href="http://a3m.io" target="_blank" class="logo__link"><div class="player__logo"></div></a>
            <div class="player__share hidden hovering">
                <span class="icon-vidshareurl"></span>\
                <span class="icon-vidfacebook"></span>\
                <span class="icon-vidtwitter"></span>\
            </div>
            <div class="player__code hidden">
                <span class="close">&#x2715;</span>
                <span>Add this code to your website</span>
                <textarea rows="2">${script.outerHTML.trim()}</textarea>
            </div>

            <div class="player__video ad"></div>
        </div></div>`;

    script.replaceElement(html);

    app.$container = $(document).find(`#${uniqueId}`);

    app.$els = {
        overlay: app.$container.find('.player__overlay'),
        share: app.$container.find('.player__share'),
        yt: app.$container.find('div.player__video.yt'),
        ad: app.$container.find('div.player__video.ad'),
        controls: app.$container.find('.player__controls'),
        timeCurrent: app.$container.find('.player__controls .time .current'),
        timeTotal: app.$container.find('.player__controls .time .total'),
        progress: app.$container.find('.player__progress'),
        playBtn: app.$container.find('.player__controls .icon-play'),
        volumeBtn: app.$container.find('.player__controls .icon-volume2-hold'),
        fullBtn: app.$container.find('.player__controls .icon-fullscreen-hold'),
        fbBtn: app.$container.find('.player__share .icon-vidfacebook'),
        twBtn: app.$container.find('.player__share .icon-vidtwitter'),
        codeBtn: app.$container.find('.player__share .icon-vidshareurl'),
        code: app.$container.find('.player__code'),
        codeClose: app.$container.find('.player__code .close'),
        textarea: app.$container.find('.player__code textarea'),
        hovering: app.$container.findAll('.hovering'),
        logo: app.$container.find('.player__logo')
    }

    if (isMobile) {
        app.$container.addClass('mobile');

        if (isIGadget) {
            app.$container.addClass('iDevice');
        }
    }

    if (!app.hasYT) {
        app.$els.overlay.hide();
        app.$els.logo.hide();

        if (isMobile) {
            app.$container.hide();
        }
    }

    app.event.on('template:hovering', function(evName, specific) {
        app.$els.hovering.forEach(function(el) {
            if (el.hasClass('hidden') || specific == 'show') {
                el.removeClass('hidden');
                return false;
            }

            el.addClass('hidden');
        });
    });


    app.$els.playBtn.onclick = function() {
        if (app.yt.isPlaying()) {
            app.yt.pauseVideo();
        }

        if (app.yt.ended() || app.yt.isPaused()) {
            app.yt.playVideo();
        }
    }

    app.$els.volumeBtn.onclick = function() {
        app.event.trigger('yt:mute');
    }

    app.$els.fullBtn.onclick = function() {
        app.event.trigger('yt:full');
    }

    app.$els.progress.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();

        app.event.trigger('yt:jump', progressCursor.call(this, e));
    }

    app.$container.onmouseover = function() {
        if (!app.ytReady || !app.yt.isPlaying()) {
            return false;
        }

        app.event.trigger('template:hovering', 'show');
    }

    app.$container.onmouseout = function() {
        if (!app.ytReady || !app.yt.isPlaying()) {
            return false;
        }

        app.event.trigger('template:hovering', 'hide');
    }

    app.$els.fbBtn.onclick = function() {
        app.yt.pauseVideo();

        FB.ui({
            method: 'share',
            mobile_iframe: true,
            href: 'http://ad3media.com',
        }, function(response) {});
    }

    app.$els.twBtn.onclick = function(e) {
        app.yt.pauseVideo();

        window.open(
            'https://twitter.com/share?url=' + escape(parent.top.location.href) + '&text=Watch this!',
            '',
            'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600'
        );
    }

    app.$els.codeBtn.onclick = function() {
        app.$els.code.show();
        app.yt.pauseVideo();
    }

    app.$els.textarea.onclick = function() {
        this.select();
    }

    app.$els.codeClose.onclick = function() {
        app.$els.code.hide();

        app.yt.playVideo();
    }
}
