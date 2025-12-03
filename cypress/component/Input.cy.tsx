import { Input } from '../../src/components/ui/Input'

describe('Input Component', () => {
  it('deve renderizar o componente Input corretamente', () => {
    cy.mount(<Input label="Nome" name="name" />)
    
    cy.get('input').should('be.visible')
    cy.contains('Nome').should('be.visible')
  })

  it('deve permitir digitar texto', () => {
    cy.mount(<Input label="Email" name="email" type="email" />)
    
    cy.get('input').type('test@example.com')
    cy.get('input').should('have.value', 'test@example.com')
  })

  it('deve exibir mensagem de erro quando houver erro', () => {
    cy.mount(<Input label="Email" name="email" error="Email inválido"/>)
    
    cy.contains('Email inválido').should('be.visible')
  })

  it('deve desabilitar o input quando disabled', () => {
    cy.mount(<Input label="Campo" name="field" disabled />)
    
    cy.get('input').should('be.disabled')
  })

  it('deve exibir placeholder quando fornecido', () => {
    cy.mount(
      <Input 
        label="Buscar" 
        name="search" 
        placeholder="Digite para buscar..."
      />
    )
    
    cy.get('input').should('have.attr', 'placeholder', 'Digite para buscar...')
  })
})

