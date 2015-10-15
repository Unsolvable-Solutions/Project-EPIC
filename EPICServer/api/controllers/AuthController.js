var AUTH = {};

/*

	to rgister a user
		1. create a person
		2. create a user and link person

*/

AUTH.register = function(req,res)
{
	var values = req.allParams();
	if (!(values.name && values.surname && values.email && values.password))
		return res.json({success: false, err: "Fields not set"})

	Person.findOrCreate({email: values.email},{name: values.name, surname: values.surname, email: values.email})
	.exec(function(err,person){
		if (err)
		{
			return res.json({success: false, err: err});
		}
		User.find({person: person.id})
		.exec(function(err,user){
			if (err)
			{	
				return res.json({success: false, err: err});
			}
			if (user.person)
			{
				return res.json({success: false, err: "User exists"});
			}

			User.create({person: person.id, password: values.password})
			.exec(function(err,user){
				if (err)
				{	
					return res.json({success: false, err: err});
				}
				
				if (user.person)
				{
					return res.json({success: true, userId: user.id});
				}
			});
			
		})
	});
}

/*

	to login a user
		1. find a person with email
		2. find a user with link to person and has same password

*/

AUTH.login = function(req,res)
{
	var values = req.allParams();
	if (!(values.email && values.password))
		return res.badRequest();

	Person.findOne({email:values.email})
	.exec(function(err,person){
		if (err)
		{	
			return res.badRequest(err);
		}
		else
		{
			if (person)
			{
				User.findOne({person: person.id, password: values.password})
				.populate("meetings")
				.exec(function(err,user){
					if (err)
					{	
						return res.badRequest(err);
					}
					else
					{
						if (user)
						{		
							req.session.authenticated = true;
							req.session.user = user;
							return res.json({success: true, user: {
								person: person,
								meetings: user.meetings || []
							}});
						}
						else
						{
							return res.json({success: false, err: "Incorrect Username or Password"});
						}
					}
				});
			}
			else
			{
				return res.notFound();
			}
		}
		

	});
}

AUTH.logout = function(req,res)
{
	req.session.authenticated = false;
	req.session.user = null;

	return res.redirect('#/login');
}

module.exports = AUTH;