import Select from '../md-select/component';
import { task, timeout } from 'ember-concurrency';
import { inject as service } from '@ember/service';

/**
 * Object with properties defining types of epsg.io objects
 *
 * @const epsgKind
 * @type {Object}
 */
const epsgKind = {
  CRS: 'All coordinate reference systems',
  'CRS-PROJCRS': 'Projected coordinate system',
  'CRS-GEOGCRS': 'Geodetic coordinate system',
  'CRS-GEOG3DCRS': 'Geodetic 3D coordinate system',
  'CRS-GCENCRS': 'Geocentric coordinate system',
  'CRS-VERTCRS': 'Vertical coordinate system',
  'CRS-ENGCRS': 'Engineering coordinate system',
  'CRS-COMPOUNDCRS': 'Compound coordinate system',
  ELLIPSOID: 'Ellipsoid',
  DATUM: 'Datum',
  'DATUM-VERTDAT': 'Vertical datum',
  'DATUM-ENGDAT': 'Engineering datum',
  'DATUM-GEODDAT': 'Geodetic datum'
};

export default Select.extend({
  /**
   * @module mdeditor
   * @submodule components-input
   */

  /**
   * Select input that queries https://epsg.io/
   *
   * @class input--md-select-epsg
   * @extends md-select
   * @constructor
   */

  layoutName: 'components/input/md-select',

  ajax: service(),
  valuePath: 'codeId',
  namePath: 'codeName',
  tooltip: true,
  tooltipPath: 'tooltip',
  icon: true,
  create: false,
  searchEnabled: true,

  /**
   * The kind of spatial object to search for, e.g. DATUM, CRS, etc.
   *
   * @property kind
   * @type {String|Boolean}
   * @default "false"
   */
  kind: false,

  infotip: 'You may search http://epsg.io for codes by entering a numeric code or a string, e.g. "4326" or "Google"). Note: Only the first 10 results are returned.',
  placeholder: 'Select a code or type to search the EPSG database.',

  /**
   * Task that searches epsg.io using supplied terms.
   *
   * @method searchEpsg
   * @param {String} term The search string
   * @async
   * @return {Promise}
   */
  searchEpsg: task(function* (term) {
    yield timeout(600);

    let kind = this.kind ? ` kind:${this.kind}` : '';
    let url = `https://epsg.io/?q=${term}${kind}&format=json`;

    return this.ajax.request(url).then((resp) => this.mapEpsg(resp
      .results));
  }),

  /**
   * Converts the epsg.io objects to a codelist
   *
   * @method mapEpsg
   * @param {Array} obj The search results from epsg.io
   * @return {Array}
   */
  mapEpsg(obj) {
    return obj.map(o => {
      return {
        codeId: o.code,
        codeName: o.code + ': ' + o.name,
        tooltip: `${epsgKind[o.kind]}` + (o.area ?
          ` (${o.area})` : ''),
        icon: 'globe',
        wkt: o.wkt
      };
    })
  },

  search() {
    return this.searchEpsg.perform(...arguments);
  }
});
