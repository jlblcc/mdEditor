import { inject as service } from '@ember/service';
import EmberObject from '@ember/object';
import { A, isArray } from '@ember/array';
import DS from 'ember-data';


export default DS.Transform.extend({
  clean: service('cleaner'),

  deserialize(serialized) {
    let json = typeof serialized === "object" ? serialized : JSON.parse(serialized);

    if(isArray(json)){
      return A(json);
    }

    return EmberObject.create(json);
  },

  serialize(deserialized) {
    let target = isArray(deserialized) ? [] :{};
    let json = this.clean.clean(deserialized, {target:target});
    return JSON.stringify(json);
  }

});
