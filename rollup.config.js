import typescript from '@rollup/plugin-typescript';
import { dts } from 'rollup-plugin-dts';

export default [
    {
        input: 'lib/customizeMaterial.ts',
        output: [
            {
                name: 'customizeMaterial',
                file: 'dist/customizeMaterial.js',
                format: 'es'
            },
        ],

        external: ['thee'],
        plugins: [typescript()]
    },
    {
        input: 'lib/customizeMaterial.ts',
        output: [{
            file: 'dist/customizeMaterial.d.ts',
            format: 'es'
        }],
        plugins: [dts()],
    },
];