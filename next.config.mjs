/** @type {import('next').NextConfig} */
const config = { reactStrictMode: true, productionBrowserSourceMaps: false, compiler: { removeConsole: process.env.NODE_ENV === 'production' }, async headers() { return [{source: '/branding/petmeta-logo-clean.png', has: [{type: 'query', key: 'v', value: '5e19900cd6fb'}], headers: [{key: 'Cache-Control', value: 'public, max-age=31536000, immutable'}]}]; }, distDir: process.env.NODE_ENV === 'development' ? '.next' : '.next-production' };
export default config;
