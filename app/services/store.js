import DS from 'ember-data';
import { inject as service } from '@ember/service';

export default DS.Store.extend({
  settings: service(),

  adapterFor(modelName) {
    if(modelName === 'contact' && this.settings.data.contactApi) {
      modelName = 'json-api';
    }

    return this._super(modelName);
  }
});
