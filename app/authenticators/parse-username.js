import Ember from 'ember';
import BaseAuthenticator from 'simple-auth/authenticators/base';

export default BaseAuthenticator.extend({
  restore: function(data) {
    data = data || {};

    if(data.sessionToken) {
      var adapter = this.container.lookup('store:main').adapterFor('parseUser');

      return adapter.ajax('https://api.parse.com/1/users/me', 'GET', {
        headers: {
          'X-Parse-Session-Token': data.sessionToken
        }
      }).then(function(response) {
        return normalizeSessionData(response);
      });
    } else {
      return Ember.RSVP.reject("Session token not found");
    }
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
      return normalizeSessionData(response);
    }, function(response) {
      return Ember.RSVP.reject({message: "Incorrect username or password"});
    });
  }
});

function normalizeSessionData(response) {
  var data = {
    sessionToken: response.sessionToken,
    userData: response
  };
  delete data.userData.sessionToken;
  return data;
}
