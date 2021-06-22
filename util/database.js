// const mongodb = require('mongodb');

// const MongoClient = mongodb.MongoClient;

// let _db;

// exports.mongoConnect = (cb) => {
//   MongoClient.connect(
//     'mongodb+srv://ronchinodejs:3vPLxB5YBlzDn0R0@cluster0.d74th.mongodb.net/shop?retryWrites=true&w=majority',
//     { useNewUrlParser: true, useUnifiedTopology: true }
//   )
//     .then((client) => {
//       console.log('Connected!');
//       // console.log(client);
//       _db = client.db();
//       cb()
//       // callback(result);
//     })
//     .catch((err) => {
//       console.log('Error',err);
//       throw 'No Database found';
//     });
// };

// exports.getDb = () => {
//   if (_db) {
//     return _db;
//   }
//   throw 'No database found!';
// };
// // exports.mongoConnect = mongoConnect;
// // exports.getDb = getDb;
// // module.exports = {
// //   getDb,
// //   mongoConnect
// // };
