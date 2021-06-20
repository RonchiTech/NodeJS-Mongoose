const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      console.log(typeof cp.prodId, typeof product._id);
      return cp.prodId.toString() === product._id.toString();
    });

    let newQuantity = 1;
    let updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        prodId: new mongodb.ObjectId(product._id),
        quantity: newQuantity,
      });
    }
    const updatedCart = {
      items: updatedCartItems,
    };
    const db = getDb();
    return db
      .collection('users')
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );

    // const updatedCart = {
    //   items: [{ productId: new mongodb.ObjectId(product._id), quantity: 1 }],
    // };
    // const db = getDb();
    // return db
    //   .collection('users')
    //   .updateOne(
    //     { _id: new mongodb.ObjectId(this._id) },
    //     { $set: { cart: updatedCart } }
    //   );
  }
  getCart() {
    const db = getDb();
    const prodId = this.cart.items.map((i) => {
      return i.prodId;
    });
    return db
      .collection('products')
      .find({ _id: { $in: prodId } })
      .toArray()
      .then((products) => {
        return products.map((p) => {
          return {
            ...p,
            quantity: this.cart.items.find((i) => {
              return i.prodId.toString() === p._id.toString();
            }).quantity,
          };
        });
      })
      .catch((err) => console.log(err));
  }
  save() {
    const db = getDb();
    return db.collection('users').insertOne(this);
  }
  static findById(userId) {
    const db = getDb();
    return db
      .collection('users')
      .findOne({ _id: new mongodb.ObjectId(userId) });
  }
}

module.exports = User;
