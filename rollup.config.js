import {terser} from 'rollup-plugin-terser';

export default {
  input: 'src/index.js',
  output: [{
      file: 'bundle/prelinks.js',
      format: 'iife'
    }, {
      file: 'demo/bundle/prelinks.js',
      format: 'iife'
    }, {
      file: 'bundle/prelinks.min.js',
      format: 'iife',
      plugins: [terser()]
    }
  ]
};
