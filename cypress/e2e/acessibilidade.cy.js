describe('Teste Beta - Acessibilidade Responsiva', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/'); // baseUrl já configurada, então usa raiz
    cy.injectAxe();
  });

  it('Deve passar nas regras básicas de acessibilidade no desktop', () => {
    cy.checkA11y(null, {
      includedImpacts: ['critical', 'serious']
    });
  });

  it('Deve ser responsiva e acessível em diferentes tamanhos de tela', () => {
    const viewports = [
      { width: 375, height: 667 },   // iPhone 6/7/8
      { width: 768, height: 1024 },  // iPad
      { width: 1280, height: 800 }   // MacBook 13"
    ];

    viewports.forEach(({ width, height }) => {
      cy.viewport(width, height);
      cy.checkA11y(null, {
        includedImpacts: ['critical', 'serious']
      });
    });
  });

  it('Deve validar presença de alt em imagens e labels em inputs', () => {
    cy.get('img').each(($img) => {
      cy.wrap($img).should('have.attr', 'alt').and('not.be.empty');
    });

    cy.get('input').each(($input) => {
      const id = $input.attr('id');
      if (id) {
        cy.get(`label[for="${id}"]`).should('exist');
      }
    });
  });
});
