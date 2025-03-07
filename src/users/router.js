const express = require('express');
const db = require('../database/connection');

const router = express.Router();

// Read all users with query params
router.get('/', function (req, res) {
  const nameQuery = req.query.name;

  // Search by name
  if (nameQuery) {
    const sql = 'SELECT * FROM user WHERE name LIKE ?';

    db.query(sql, [`%${nameQuery}%`], (err, rows) => {
      if (err) {
        return res.status(500).json({ message: 'Error when connect to mysql' });
      }
      return res.json(rows);
    });
    return;
  }
  // Get all
  const sql = 'SELECT * FROM user';
  db.query(sql, [nameQuery], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Error when connect to mysql' });
    }

    res.json(rows);
  });
});

// Read one user
router.get('/:id', function (req, res) {
  const userId = parseInt(req.params.id, 10);

  const sql = 'SELECT * FROM user WHERE id = ?';

  db.query(sql, [userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Error when connect to mysql' });
    }
    if (rows.length === 0) {
      return res.status(404).json({
        message: 'User not found',
      });
    }
    return res.json(rows[0]);
  });
});

// Create one user
router.post('/', function (req, res) {
  const { name } = req.body;
  const { age } = req.body;
  const gender = Boolean(req.body.gender);
  const shouldAddUser = Boolean(name !== undefined && age !== undefined && gender !== undefined);

  if (shouldAddUser) {
    const sql = 'INSERT INTO user(name, age, gender) VALUES(?, ?, ?)';
    db.query(sql, [name, age, gender], (err, results) => {
      if (err) {
        return res.status(400).json({ message: 'Error when insert data' });
      }
      return res.json(results);
    });
  } else {
    return res.status(400).json({
      message: 'Missing some stuffs bro',
    });
  }
});

// Update one user
router.patch('/:id', function (req, res) {
  const userId = parseInt(req.params.id, 10);
  // const user = allUsers.find((user) => user.id === userId);
  const { name } = req.body;
  const { age } = req.body;
  const gender = Boolean(req.body.gender);

  const sql = 'SELECT * FROM user WHERE id = ?';
  db.query(sql, [userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Error when connect to mysql' });
    }
    if (rows.length === 0) {
      return res.status(404).json({
        message: 'User not found',
      });
    }
    const updateSql = 'UPDATE user SET name=?,age=?,gender=? where id=?';
    db.query(updateSql, [name, age, gender, userId], (updateErr, results) => {
      if (updateErr) {
        return res.status(400).json({ message: 'Error when update data' });
      }

      return res.json(results);
    });
  });
});

// Delete one user
router.delete('/:id', function (req, res) {
  const userId = parseInt(req.params.id, 10);

  const sql = 'DELETE from user WHERE id=?';

  db.query(sql, [userId], (err, result) => {
    if (err) {
      return res.status(400).json({ message: 'Error when update data' });
    }
    return res.json(result);
  });
});

module.exports = router;
