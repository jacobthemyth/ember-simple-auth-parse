import Ember from 'ember';
import BaseAuthorizer from 'simple-auth/authorizers/base';

export default BaseAuthorizer.extend({
  authorize: function(jqXHR) {
    var sessionToken = this.get('session.secure.sessionToken');
    if (!Ember.isEmpty(sessionToken)) {
      jqXHR.setRequestHeader('X-Parse-Session-Token', sessionToken);
    }
  }
});
