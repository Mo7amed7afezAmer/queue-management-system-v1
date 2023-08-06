module.exports = async (req, res, next) => {

    // check if client sent cookie
    var csrftoken = req.cookies.csrf_token;
    if (csrftoken === undefined) {
      // no: set a new cookie
      res.cookie('csrf_token', req.authData.token, { maxAge: 900000, httpOnly: true });
      res.json(req.authData);
    } else {
        res.json(req.authData);
    }
    // next(); // <-- important!

  };