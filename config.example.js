import r from './src/utils/referer';

export default {
    fbId: 000000000000000,
    path: {
        player: 'http://videoplayer.dev',
        app: 'http://videoapp.dev',
        vast: `http://h280t-vv035.ads.tremorhub.com/ad/tag?adCode=h280t-v7cm7&playerWidth=600&playerHeight=300&mediaId=a3m&mediaUrl=${r.path.main}&srcPageUrl=${r.path.full}`
    }
}
