import config from '../../config';

export default (function() {
    return window.location.href.indexOf(config.path.player) == 0;
})();
