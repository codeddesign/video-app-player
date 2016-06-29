import $ from '../utils/element';
import config from '../../config';

export default function(player) {
    var script = $(document).find(`script[src^="${config.path.player}"]`),
        data = script.attr('src').split('/p')[1].split('.'),
        campaignId = data[0],
        videoId = data[1];

    var html = `<div class="player__container" id="yt_${videoId}">
            <div class="player__poster video_play" style="background-image: url(http://img.youtube.com/vi/${videoId}/hqdefault.jpg);"></div>
            <span class="player__play hidden"><span class="icon-play"></span></span>

            <div class="player__video hidden"></div>
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

            <video class="player__video hidden"></video>
            <a class="vastTarget hidden" target="_blank"></a>
            <span class="vastCountdown hidden"></span>
        </div>`;

    player.campaignId = campaignId;
    player.videoId = videoId;

    script.replaceElement(html);

    player.$container = $(document).find('#yt_' + videoId);

    player.$els = {
        poster: player.$container.find('.player__poster'),
        play: player.$container.find('.player__play'),
        video: player.$container.find('video.player__video'),
        share: player.$container.find('.player__share'),
        yt: player.$container.find('div.player__video'),
        controls: player.$container.find('.player__controls'),
        target: player.$container.find('.vastTarget'),
        countdown: player.$container.find('.vastCountdown'),
        progress: player.$container.find('progress'),
        timeCurrent: player.$container.find('.player__controls .time .current'),
        timeTotal: player.$container.find('.player__controls .time .total'),
        progress: player.$container.find('progress'),
        playBtn: player.$container.find('.player__controls .icon-play'),
        volumeBtn: player.$container.find('.player__controls .icon-volume2-hold'),
        fullBtn: player.$container.find('.player__controls .icon-fullscreen-hold'),
        fbBtn: player.$container.find('.player__share .icon-vidfacebook'),
        twBtn: player.$container.find('.player__share .icon-vidtwitter'),
        codeBtn: player.$container.find('.player__share .icon-vidshareurl'),
        code: player.$container.find('.player__code'),
        codeClose: player.$container.find('.player__code .close'),
        textarea: player.$container.find('.player__code textarea'),
        hovering: player.$container.findAll('.hovering'),
        logo: player.$container.find('.player__logo')
    }
}
