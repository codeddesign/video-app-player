export default function(player) {
    player.event.on('template:hovering', function(evName, specific) {
        player.$els.hovering.forEach(function(el) {
            if (el.hasClass('hidden') || specific == 'show') {
                el.removeClass('hidden');
                return false;
            }

            el.addClass('hidden');
        });
    });
}
