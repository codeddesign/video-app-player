import buble from 'rollup-plugin-buble';
import uglify from 'rollup-plugin-uglify';

export default {
    entry: 'src/app.js',
    dest: 'the-player.js',
    format: 'iife',
    plugins: [buble(), uglify()],
}
