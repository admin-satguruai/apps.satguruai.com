import type { Config } from 'tailwindcss';
const config: Config = { content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'], theme: { extend: { colors: { navy: '#10233f', saffron: '#f6a623', sky: '#eaf4ff' } } }, plugins: [] };
export default config;
