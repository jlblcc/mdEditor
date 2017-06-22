import Ember from 'ember';
import Select from '../md-codelist-multi/component';

const {
  inject,
  computed
} = Ember;

export default Select.extend({
  /**
   * Specialized select list control for displaying and selecting
   * contacts.
   *
   * @class md-select-contact
   * @module mdeditor
   * @submodule components-input
   * @constructor
   * @extends md-select
   */

  /**
   * The contacts service
   *
   * @property contacts
   * @type {Ember.Service}
   * @readOnly
   */
  contacts: inject.service(),

  /**
   * The default CSS classnames
   *
   * @property classNames
   * @type {Array}
   * @default ['md-select-organization']
   * @readOnly
   */
  classNames: ['md-select-organization'],

  /**
   * The default codelist name. Should not be overridden.
   *
   * @property classNames
   * @protected
   * @type {String}
   * @default 'contacts'
   * @readOnly
   */
  mdCodeName: 'contacts',

  /**
   * The property that holds the select item value. Should not be overridden.
   *
   * @property valuePath
   * @protected
   * @type {String}
   * @default 'valuePath'
   * @readOnly
   */
  valuePath: 'contactId',

  /**
   * The property that holds the select item text. Should not be overridden.
   *
   * @property namePath
   * @protected
   * @type {String}
   * @default 'namePath'
   * @readOnly
   */
  namePath: 'title',

  /**
   * The contact type to display in the list. Choices are `organizations` or
   * `individuals` or 'contacts'. Passing any other value will default to
   * 'contacts'.
   *
   * @property contactType
   * @protected
   * @type {String}
   * @default 'contacts'
   */
  contactType: 'contacts',

  /**
   * The contact list mapped from the store to a codelist.
   *
   * @property mdCodes
   * @type {Array}
   * @category computed
   * @requires contacts.[]
   */
  mapped: computed('contacts.mapped.[]','contactType', function () {
    let type = this.get('contactType');

    if(!['individuals','organizations'].includes(type)){
      return this.get('contacts').get('contactsCodes');
    }

    return this.get('contacts')
      .get(type + 'Codes');
  }),

  /**
   * mapped is a re-mapped array of code objects.
   *
   * @property mapped
   * @type {Array}
   * @category computed
   * @requires mdCodeName
   */
  // mapped: Ember.computed('mdCodes.[]', 'filterId', function() {
  //   //let codeId = this.get('valuePath');
  //   //let codeName = this.get('namePath');
  //   //let tooltip = this.get('tooltipPath');
  //   let codelist = [];
  //   let icons = this.get('icons');
  //   let defaultIcon = this.get('defaultIcon');
  //   let mdCodelist = this.get('mdCodes').sortBy('title');
  //
  //   mdCodelist.forEach(function(item) {
  //     let newObject = Ember.Object.create({
  //       codeId: item.get('contactId'),
  //       codeName: item.get('title'),
  //       tooltip: item.get('combinedName'),
  //       icon: item.get('icon') || icons.get(defaultIcon)
  //     });
  //     codelist.pushObject(newObject);
  //   });
  //
  //   return codelist;
  // })
});