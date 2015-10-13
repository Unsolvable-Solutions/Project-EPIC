var URL = 'http://localhost:1337';
var request = require('supertest')(URL);


describe("testing AuthController register function",function(){
	it("register a new user",function(done){
		request
		.post("/register")
		.send({
			name: "Jaco",
			surname: "Bezuidenhout",
			email: "jaco@peoplesoft.co.za",
			password: "12345678"
		})
		.expect('Content-Type', /json/)
		.expect(function(res) {
			delete res.body.userId;
      	})
  		.expect(200, 
  			{
  				success: true
	      	})
  		.end(function(err, res){
	        if (err) return done(err);
	        done();
      	});
	})
	it("NOT register a new user - User Exist",function(done){
		request
		.post("/register")
		.send({
			name: "Jaco",
			surname: "Bezuidenhout",
			email: "jaco@peoplesoft.co.za",
			password: "12345678"
		})
		.expect('Content-Type', /json/)
		.expect(function(res) {
			delete res.body.err;
      	})
  		.expect(200, 
  			{
  				success: false
	      	})
  		.end(function(err, res){
	        if (err) return done(err);
	        done();
      	});
	})
	it("NOT register a new user - field not set",function(done){
		request
		.post("/register")
		.send({
			surname: "Bezuidenhout",
			email: "jaco@peoplesoft.co.za",
			password: "12345678"
		})
		.expect('Content-Type', /json/)
		.expect(function(res) {

      	})
  		.expect(200, 
  			{
  				success: false,
  				err: "Fields not set"
	      	})
  		.end(function(err, res){
	        if (err) return done(err);
	        done();
      	});
	})
});
describe("testing AuthController login function",function(){
	it("403 when user is not logged in",function(done){
		request
		.get("/me")
		.expect(403)
  		.end(function(err, res){
	        if (err) return done(err);
	        done();
      	});
	})
	it("login as existing user",function(done){
		request
		.post("/login")
		.send({
			email: "jaco@peoplesoft.co.za",
			password: "12345678"
		})
		.expect('Content-Type', /json/)
		.expect(function(res) {
			delete res.body.user;
      	})
  		.expect(200, 
  			{
  				success: true
	      	})
  		.end(function(err, res){
	        if (err) return done(err);
	        done();
      	});
	})
	it("check is is logged in",function(done){
		request
		.post("/login")
		.send({
			email: "jaco@peoplesoft.co.za",
			password: "12345678"
		})
		.end(function(err, res){
	        if (err) return done(err);
      	})
		.get("/me")
		.expect(200)
  		.end(function(err, res){
	        if (err) return done(err);
	        done();
      	});
      	
	})
	it("NOT login as incorrect uname/password",function(done){
		request
		.post("/login")
		.send({
			email: "jaco@peoplesoft.co.za",
			password: "123456789"
		})
		.expect('Content-Type', /json/)
		.expect(function(res) {
      	})
  		.expect(200, 
  			{
  				success: false,
  				err: "Incorrect Username or Password"
	      	})
  		.end(function(err, res){
	        if (err) return done(err);
	        done();
      	});
	})
	it("NOT login as unknown user",function(done){
		request
		.post("/login")
		.send({
			password: "12345678"
		})
  		.expect(400)
  		.end(function(err, res){
	        if (err) return done(err);
	        done();
      	});
	})
	it("NOT login as user does not exist",function(done){
		request
		.post("/login")
		.send({
			email: "jaco@peoplesoft2.co.za",
			password: "12345678"
		})
  		.expect(404)
  		.end(function(err, res){
	        if (err) return done(err);
	        done();
      	});
	})
})