import './vendor/vast-client';
import Player from './Player';
import config from './_config';

new Player({
    //url: config.path + '/test/vast3.xml'
    url: 'http://fp31r.ads.tremorhub.com/ad/tag?adCode=kqsg4&playerWidth=600&playerHeight=300&mediaId=a3m&mediaUrl=http%3A%2F%2Fa3m.io&srcPageUrl=http%3A%2F%2Fa3m.io'
});

window.fbAsyncInit = function() {
    FB.init({
        appId: config.fbId,
        xfbml: true,
        version: 'v2.6'
    });
};

(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }

    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
