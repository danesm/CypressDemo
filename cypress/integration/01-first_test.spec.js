describe('Heading Text', ()=> {
    it('Contains correct title', ()=> {
          
         cy.viewport('iphone-8');
         // cy.viewport("ipad-2");
         //cy.viewport("macbook-16")

          cy.visit('http://localhost:3000/example-1');

          cy.get('h1')
            .invoke('text')
            .should('equal', 'My Test Web Application');

    })
     

});