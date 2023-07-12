const jwt = require('jsonwebtoken');
require('dotenv').config();

//the code below was the code written from the tutorial
//Look at file server/routes/dashboard.js to see the change code for this code

function jwtGenerator(vetId) {
  const payload = {
    user: {
      id: vetId,
    },
  };

  return jwt.sign(payload, process.env.jwtSecret, { expiresIn: '1hr' });
}

module.exports = jwtGenerator;
