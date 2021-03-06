/* global describe beforeEach it */

const {expect} = require('chai')
const request = require('supertest')
const db = require('../db')
const app = require('../index')
const User = db.model('user')

describe('User routes', () => {
  beforeEach(() => {
    return db.sync({force: true})
  })

  describe('/api/products/', () => {
    const codysEmail = 'cody@puppybook.com'

    beforeEach(() => {
      return User.create({
        lastName: 'Pug',
        firstName: 'Cody',
        address: '51 Cody Drive, Pug Street NY 00000',
        phone: '123-456-7891',
        image: 'https://odadee.net/themes/default/assets/images/default.jpg',
        email: codysEmail
      })
    })

    it('GET /api/products', async () => {
      const res = await request(app)
        .get('/api/products')
        .expect(200)

      expect(res.body).to.be.an('array')
    })
  }) // end describe('/api/users')
}) // end describe('User routes')
