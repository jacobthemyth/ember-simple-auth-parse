import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    createUser: function() {
      this.sendAction('action', this.get('model'));
    }
  }
});
