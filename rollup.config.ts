import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

const config = {
  input: 'src/index.ts',
  output: [
    { file: 'dist/index.mjs', format: 'es', esModule: true, sourcemap: false } // For ES Module
  ],
  plugins: [
    typescript({ tsconfig: './tsconfig.json' }),
    nodeResolve(),
    commonjs(),
    terser()
  ]
};

export default config;
