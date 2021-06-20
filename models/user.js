const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }
  getOrders() {
    const db = getDb();
    return db
        .collection('orders')
        //find({ user: { _id: new mongodb.ObjectId(this._id) } })
        .find({ 'user._id': new mongodb.ObjectId(this._id) })
        .toArray()
        .then((results) => {
          console.log('getting orders', results);
          return results;
        })
        .catch((err) => console.log(err))
  }
  addOrder() {
    const db = getDb();
    return this.getCart()
      .then((products) => {
        const order = {
          items: products,
          user: {
            _id: new mongodb.ObjectId(this._id),
            name: this.name,
            email: this.email,
          },
        };
        return db.collection('orders').insertOne(order);
      })
      .then((result) => {
        this.cart = [];
        return db
          .collection('users')
          .updateOne(
            { _id: new mongodb.ObjectId(this._id) },
            { $set: { cart: { items: [] } } }
          );
      });
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
  deleteItemFromCart(prodId) {
    const updatedCart = this.cart.items.filter((i) => {
      return i.prodId.toString() !== prodId.toString();
    });
    const db = getDb();
    return db
      .collection('users')
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: { items: updatedCart } } }
      );
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
