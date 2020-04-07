import Component from '@ember/component';
import { alias } from '@ember/object/computed';
import { once } from '@ember/runloop';
import { set, getWithDefault, get, computed } from '@ember/object';
import { isEmpty } from 'mdeditor/utils/md-object'
import { isPresent } from '@ember/utils';
import {
  validator,
  buildValidations
} from 'ember-cp-validations';

const MESSAGE =
  'One of Reference System Type, Identifier, WKT, or Parameter Set is required.'
const OPTS = {
  validate(value, options, model) {
    return model.notEmpty || MESSAGE;
  }
};
const Validations = buildValidations({
  'refType': validator('inline', OPTS),
  'refSystemId': validator('inline', OPTS),
  'wkt': validator('inline', OPTS),
  'paramSet': validator('inline', OPTS)
},{
  dependentKeys: ['model.notEmpty'],
});

export default Component.extend(Validations, {
  tagName: 'form',
  didReceiveAttrs() {
    this._super(...arguments);

    let model = get(this, 'model');
    if(model) {
      once(this, function () {
        set(model, 'referenceSystemIdentifier', getWithDefault(model,
          'referenceSystemIdentifier', {}));
        set(model, 'referenceSystemParameterSet', getWithDefault(model,
          'referenceSystemParameterSet', {}));
      });
    }
  },
  /**
   * The string representing the path in the profile object for the resource.
   *
   * @property profilePath
   * @type {String}
   * @default 'false'
   * @required
   */

  /**
   * The object to use as the data model for the resource.
   *
   * @property model
   * @type {Object}
   * @required
   */

  classNames: ['form'],
  refSystem: alias('model.referenceSystemIdentifier'),
  refSystemId: alias('model.referenceSystemIdentifier.identifier'),
  refType: alias('model.referenceSystemType'),
  wkt: alias('model.referenceSystemWKT'),
  paramSet: alias('model.referenceSystemParameterSet'),
  hasTypes: computed('refSystem', 'refType', 'wkt', 'paramsSet',
    function () {
      let types = {
        refType: isPresent(this.refType),
        refSystem: !isEmpty(this.refSystem),
        wkt: isPresent(this.wkt),
        params: !isEmpty(this.params)
      }
      return types;
    }),
  notEmpty: computed('refSystem','refSystemId', 'refType', 'wkt', 'paramsSet',
    function () {
      return isPresent(this.refType) ||
        !isEmpty(this.refSystem) ||
        isPresent(this.refSystemId) ||
        isPresent(this.wkt) ||
        (this.paramSet &&
          (!isEmpty(this.paramSet.projection) ||
            !isEmpty(this.paramSet.geodetic) ||
            !isEmpty(this.paramSet.verticalDatum))
        );
    }),

});
