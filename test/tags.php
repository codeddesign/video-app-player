<?php

/**
 * Format:
 *  ID => desktop + mobile => TAG.
 *
 * Available on:
 *  http://player_host/test/?c=ID
 */

return [
    'demo' => [
        'desktop' => 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dlinear&correlator=',

        'mobile' => 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dlinear&correlator=123456',
    ],

    'do_stream' => [
        'desktop' => 'https://cdn.teads.tv/website/vast-all.xml',
        'mobile' => 'https://cdn.teads.tv/website/vast-all.xml',
    ],

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
];
