import adapter from '@sveltejs/adapter-static';

const config = {
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: '404.html', 
      precompress: false,
      strict: true
    }),
    paths: {
      base: '/web'
    },
    appDir: 'internal' 
  }
};

export default config;