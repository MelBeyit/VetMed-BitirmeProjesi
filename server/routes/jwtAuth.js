const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../db');
const validInfo = require('../middleware/validInfo');
const jwtGenerator = require('../utils/jwtGenerator');
const authorization = require('../middleware/authorization');
const fs = require('fs');
//authorizeentication

router.post('/register', validInfo, async (req, res) => {
  try {
    //1. destructure the req.body ( )
    const { name, surname, branch, address_, mail, phone_, password_ } =
      req.body;

    // 2. check if user exist ( if exist then throw error)
    const user = await pool.query(
      'SELECT * FROM veterinaryInfo WHERE email = $1',
      [mail]
    );
    //res.json(user.rows);

    if (user.rows.length !== 0) {
      // user already exist
      return res.status(401).send('user already exist');
    }

    // 3. Bcrypty the user password

    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);

    const bcryptPassword = await bcrypt.hash(password_, salt);

    // 4. enter the new user inside the database

    let newUser = await pool.query(
      'INSERT INTO veterinaryInfo(vetName, vetSurname, branch_Name,address,email,phone,password) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [name, surname, branch, address_, mail, phone_, bcryptPassword]
    );

    fs.writeFile('data.json', JSON.stringify(newUser.rows[0]), (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Veriler başariyla JSON dosyasina yazildi!');
      }
    });
    //res.json(newUser.rows[0]);

    // 5 generating our jwt token
    const token = jwtGenerator(newUser.rows[0].vetId);
    return res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

//müşteri kayıt formu
router.post('/musteriKayit', validInfo, async (req, res) => {
  try {
    //1. destructure the req.body ( )
    const { mName, mSurname, mPhone_, m_mail, mAddress_, numOfPet_ } = req.body;

    // 2. check if user exist ( if exist then throw error)
    const user = await pool.query(
      'SELECT * FROM patienceOwnerInfo WHERE clientEmail = $1',
      [m_mail]
    );
    //res.json(user.rows);

    if (user.rows.length !== 0) {
      // user already exist
      return res.status(401).send('user already exist');
    }

    // 3. Bcrypty the user password
    const randomPwd = Math.random().toString().substr(2, 6);

    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const mPassword_ = randomPwd.toString();
    const bcryptPassword = await bcrypt.hash(mPassword_, salt);
    fs.readFile('data.json', 'utf8', (error, data) => {
      if (error) {
        console.log(error);
      } else {
        console.log(data);
      }

      let dataArray = JSON.parse(data);
      console.log(dataArray.vetid);
      //res.json('slm');
      //res.json(dataArray.vetId);
      const vet_id = dataArray.vetid;

      // 4. enter the new user inside the database

      let newUser = pool.query(
        'INSERT INTO patienceOwnerInfo( cName, cSurname,clientPhone,clientEmail,clientAddress,numOfPet,cPassword, vetId) VALUES ($1,$2,$3,$4,$5,$6,$7, $8) RETURNING *',
        [
          mName,
          mSurname,
          mPhone_,
          m_mail,
          mAddress_,
          numOfPet_,
          bcryptPassword,
          vet_id,
        ]
      );
    });
    //res.json(newUser.rows[0]);

    // 5 generating our jwt token
    // const token = jwtGenerator(newUser.rows[0].vetId);
    return res.json(mPassword_);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

//login route
router.post('/login', validInfo, async (req, res) => {
  try {
    // 1. destructure the req.body
    /*const { name, surname, branch, address_, mail, phone_, password_ } =
      req.body;*/
    const { mail, password_ } = req.body;

    // 2. check if user doesn't exist (if not then throw error)
    const user = await pool.query(
      'SELECT * FROM veterinaryInfo WHERE email = $1',
      [mail]
    );

    const user2 = await pool.query(
      'SELECT * FROM patienceOwnerInfo WHERE vetId = $1',
      [user.rows[0].vetid]
    );

    if (user.rows.length === 0) {
      return res.status(401).json('Password or Email is incorrect');
    }

    // 3. check if incomming password is the same the database password

    const validPassword = await bcrypt.compare(
      password_,
      user.rows[0].password
    );

    //res.json(validPassword);
    if (!validPassword) {
      return res.status(401).json('Password or Email is incorrect');
    }
    //console.log(user.rows[0]);
    fs.writeFile('data.json', JSON.stringify(user.rows[0]), (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Veriler başariyla JSON dosyasina yazildi!');
      }
    });

    fs.writeFile('vetsClients.json', JSON.stringify(user2.rows), (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Veriler başariyla JSON dosyasina yazildi!');
      }
    });

    // 4. give them the twt token
    /*const token = jwtGenerator(user.rows[0].vetId);
    res.json({ token });*/
    res.json('giriş yapılıyor');
    //return res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/client-login', validInfo, async (req, res) => {
  try {
    // 1. destructure the req.body
    /*const { name, surname, branch, address_, mail, phone_, password_ } =
      req.body;*/
    const { m_mail, mPassword_ } = req.body;

    // 2. check if user doesn't exist (if not then throw error)
    const user = await pool.query(
      'SELECT * FROM patienceOwnerInfo WHERE clientEmail = $1',
      [m_mail]
    );

    const user2 = await pool.query(
      'SELECT * FROM veterinaryInfo WHERE vetId = $1',
      [user.rows[0].vetid]
    );
    console.log(user2.rows[0]);
    console.log(user.rows[0]);

    if (user.rows.length === 0) {
      return res.status(401).json('Password or Email is incorrect');
    }

    // 3. check if incomming password is the same the database password

    const validPassword = await bcrypt.compare(
      mPassword_,
      user.rows[0].cpassword
    );

    //res.json(validPassword);
    if (!validPassword) {
      return res.status(401).json('Password or Email is incorrect');
    }
    //console.log(user.rows[0]);
    fs.writeFile('clientData.json', JSON.stringify(user.rows[0]), (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Veriler başariyla JSON dosyasina yazildi!');
      }
    });

    fs.writeFile('clientsVet.json', JSON.stringify(user2.rows[0]), (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Veriler başariyla JSON dosyasina yazildi!');
      }
    });

    // 4. give them the twt token
    /*const token = jwtGenerator(user.rows[0].vetId);
    res.json({ token });*/
    res.json('giriş yapılıyor');
    //return res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/is-verify', authorization, async (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

module.exports = router;
