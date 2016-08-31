<?php

/**
 * Format:
 *  ID => desktop + mobile => TAG.
 *
 * Available on:
 *  http://player_host/test/?c=ID
 */

return [
    /* Non clients: */
    'do_stream' => [
        'desktop' => 'https://cdn.teads.tv/website/vast-all.xml',
        'mobile' => 'https://cdn.teads.tv/website/vast-all.xml',
    ],

    /* Google */
    'google' => [
        'mobile' => 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dskippablelinear&correlator=',
        'desktop' => 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dskippablelinear&correlator=',
    ],

    'google_stream' => [
        'mobile' => 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dskippablelinear&correlator=',
        'desktop' => 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dskippablelinear&correlator=',
    ],

    'google_flash' => [
        'mobile' => 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=sample_ct%3Dlinearvpaid&correlator=',
        'desktop' => 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=sample_ct%3Dlinearvpaid&correlator=',
    ],

    'google_flash_stream' => [
        'mobile' => 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=sample_ct%3Dlinearvpaid&correlator=',
        'desktop' => 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=sample_ct%3Dlinearvpaid&correlator=',
    ],

    /* For clients */

    'aol2_stream' => [
        'desktop' => 'http://ads.adaptv.advertising.com/a/h/XUUFc52Hk6Fg01bMBS16Tqn_qngdDNKLCE+L94vK1JQ=?cb=[CACHE_BREAKER]&pageUrl=http%3A%2F%2Ftest.com&description=VIDEO_DESCRIPTION&duration=VIDEO_DURATION&id=VIDEO_ID&keywords=VIDEO_KEYWORDS&title=VIDEO_TITLE&url=VIDEO_URL&eov=eov',
        'mobile' => 'http://ads.adaptv.advertising.com/a/h/e+ZEahu1C68hLHWBruOaJK3_UIHzeuoxeBfXnDZIwwtjIreM0olKNxJ6uQH9E_n8Zh_XzOZxMa2g63SWosWzAw==?cb=[CACHE_BREAKER]&pageUrl=http%3A%2F%2Ftest.com&eov=eov',
    ],

    'aol3_stream' => [
        'desktop' => 'http://ads.adaptv.advertising.com/a/h/Z1xGhxLa7QerTCsYYjVgQ0NBToAMwZ9jaquS0E_WsHk66LPCeVF_cDzHI4zwhUeK?cb=[CACHE_BREAKER]&pageUrl=http%3A%2F%2Ftest.com&description=VIDEO_DESCRIPTION&duration=VIDEO_DURATION&id=VIDEO_ID&keywords=VIDEO_KEYWORDS&title=VIDEO_TITLE&url=VIDEO_URL&eov=eov',
        'mobile' => 'http://ads.adaptv.advertising.com/a/h/e+ZEahu1C68hLHWBruOaJK3_UIHzeuoxeBfXnDZIwwtjIreM0olKNxJ6uQH9E_n8Zh_XzOZxMa2g63SWosWzAw==?cb=[CACHE_BREAKER]&pageUrl=http%3A%2F%2Ftest.com&eov=eov',
    ],

    'aol3js_stream' => [
        'desktop' => 'http://ads.adaptv.advertising.com/a/h/e+ZEahu1C68hLHWBruOaJK3_UIHzeuox3Q23PcgCqzpUQV5FhImamwEfbN5RuWS4pbRllh23Sjsfu+2JacC8Am1+c_s+VmIC?cb=[CACHE_BREAKER]&pageUrl=http%3A%2F%2Ftest.com&eov=eov',
        'mobile' => 'http://ads.adaptv.advertising.com/a/h/e+ZEahu1C68hLHWBruOaJK3_UIHzeuoxeBfXnDZIwwtjIreM0olKNxJ6uQH9E_n8Zh_XzOZxMa2g63SWosWzAw==?cb=[CACHE_BREAKER]&pageUrl=http%3A%2F%2Ftest.com&eov=eov',
    ],

    'aol_mob_stream' => [
        'mobile' => 'https://pubads.g.doubleclick.net/gampad/ads?sz=[width]x[height]&iu=/179591938/AOL_VAST_Mobile_Test&cust_params=source_for%3Dmob%26source_is%3Daol%26source_type%3Dvast&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&url=[referrer_url]&description_url=[description_url]&correlator=[timestamp]',
        'desktop' => 'https://pubads.g.doubleclick.net/gampad/ads?sz=[width]x[height]&iu=/179591938/AOL_VAST_Mobile_Test&cust_params=source_for%3Dmob%26source_is%3Daol%26source_type%3Dvast&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&url=[referrer_url]&description_url=[description_url]&correlator=[timestamp]',
    ],

    'beachfront_stream' => [
        'mobile' => 'https://ioms.bfmio.com/getBFMT?aid=ef4dc435-43d8-48f5-b123-229bc00c49b6&i_type=out&v=1&mf=f',
        'desktop' => 'https://ioms.bfmio.com/getBFMT?aid=ef4dc435-43d8-48f5-b123-229bc00c49b6&i_type=out&v=1&mf=f',
    ],

    'beachfront2_stream' => [
        'mobile' => 'https://ioms.bfmio.com/getBFMT?aid=ef4dc435-43d8-48f5-b123-229bc00c49b6&i_type=out&v=1',
        'desktop' => 'https://ioms.bfmio.com/getBFMT?aid=ef4dc435-43d8-48f5-b123-229bc00c49b6&i_type=out&v=1',
    ],

    'mogul' => [
        'desktop' => 'http://rtb.tubemogul.com/vast2/H7VDmIyIgfMifFGbQBIu/?duration=30&vpaid=T&url=[description_url]',
        'mobile' => 'http://rtb.tubemogul.com/vast2/cO4yjyZqdsMD5n1WYpcq/?duration=30&rtb_type=instream_mobile_vast_inter&timestamp='.time().'&url=[description_url]',
    ],

    'mogul_stream' => [
        'desktop' => 'http://rtb.tubemogul.com/vast2/POmTwIl3kr4g1oW1RGjU/?duration=30&vpaid=T&url=[description_url]',
        'mobile' => 'http://rtb.tubemogul.com/vast2/RfEBMuyt4XX7mpqiCygE/?duration=30&rtb_type=instream_mobile_vast_inter&timestamp='.time().'&url=[description_url]',
    ],

];
