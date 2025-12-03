import { Textarea } from '../../src/components/ui/Textarea'

describe('Textarea Component', () => {
  it('deve renderizar o componente Textarea corretamente', () => {
    cy.mount(<Textarea label="Mensagem" name="message" />)
    
    cy.get('textarea').should('be.visible')
    cy.contains('Mensagem').should('be.visible')
  })

  it('deve permitir digitar texto', () => {
    cy.mount(<Textarea label="Mensagem" name="message" />)
    
    cy.get('textarea').type('Olá, mundo!')
    cy.get('textarea').should('have.value', 'Olá, mundo!')
  })

  it('deve exibir mensagem de erro quando houver erro', () => {
    cy.mount(<Textarea label="Mensagem" name="message" error="Texto inválido" />)
    
    cy.contains('Texto inválido').should('be.visible')
  })

  it('deve exibir helper text quando fornecido', () => {
    cy.mount(<Textarea label="Mensagem" name="message" helperText="Texto de ajuda" />)
    
    cy.contains('Texto de ajuda').should('be.visible')
  })

  it('deve desabilitar o textarea quando disabled', () => {
    cy.mount(<Textarea label="Mensagem" name="message" disabled />)
    
    cy.get('textarea').should('be.disabled')
  })
})