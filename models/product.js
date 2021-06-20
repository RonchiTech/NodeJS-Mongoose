// const Sequelize = require('sequelize');
const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product {
  constructor(title, price, imageUrl, description, id, userId) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
    this._id = id;
    this.userId = userId
  }

  save() {
    const db = getDb();
    let dbOperation;
    if (this._id) {
      dbOperation = db
        .collection('products')
        .updateOne({ _id: mongodb.ObjectId(this._id) }, { $set: this });
    } else {
      dbOperation = db.collection('products').insertOne(this);
    }
    return dbOperation
      .then((result) => {
        console.log('Results:', result);
      })
      .catch((err) => console.log(err));
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection('products')
      .find()
      .toArray()
      .then((products) => {
        console.log('Products:', products);
        return products;
      })
      .catch((err) => console.log(err));
  }

  static findById(prodId) {
    const db = getDb();
    return db
      .collection('products')
      .find({ _id: new mongodb.ObjectId(prodId) })
      .next()
      // .then((result) => {
      //   console.log(result);
      //   return result;
      // })
      // .catch((err) => console.log(err));
  }
  static deleteById(prodId) {
    const db = getDb();
    return db
      .collection('products')
      .deleteOne({ _id: new mongodb.ObjectId(prodId) })
      .then((result) => console.log('Product Deleted'))
      .catch((err) => console.log(err));
  }
}

module.exports = Product;
