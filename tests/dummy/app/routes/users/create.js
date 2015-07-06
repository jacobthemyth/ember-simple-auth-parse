import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    return this.store.createRecord('parseUser');
  },

  actions: {
    createUser: function(user) {
      user.set('email', user.get('username'));
      user.save().then(function(){
        this.get('session').authenticate('authenticator:parse-token', {
          sessionToken: user.get('sessionToken')
        });
      }.bind(this));
    }
  }
});
