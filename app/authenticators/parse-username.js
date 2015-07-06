import BaseAuthenticator from 'simple-auth/authenticators/base';

export default BaseAuthenticator.extend({
  restore: function(data) {
    data = data || {};

    var adapter = this.container.lookup('store:main').adapterFor('parseUser');

    return adapter.ajax('https://api.parse.com/1/users/me', 'GET').then(function(response) {
      return {
        userData: response,
        sessionToken: data.sessionToken
      };
    });
  },

  authenticate: function(data) {
    data = data || {};

    var adapter = this.container.lookup('store:main').adapterFor('parseUser');

    return adapter.ajax('https://api.parse.com/1/login', 'GET', {
      data: {
        username: data.identification,
        password: data.password
      }
    }).then(function(response) {
      data = {sessionToken: response.sessionToken};
      delete response.sessionToken;
      data.userData = response;
      return data;
    });
  }
});
