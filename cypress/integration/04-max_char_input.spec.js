describe('Textbox with max char', ()=> {
    it('Displays remaining char count', ()=> {

          cy.visit('http://localhost:3000/example-2');

          cy.get('span')
            .invoke('text')
            .should('equal','15');

           cy.get('input').type('Ola'); 

           cy.get('span')
            .invoke('text')
            .should('equal','12');

            cy.get('input').type(' from London'); 

            cy.get('span')
            .invoke('text')
            .should('equal','0');

    })


    it('Prevents typing more than max char ', ()=> {

        cy.visit('http://localhost:3000/example-2');

        cy.get('input').type('Ola-my-friend-from-london');  
        
        cy.get('input')
          .should('have.attr', 'value', 'Ola-my-friend-f');



})

})
