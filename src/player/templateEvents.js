export default function(player) {
    player.event.on('template:hovering', function(evName, mode) {
        player.$els.hovering.forEach(function(el) {
            el[mode]();
        });
    });
}
