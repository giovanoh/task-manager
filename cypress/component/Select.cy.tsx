import { Select } from '../../src/components/ui/Select'

describe('Select Component', () => {
  const options = [
    { value: '1', label: 'Opção 1' },
    { value: '2', label: 'Opção 2' },
    { value: '3', label: 'Opção 3' },
  ]

  it('deve renderizar o componente Select corretamente', () => {
    cy.mount(<Select label="Selecione" name="select" options={options} />)
    
    cy.get('select').should('be.visible')
    cy.contains('Selecione').should('be.visible')
  })

  it('deve exibir todas as opções', () => {
    cy.mount(<Select label="Selecione" name="select" options={options} />)
    
    cy.get('select').select('Opção 1')
    cy.get('select').should('have.value', '1')
  })

  it('deve permitir selecionar uma opção', () => {
    cy.mount(<Select label="Selecione" name="select" options={options} />)
    
    cy.get('select').select('Opção 2')
    cy.get('select').should('have.value', '2')
  })

  it('deve exibir mensagem de erro quando houver erro', () => {
    cy.mount(
      <Select 
        label="Selecione" 
        name="select" 
        options={options}
        error="Selecione uma opção"
      />
    )
    
    cy.contains('Selecione uma opção').should('be.visible')
  })

  it('deve desabilitar o select quando disabled', () => {
    cy.mount(
      <Select 
        label="Selecione" 
        name="select" 
        options={options}
        disabled
      />
    )
    
    cy.get('select').should('be.disabled')
  })
})

