export default function() {
    let xhr,
        versions = ["MSXML2.XmlHttp.5.0",
            "MSXML2.XmlHttp.4.0",
            "MSXML2.XmlHttp.3.0",
            "MSXML2.XmlHttp.2.0",
            "Microsoft.XmlHttp"
        ],
        i = 0;

    if (typeof XMLHttpRequest !== 'undefined') {
        xhr = new XMLHttpRequest();
    } else {
        for (i, len = versions.length; i < len; i++) {
            try {
                xhr = new ActiveXObject(versions[i]);
                break;
            } catch (e) {}
        }
    }

    return {
        get: function(url, callback) {
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    callback(xhr);
                }
            };

            xhr.open('GET', url, true);
            xhr.send('');
        }
    }
}
