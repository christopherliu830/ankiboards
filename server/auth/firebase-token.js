const express = require('express');
const admin = require('firebase-admin');
const bearerToken = require('express-bearer-token');
const UserModel = require('../model/model').UserModel;

module.exports = (req, res, next) => {
  bearerToken()(req, res, () => {
    const token = req.token;
    if (!token) return res.status(401).send('You need to provide a token to access the server');
    admin.auth().verifyIdToken(token)
      .then(decodedToken => {
        return UserModel.findOne({firebaseUid: decodedToken.uid});
      })
      .then(user => {
        if (!user) throw Error("Error decoding token");
        req.user = user;
        next();
      })
      .catch(err => {
        res.status(404).send(err.toString());
    });
  })
};