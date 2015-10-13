var Sails = require("sails");

before(function(done){
	Sails.lift({},function(err,server){
		if (err) return done(err);
		done(err,server);
	})
});

after(function(done){
	Sails.lower(done);
});