var bcrypt = require('bcrypt');

var AuthController = {
  me: function (req, res) {
    res.json(req.session.owner);
  },
  login: function (req, res) {
    var values = req.allParams();
    if (values.email && values.password)
    {
        console.log("Login Attempt",values);
        Owner.findOne({email: values.email}).exec(function(err,owner){
        if (owner)
        {
          bcrypt.compare(values.password, owner.password, function(err, result) {
            if(err) return cb(err);
            if (result)
            {
              console.log(owner);
              req.session.owner = owner;
              delete req.session.owner.password;
              req.session.authenticated = true;
              res.json({success:true, me: req.session.owner});
            }
            else
            {
              res.json({success: false, err: "Incorrect username/password"});
            }
          });
        }
        else
        {
          res.json({success: false, err: "Incorrect username/password"});
        }
      });
    }
    else
    {
      res.json({success: false, err: "Incorrect username/password"});
    }
  },

  logout: function (req, res) {
    req.session.authenticated = false;
    req.session.owner = {};
    res.redirect("/");
  },

  register: function (req, res) {
    var values = req.allParams();
    try 
    {
      if (values.email && (values.password.length >= 8) && values.name && values.surname)
      {
        Owner.findOne({email: values.email}).exec(function (err, owner) {
          if (owner)
          {
            AuthController.login(req,res);
          }
          else
          {
            Owner.create({name: values.name, surname: values.surname, email: values.email, password: values.password}).exec(function (err, owner) {
              AuthController.login(req,res);
            });
          }
        });
      }
      else
      {
        res.json({success: false});
      }
    }
    catch (e)
    {
        res.json({success: false, err: e});
    }
  }
};

module.exports = AuthController;
