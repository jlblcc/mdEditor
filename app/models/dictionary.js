import Ember from 'ember';
import DS from 'ember-data';
//import uuidV4 from 'npm:uuid/v4';
//import Validator from 'npm:validator';
import Model from 'mdeditor/models/base';
import {
  validator,
  buildValidations
} from 'ember-cp-validations';

const {
  Copyable,
  computed,
  //isEmpty,
  //get,
  Object: EmObject
} = Ember;

const Validations = buildValidations({
  'json.dataDictionary.citation.title': validator('presence', {
    presence: true,
    ignoreBlank: true
  }),
  'json.dataDictionary.subject': [
    validator('array-required', {
      track: []
    })
  ]
});

const JsonDefault = Ember.Object.extend({
  init() {
    this._super(...arguments);
    this.setProperties({
      dataDictionary: {
        citation: {
          title: null,
          date: [{
            date: new Date()
              .toISOString(),
            dateType: 'creation'
          }]
        },
        description: null,
        subject: [],
        responsibleParty: {},
        domain: [],
        entity: []
      },
    });
  }
});

export default Model.extend(Validations, Copyable, {
  json: DS.attr('json', {
    defaultValue() {
      return JsonDefault.create();
    }
  }),
  dateUpdated: DS.attr('date', {
    defaultValue() {
      return new Date();
    }
  }),

  title: computed('json.dataDictionary.citation.title', function () {
    return this.get('json.dataDictionary.citation.title');
  }),

  icon: 'book',

  status: computed('hasDirtyHash', function () {
    let dirty = this.get('hasDirtyHash');
    let errors = this.get('hasSchemaErrors');

    if(this.get('currentHash')) {
      return dirty ? 'danger' : errors ? 'warning' : 'success';
    }

    return 'success';
  }),

  /**
   * A list of schema errors return by the validator.
   *
   * @property hasSchemaErrors
   * @type {Array}
   * @readOnly
   * @category computed
   * @requires status
   */
  hasSchemaErrors: computed('status', function () {
    let mdjson = this.get('mdjson');
    let errors = mdjson.validateDictionary(this)
      .errors;

    //console.log(errors);

    return errors;
  }),

  copy() {
    let current = this.get('cleanJson');
    let json = EmObject.create(current);
    let name = current.dataDictionary.citation.title;

    json.set('dataDictionary.citation.title', `Copy of ${name}`);

    return this.store.createRecord('dictionary', {
      json: json
    });
  }
});
