/**
 * r.path has available 'main' and 'full'
 *    main      : http://localhost
 *    full      : http://localhost/some-path/?a=123#somehashtag
 *
 * r.link is available as a virtual link. It has available as data:
 *    protocol  : http:
 *    hostname  : example.com
 *    port      : 8080
 *    pathname  : /path-name/
 *    search    : ?abc=123
 *    hash      : #hash
 *    host      : example.com:8080
 */
export default (function() {
    var link = document.createElement('a'),
        shortPath,
        longPath;

    link.href = location.href;

    shortPath = `${link.protocol}//${link.host}`;

    return {
        link: link,
        path: {
            main: shortPath,
            full: `${shortPath}${link.pathname}${link.search}${link.hash}`
        }
    };
})()
