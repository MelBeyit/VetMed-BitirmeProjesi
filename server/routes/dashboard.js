const router = require('express').Router();
const authorization = require('../middleware/authorization');
const pool = require('../db');
const fs = require('fs');
//const passport = require('passport');

/*router.get(
  '/dashboard',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const userId = req.user.id;
    console.log(`User  ${userId}`);
    try {
      const query = `
      SELECT *
      FROM veterinaryInfo AS v
      JOIN patienceOwnerInfo AS p
      ON v.vetID = p.vetID
      WHERE v.vetID = $1 AND p.vetId = v.vetID
    `;
      const values = [userId];
      const result = pool.query(query, values);
      const data = result.rows[0];
      console.log(result.rows[0]);
      res.json(data);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);*/

/*router.post('/', authorization, async (req, res) => {
  try {
    console.log('slmmmmm');
    console.log(req.user);
    const user = await pool.query(
      'SELECT vetName FROM users WHERE vetID = $1',
      [req.user.id]
    );

   
    console.log('name: ' + user.rows[0]);
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});*/

router.get('/', async (req, res) => {
  //const userId = req.user.id;

  try {
    fs.readFile('data.json', 'utf8', (error, data) => {
      if (error) {
        console.log(error);
      } else {
        console.log(data);
      }

      let dataArray = JSON.parse(data);
      console.log(dataArray.vetname);
      //res.json('slm');
      console.log(req.user);
      res.json(dataArray.vetname);
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//veterinerin sahip olduğu müşterilerin bir listesini almak
/*router.get('/vet-patients/:vetId', authorization, async (req, res) => {
  try {
    const vetId = req.params.vetId;
    const clients = await pool.query(
      'SELECT * FROM patienceOwnerInfo INNER JOIN veterinaryInfo ON patienceOwnerInfo.vetId = veterinaryInfo.vetId WHERE patienceOwnerInfo.vetId = $1',
      [vetId]
    );
    res.json(clients.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});*/

router.get('/cli', async (req, res) => {
  try {
    fs.readFile('clientData.json', 'utf8', (error, data) => {
      if (error) {
        console.log(error);
      } else {
        console.log(data);
      }

      let dataArray = JSON.parse(data);
      console.log(dataArray.cname);
      //res.json('slm');
      res.json(dataArray.cname);
    });

    //const dataArray = JSON.parse(data);
    //console.log(dataArray);
    //res.json(req.user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/cli-vet', async (req, res) => {
  try {
    fs.readFile('clientsVet.json', 'utf8', (error, data2) => {
      if (error) {
        console.log(error);
      } else {
        console.log(data2);
      }

      let dataArray2 = JSON.parse(data2);
      console.log(dataArray2.vetname);
      //res.json('slm');
      res.json(dataArray2);
    });
    //const dataArray = JSON.parse(data);
    //console.log(dataArray);
    //res.json(req.user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/all-cli', async (req, res) => {
  try {
    fs.readFile('vetsClients.json', 'utf8', (error, data) => {
      if (error) {
        console.log(error);
      } else {
        console.log(data);
      }

      let dataArray = JSON.parse(data);
      console.log('MÜŞTERİ ADLARI ');
      console.log(dataArray);
      //res.json('slm');
      res.json(dataArray);
    });

    //const dataArray = JSON.parse(data);
    //console.log(dataArray);
    //res.json(req.user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
