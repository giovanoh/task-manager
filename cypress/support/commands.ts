import { mount } from 'cypress/react'

/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      dataCy(value: string): Chainable<JQuery<HTMLElement>>

      /**
       * Custom command to mount a component
       * @example cy.mount(<MyComponent />)
       */
      mount: typeof mount
    }
  }
}

// Comando customizado para selecionar elementos por data-cy
Cypress.Commands.add('dataCy', (value) => {
  return cy.get(`[data-cy=${value}]`)
})

// Comando customizado para montar um componente
Cypress.Commands.add('mount', (component, options) => {
  // Wrap any parent components needed
  // ie: return mount(<MyProvider>{component}</MyProvider>, options)
  return mount(component, options)
})

export {}
