const router = require('express').Router()
const {CartProducts} = require('../db/models')
// const Sequelize = require('sequelize')

module.exports = router

// api/carts/:id
router.get('/:id', async (req, res, next) => {
  try {
    const cart = await CartProducts.findAll({
      where: {
        cartId: req.params.id,
        paid: false
      }
    })
    res.json(cart)
  } catch (err) {
    next(err)
  }
})

//add to cart
router.post('/add/:id', async (req, res, next) => {
  const productId = req.params.id
  if (req.user) {
    const cartId = req.user.cartId
    try {
      console.log('cartId', cartId)
      console.log('productId', productId)
      const added = await CartProducts.create({
        cartId,
        productId
      })
      res.status(201).json(added)
    } catch (err) {
      next(err)
    }
  } else {
    res.send('not logged in')
  }
})

// api/carts/combine
router.post('/combine', async (req, res, next) => {
  const cartId = req.user.cartId
  const localCartArr = req.body
  try {
    localCartArr.forEach(async obj => {
      await CartProducts.create({
        cartId,
        productId: obj.productId
      })
    })
    console.log('local cart added to DB cart successfully')
    res.json(cartId) //send back entire cart?
  } catch (err) {
    next(err)
  }
})

// api/carts/remove/:productId
router.delete('/remove/:productId', async (req, res, next) => {
  try {
    const itemToDelete = await CartProducts.findOne({
      where: {cartId: req.user.cartId, productId: req.params.productId}
    })
    const deletedItem = await CartProducts.destroy({
      where: {id: itemToDelete.id}
    })
    console.log(deletedItem)
    res.json(itemToDelete)
  } catch (err) {
    next(err)
  }
})

// api/carts/purchase
router.put('/purchase', async (req, res, next) => {
  console.log('reqbody', req.body)
  const { cartId } = req.body
  const [numberOfAffectedRows, affectedRows] = await CartProducts.update({
    paid: true,
    // payDate: Sequelize.NOW,
    returning: true
  }, {
    where: {
      cartId
    }
  })
  console.log('affected rows', affectedRows)
  res.json(affectedRows)
})
