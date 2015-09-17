    <br/>
    <br/>
    <br/>
<div class="col-md-offset-4 col-md-4 well">
<h1 class="text-center">Login</h1>
  <% if (errors) {%>
    <% errors.forEach(function (error) { %>
      <p class="alert alert-danger"><%= __(error) %></p>
    <% }) %>
  <% } %>
  <div class="row">
    <form role="form" class="form col-md-offset-2 col-md-8" action="/auth/local" method="post">
      <h3>Username/Email:</h3><input class="form-control" type="text" name="identifier" placeholder="Username or Email">
      <h3>Password:</h3><input class="form-control" type="password" name="password" placeholder="Password">
      <br/>
      <div class="pull-right">
         <button class="btn btn-success" type="submit">Log in</button><br>
         Or <a href="/register" class="btn btn-primary" type="submit">Register</a>
      </div>
    </form>
  </div>
  <div class="text-center">
  <% if (Object.keys(providers).length) {%>
    <h4>You can also login with:</h4>

    <% Object.keys(providers).forEach(function (key) { %>
      <a class="btn btn-primary" href="/auth/<%= providers[key].slug %>" role="button"><%= providers[key].name %></a>
    <% }) %>
  <% } %>
  </div>
</div>