# ember-simple-auth-parse

**Disclaimer: this library is currently preliminary and untested**

## Installation

- `ember install ember-simple-auth-parse`

## Usage

*A (mostly) complete example implementation can be found in the [dummy
app](tests/dummy). Until routeable components are released, the dummy app will
have route templates that contain only a single line, rendering a component.*

This library depends on
[ember-parse-adapter](https://github.com/clintjhill/ember-parse-adapter) and
[ember-simple-auth](https://github.com/simplabs/ember-simple-auth) to provide
simple user authentication for Parse in Ember. You should already be familiar
with ember-simple-auth and the parseUser model from ember-parse-adapter to use
this library.

### Authenticator

This library registers several authenticators to authenticate with Parse. These
can used directly with the `authenticate` method, or using the
LoginControllerMixin on controllers or components (see [dummy app](tests/dummy)
for example of using the mixin).

- **parse-user**

    ```js
    this.get('session').authenticate('authenticator:parse-user', {
      identification: 'person@email.com', // corresponds to username on Parse
      password: 'coolpassword'
    });
    ```

- **parse-token**: This authenticator is especially useful when you already have
  the session token (e.g. if you've just created a user)

    ```js
    this.get('session').authenticate('authenticator:parse-token', {
      sessionToken: 'r:pnktnjyb996sj4p156gjtp4im'
    });
    ```

### Authorizer

The supplied authorizer is called `parse` and will automatically add the session
token to the appropriate header for ajax requests to the Parse API. To use, you
will need to set the appropriate configuration options in
`config/environment.js`.

**Note: the cross origin whitelist must include Parse to allow ember-simple-auth
to add the headers to the correct requests.**

```js
// config/environment.js
var ENV = {
  // ...

  'simple-auth': {
    authorizer: 'authorizer:parse',
    crossOriginWhitelist: ['https://api.parse.com']
  }
};
```

### Current User

This library reopens the ember-simple-auth session object to add a `currentUser`
property, which is updated any time the session is authenticated. This can be
used in templates if the ApplicationRouteMixin is used, as well as the model of,
say, a route `users.current`

```js
// app/routes/users/current.js
import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model: function() {
    // an instance of the parseUser model
    return this.get('session.currentUser');
  }
});
```

### Authenticating on signup

A common use case not covered directly by ember-simple-auth is to authenticate
immediately upon sign up. This is relatively straightforward using this library.

```js
var user = this.store.createRecord('parseUser', {
  username: 'cool@email.com',
  password: 'coolpassword'
});

user.save().then(function(){
  this.get('session').authenticate('authenticator:parse-token', {
    sessionToken: user.get('sessionToken')
  });
}.bind(this));
```

## Running Tests

* `ember test`
* `ember test --server`
