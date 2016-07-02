import '../vendor/VPAIDHTML5Client';

export default function(player) {
    player.event.on('vpaid:initjs', function(evName, source) {
        var el = player.$els.vpaidContainer,
            video = player.$els.video,
            vpaid = new VPAIDHTML5Client(el, video, {});

        vpaid.loadAdUnit(source.src, onLoad);

        function onLoad(err, adUnit) {
            if (err) return;

            player.adUnit = adUnit;

            player.adUnit.subscribe('AdLoaded', onInit);
            player.adUnit.subscribe('AdStarted', onStart);

            player.adUnit.handshakeVersion('2.0', onHandShake);

            function onHandShake(error, result) {
                player.adUnit.initAd(480, 360, 'normal', -1, {}, {});
            }

            function onInit() {
                // adUnit.startAd();
            }

            function onStart() {
                console.log('-> AdStarted');
            }
        }
    })

    player.event.on('vpaid:initflash', function(evName, source) {
        var el = player.$els.vpaidContainer;

        console.log(source)

        el.insertElement(
            'embed', { width: '100%', height: '100%', src: source.src }
        );

        console.log(el.find('embed'));
    })

    player.event.on('vpaid:init', function(evName, source) {
        if (source.type.indexOf('javascript') !== -1) {
            player.event.trigger('vpaid:initjs', source);

            return false;
        }

        if (source.type.indexOf('flash') !== -1) {
            player.event.trigger('vpaid:initflash', source);

            return false;
        }
    })
}
