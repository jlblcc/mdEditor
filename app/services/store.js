import DS from 'ember-data';
import { inject as service } from '@ember/service';

export default DS.Store.extend({
  settings: service(),

  adapterFor(modelName) {
    let val = modelName + 'Api';

    //we really should test that the endpoint is valid here and if not use the
    //default adapter or throw an error
    if(modelName !== 'setting') {
      if(this.get(`settings.data.jsonApiUrl`) &&
        this.get(`settings.data.${val}`)) {
        modelName = 'json-api';
      }
    }

    return this._super(modelName);
  }
});
