import Ember from 'ember';
import DS from 'ember-data';
import uuidV4 from "npm:uuid/v4";
import Model from 'mdeditor/models/base';
import {
  validator,
  buildValidations
} from 'ember-cp-validations';

const {
  Copyable,
  computed
} = Ember;

const Validations = buildValidations({
  'recordId': validator(
    'presence', {
      presence: true,
      ignoreBlank: true,
    }),
  'json.metadata.resourceInfo.resourceType': [
    validator('array-valid'),
    validator('array-required', {
      track: ['type']
    })
  ],
  // 'json.resourceInfo.abstract': validator('presence', {
  //   presence: true,
  //   ignoreBlank: true
  // }),
  'json.metadata.resourceInfo.citation.title': validator('presence', {
    presence: true,
    ignoreBlank: true
  })
  // 'json.metadata.resourceInfo.citation': validator('length', {
  //   min: 1
  // }),
  // 'json.metadata.resourceInfo.status': validator('length', {
  //   min: 1
  // }),
  // 'json.metadata.resourceInfo.pointOfContact': validator('length', {
  //   min: 1
  // }),
  // 'json.metadata.resourceInfo.defaultResourceLocale': validator('length', {
  //   min: 1
  // })
});
export default Model.extend(Validations, Copyable, {
  profile: DS.attr('string', {
    defaultValue: 'full'
  }),
  json: DS.attr('json', {
    defaultValue() {
      const obj = Ember.Object.create({
        'schema': {
          'name': 'mdJson',
          'version': '2.0.0'
        },
        'contact': [],
        'metadata': {
          'metadataInfo': {
            'metadataIdentifier': {
              'identifier': uuidV4(),
              'namespace': 'urn:uuid'
            },
            'metadataContact':[]
          },
          'resourceInfo': {
            'resourceType': [{}],
            'citation': {
              'title': null,
              'date': []
            },
            'pointOfContact': [],
            'abstract': '',
            'shortAbstract': '',
            'status': [],
            'defaultResourceLocale': {
              'characterSet': 'UTF-8',
              'country': 'USA',
              'language': 'eng'
            },
            extent: [],
            keyword: []
          }
        },
        'metadataRepository': [],
        'dataDictionary': []
      });

      return obj;
    }
  }),
  dateUpdated: DS.attr('date', {
    defaultValue() {
      return new Date();
    }
  }),

  title: computed('json.metadata.resourceInfo.citation.title',
    function () {
      return this.get('json.metadata.resourceInfo.citation.title');
    }),

  icon: computed('json.metadata.resourceInfo.resourceType.[]', function () {
    const type = this.get(
      'json.metadata.resourceInfo.resourceType.0.type') || '';
    const list = Ember.getOwner(this)
      .lookup('service:icon');

    return type ? list.get(type) || list.get('default') : list.get(
      'defaultFile');
  }),

  recordId: computed.alias(
    'json.metadata.metadataInfo.metadataIdentifier.identifier'),

  /**
   * The trimmed varsion of the recordId.
   *
   * @property shortId
   * @type {String}
   * @readOnly
   * @category computed
   * @requires recordId
   */
  shortId: Ember.computed('recordId', function () {
    const recordId = this.get('recordId');
    if(recordId) {
      let index = recordId.indexOf('-');

      return recordId.substring(0, index > -1 ? index : 8);
    }

    return recordId;
  }),

  copy() {
    let current = this.get('cleanJson');
    let json = Ember.Object.create(current);
    let name = current.metadata.resourceInfo.citation.title;

    json.set('metadata.resourceInfo.citation.title', `Copy of ${name}`);

    return this.store.createRecord('record', {
      json: json
    });
  }
});