///<reference types="cypress"/>

import { faker } from '@faker-js/faker';
import pet from '../fixtures/pet.json';
import updatePet from '../fixtures/updatePet.json';


// petId;
pet.id = parseInt(faker.random.numeric(5));
pet.name = faker.animal.crocodilia.name;
pet.category.id = parseInt(faker.random.numeric(3));
pet.category.name = faker.animal.type();

//updatePet;
updatePet.id = pet.id;
updatePet.name = pet.name;
updatePet.category.id = parseInt(faker.random.numeric(4));
updatePet.category.name = faker.animal.type();
updatePet.status = 'pending';

//updatePetFormData;
let updatePetFormCategName = faker.animal.type();
let updatePetFormStatus = 'sold';


describe('Pet suite', () => {

  it('Pet creation', () => {
    cy.log('Create pet');
    cy.request('POST', '/pet', pet).then(response => {
      console.log(response);

      // Status code перевіряємо одним із цих перевірок:
      expect(response.status).to.be.equal(200);
      expect(response.statusText).to.be.equal('OK');
      expect(response.isOkStatusCode).to.be.true;
      expect(response.body.id).to.be.equal(pet.id);
      expect(response.body.name).to.be.equal(pet.name);
      expect(response.body.category.id).to.be.equal(pet.category.id);
      expect(response.body.category.name).to.be.equal(pet.category.name);
    })
  })

  it(`Get pet with ${pet.id}`, () => {
    cy.log('Get pet');
    cy.request('GET', `/pet/${pet.id}`).then(response => {
      console.log(response)

      expect(response.status).to.be.equal(200);
      expect(response.statusText).to.be.equal('OK');
      expect(response.isOkStatusCode).to.be.true;
      expect(response.body.id).to.be.equal(pet.id);
      expect(response.body.name).to.be.equal(pet.name);
      expect(response.body.category.id).to.be.equal(pet.category.id);
      expect(response.body.category.name).to.be.equal(pet.category.name);
    })
  })


  it(`Update pet with id ${pet.id}`, () => {
    cy.log('Update pet');
    cy.request('PUT', `/pet`, updatePet).then(response => {
      expect(response.status).to.be.equal(200);
      expect(response.statusText).to.be.equal('OK');
      expect(response.isOkStatusCode).to.be.true;
      expect(response.body.id).to.be.equal(pet.id);
      expect(response.body.name).to.be.equal(pet.name);
      expect(response.body.category.id).to.be.equal(updatePet.category.id);
      expect(response.body.category.name).to.be.equal(updatePet.category.name);
      expect(response.body.status).to.be.equal(updatePet.status);
    })

    cy.log('Get Pet');
    cy.request('GET', `/pet/${updatePet.id}`).then(response => {
      expect(response.status).to.be.equal(200);
      expect(response.statusText).to.be.equal('OK');
      expect(response.isOkStatusCode).to.be.true;
      expect(response.body.id).to.be.equal(updatePet.id);
      expect(response.body.name).to.be.equal(updatePet.name);
      expect(response.body.category.id).to.be.equal(updatePet.category.id);
      expect(response.body.category.name).to.be.equal(updatePet.category.name);
      expect(response.body.status).to.be.equal(updatePet.status);
    })
  })

  it(`Find pet by status ${pet.status}`, () => {
    cy.log('Find pet by status');
    cy.request('GET', `/pet/findByStatus?status=pending`, updatePet).then(response => {
      expect(response.status).to.be.equal(200);
      expect(response.statusText).to.be.equal('OK');
      expect(response.isOkStatusCode).to.be.true;
      expect(response.allRequestResponses[0]["Response Body"][0].status).to.be.equal(updatePet.status);
    })
  })

  it(`Update pet with id ${updatePet.id} using form data`, () => {
    cy.log(`Update pet with id ${updatePet.id} using form data`);
    cy.request({
      method: 'POST',
      url: `pet/${updatePet.id}`,
      form: true,
      body: {
        id: `${updatePet.id}`,
        category: {
          id: updatePet.category.id,
          name: updatePetFormCategName
        },
        name: updatePet.name,
        photoUrls: [
          updatePet.photoUrls
        ],
        tags: [
          {
            id: updatePet.tags.id,
            name: updatePet.tags.name
          }
        ],
        status: updatePetFormStatus
      }
    }).then(response => {
      response = JSON.stringify(response.body)
      let responseBody = JSON.parse(response)
      expect(responseBody.code).to.be.equal(200);
      expect(parseInt(responseBody.message)).to.be.equal(updatePet.id);
    })
  })

  it(`Get pet with ${updatePet.id}`, () => {
    cy.log('Get pet');
    cy.request('GET', `/pet/${updatePet.id}`).then(response => {
      expect(response.status).to.be.equal(200);
      expect(response.statusText).to.be.equal('OK');
      expect(response.isOkStatusCode).to.be.true;
      expect(response.body.id).to.be.equal(updatePet.id);
      expect(response.body.name).to.be.equal(updatePet.name);
      expect(response.body.category.id).to.be.equal(updatePet.category.id);
      expect(response.body.status).to.be.equal(updatePetFormStatus);
    })
  })

  it(`Delete pet with ${updatePet.id}`, () => {
    cy.log('Delete pet');
    cy.request('DELETE', `/pet/${updatePet.id}`, pet).then(response => {
      expect(response.status).to.be.equal(200);
      expect(response.statusText).to.be.equal('OK');
      expect(response.isOkStatusCode).to.be.true;
      expect(parseInt(response.body.message)).to.be.equal(updatePet.id);
    })
  })

  it(`Get pet with ${updatePet.id}`, () => {
    cy.log('Get pet');
    cy.request({
      method: 'GET',
      url: `/pet/${updatePet.id}`,
      failOnStatusCode: false
    }).then(response => {
      expect(response.status).to.be.equal(404);
      expect(response.statusText).to.be.equal('Not Found');
      expect(response.isOkStatusCode).to.be.false;
      expect(response.body.message).to.be.equal('Pet not found');
    })
  })
})
