import { defineConfig } from 'cypress'
import { devServer } from '@cypress/vite-dev-server'

export default defineConfig({
  projectId: 'stor2h',
  e2e: {
    baseUrl: 'http://localhost:5173',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
  },
  component: {
    devServer(cypressConfig) {
      return devServer({
        ...cypressConfig,
        framework: 'react',
        viteConfig: {},
      })
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.ts',
    indexHtmlFile: 'cypress/support/component-index.html',
  },
  fixturesFolder: 'cypress/fixtures',
  screenshotsFolder: 'cypress/screenshots',
  videosFolder: 'cypress/videos',
})


