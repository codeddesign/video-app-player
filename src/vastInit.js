var createSourceObjects = function(media_files) {
    var sourcesByFormat = [],
        media_file,
        source,
        a, b;

    for (a = 0, b = media_files.length; a < b; a++) {
        media_file = media_files[a];
        source = { type: media_file.mimeType, src: media_file.fileURL };

        sourcesByFormat.push({
            type: media_file.mimeType,
            src: media_file.fileURL,
            width: media_file.width,
            height: media_file.height
        });
    }

    return sourcesByFormat;
}

export default function(player) {
    if(!player.settings.url) {
        return false;
    }

    DMVAST.client.get(player.settings.url, function(response) {
        if (response) {
            // we got a response, deal with it
            for (var adIdx = 0; adIdx < response.ads.length; adIdx++) {
                var ad = response.ads[adIdx];

                player.vast.companion = undefined;
                for (var creaIdx = 0; creaIdx < ad.creatives.length; creaIdx++) {
                    var creative = ad.creatives[creaIdx],
                        foundCreative = false,
                        foundCompanion = false;

                    if (creative.type === "linear" && !foundCreative) {
                        if (creative.mediaFiles.length) {
                            player.vast.sources = createSourceObjects(creative.mediaFiles);

                            if (!player.vast.sources.length) {
                                player.event.trigger('ad:canceled');
                                return;
                            }

                            player.vastTracker = new DMVAST.tracker(ad, creative);

                            foundCreative = true;
                        }

                    } else if (creative.type === "companion" && !foundCompanion) {
                        player.vast.companion = creative;

                        foundCompanion = true;
                    }
                }

                if (player.vastTracker) {
                    // vast tracker and content is ready to go, trigger event
                    player.event.trigger('vast:ready');

                    break;
                } else {
                    // Inform ad server we can't find suitable media file for this ad
                    vast.util.track(ad.errorURLTemplates, { ERRORCODE: 403 });
                }
            }
        }

        if (!player.vastTracker) {
            // No pre-roll, start video
            player.event.trigger('ad:canceled');
        }
    });
}
