import { Button } from '../../src/components/ui/Button'

describe('Button Component', () => {

  it('deve renderizar o componente Button corretamente', () => {
    cy.mount(<Button>Clique aqui</Button>)

    cy.get('button').should('be.visible')
    cy.contains('Clique aqui').should('be.visible')
  })

  it('deve exibir o texto corretamente', () => {
    cy.mount(<Button>Clique aqui</Button>)
    
    cy.get('button').should('have.text', 'Clique aqui')
  })

  it('deve exibir a variante primary corretamente', () => {
    cy.mount(<Button variant="primary">Clique aqui</Button>)
    
    cy.get('button').should('have.class', 'bg-blue-600')
  })

  it('deve exibir a variante secondary corretamente', () => {
    cy.mount(<Button variant="secondary">Clique aqui</Button>)
    
    cy.get('button').should('have.class', 'bg-gray-600')
  })

  it('deve exibir a variante danger corretamente', () => {
    cy.mount(<Button variant="danger">Clique aqui</Button>)
    
    cy.get('button').should('have.class', 'bg-red-600')
  })

  it('deve exibir a variante outline corretamente', () => {
    cy.mount(<Button variant="outline">Clique aqui</Button>)
    
    cy.get('button').should('have.class', 'border-gray-300')
  })

  it('deve desabilitar o botão quando disabled', () => {
    cy.mount(<Button disabled>Clique aqui</Button>)

    cy.get('button').should('be.disabled')
  })

  it('deve chamar a função onClick quando clicado', () => {
    const onClick = cy.spy()
    cy.mount(<Button onClick={onClick}>Clique aqui</Button>)
    
    cy.get('button').click()
    cy.wrap(onClick).should('have.been.calledOnce')
  })
})