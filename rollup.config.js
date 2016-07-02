import buble from 'rollup-plugin-buble';
import uglify from 'rollup-plugin-uglify';

export default {
    entry: 'src/_main.js',
    dest: 'the-player.js',
    format: 'iife',
    plugins: [buble(), uglify()],
    // plugins: [buble()] // #dev
}
