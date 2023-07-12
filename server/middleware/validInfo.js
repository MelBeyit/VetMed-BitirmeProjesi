module.exports = function (req, res, next) {
  //const { email, name, password } = req.body;
  const { name, surname, branch, address_, mail, phone_, password_ } = req.body;
  function validEmail(userEmail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
  }

  if (req.path === '/register') {
    console.log(!mail.length);
    if (
      ![name, surname, branch, address_, mail, phone_, password_].every(Boolean)
    ) {
      return res.status(401).json('Missing Credentials');
    } else if (!validEmail(mail)) {
      return res.status(401).json('Invalid Email');
    }
  } else if (req.path === '/login') {
    if (![mail, password_].every(Boolean)) {
      return res.status(401).json('Missing Credentials');
    } else if (!validEmail(mail)) {
      return res.status(401).json('Invalid Email');
    }
  }

  next();
};
