const db = require('../config/database');

const users = [
  ['Juan', 'juan@mail.com'],
  ['Ana', 'ana@mail.com']
];

users.forEach(user => {
  db.query('INSERT INTO users (name, email) VALUES (?, ?)', user, (err, res) => {
    if (err) console.error(err);
  });
});
