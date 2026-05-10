import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        pricing: resolve(__dirname, 'pricing.html'),
        survey: resolve(__dirname, 'survey.html'),
        results: resolve(__dirname, 'results.html'),
        testConcepts: resolve(__dirname, 'test-concepts.html'),
        testIntro: resolve(__dirname, 'test-intro.html'),
        testLogin: resolve(__dirname, 'test-login.html'),
        testGauge: resolve(__dirname, 'test-gauge.html'),
        testProblem: resolve(__dirname, 'test-problem.html'),
        testResult: resolve(__dirname, 'test-result.html'),
        avatar: resolve(__dirname, 'avatar.html'),
      },
    },
  },
});
