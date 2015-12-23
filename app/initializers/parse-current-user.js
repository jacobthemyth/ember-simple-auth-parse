import Ember from 'ember';
import Session from 'ember-simple-auth/services/session';

export default {
  name: 'parse-current-user',
  before: 'ember-simple-auth',
  initialize: function() {
    Session.reopen({
      currentUser: function() {

        var userData = this.get('data.secure.userData');

        if(Ember.isEmpty(userData)) {
          return null;
        } else {
          var store = this.container.lookup('service:store') || this.container.lookup('store:main');
          var model = store.modelFor('parseUser');
          var serializer = store.serializerFor(model.modelName);
          var data = serializer.normalize(model, userData);
          return store.push(data);
        }
      }.property('secure.userData')
    });
  }
};
