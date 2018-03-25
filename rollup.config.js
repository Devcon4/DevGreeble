import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import babel from 'rollup-plugin-babel';

let tsconfigOverride = {
    compilerOptions: {
        module: 'esnext',
        declaration: true
    }
};

export default {
    entry: './src/index.ts',
    output: {
        file: './dist/main.es.js',
        format: 'es',
        name: 'devcanvas'
    },
    plugins: [
        resolve({
            jsnext: true,
            main: true,
            browser: true,
            preferBuiltins: false
        }),
        commonjs(),
        typescript({
            tsconfigOverride: tsconfigOverride
        })
    ]
}