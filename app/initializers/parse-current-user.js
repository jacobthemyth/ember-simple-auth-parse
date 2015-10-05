import Ember from 'ember';
import Session from 'ember-simple-auth/services/session';

export default {
  name: 'parse-current-user',
  before: 'ember-simple-auth',
  initialize: function(container) {
    Session.reopen({
      currentUser: function() {

        var userData = this.get('secure.userData');

        if(Ember.isEmpty(userData)) {
          return null;
        } else {
          var store = container.lookup('store:main');
          var model = store.modelFor('parseUser');
          var serializer = store.serializerFor(model);
          serializer.normalize(model, userData);
          var record = store.push(model, userData);
          return record;
        }
      }.property('secure.userData')
    });
  }
};
