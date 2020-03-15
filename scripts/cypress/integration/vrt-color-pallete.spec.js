describe('VRT Color Pallete', () => {

    before( () => {
        cy.visit('https://amespinosa11.github.io/VRT_colorPallete/');
        cy.get('#limpiarPaleta').click();
    });

    /* Prueba exitosa */
    it('Change colors 1', ()=> {
        cy.get('#nuevaPaleta').click();
        cy.get('#colors-viewer').screenshot(`VRT${Cypress.env('PICTURE_1')}`);
    });

    it('Change colors 2', ()=> {
        cy.get('#nuevaPaleta').click();
        cy.get('#colors-viewer').screenshot(`VRT${Cypress.env('PICTURE_2')}`);
    })
})