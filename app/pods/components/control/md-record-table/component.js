import Ember from 'ember';
import Table from 'mdeditor/pods/components/md-models-table/component';

const {
  get,
  computed,
  A
} = Ember;

export default Table.extend({
  /**
   * @module mdeditor
   * @submodule components-control
   */

  /**
   * Table used to display objects. Includes column to toggle selection for all
   * rows.
   *
   *```handlebars
   * \{{control/md-record-table
   *   data=model.data
   *   columns=model.columns
   *   select=callback
   * }}
   * ```
   *
   * @class md-select-table
   * @extends models-table
   */

  classNames: ['md-record-table'],

  /**
   * Array of table records
   *
   * @property data
   * @type {Array}
   * @default []
   * @required
   */

  /**
   * Array of column configs for the table.
   * See http://onechiporenko.github.io/ember-models-table
   *
   * ```javascript
   * [{
   *  propertyName: 'id',
   *  title: 'ID'
   * }, {
   *  title: '',
   *  template: 'components/leaflet-table/actions',
   *  className: 'text-center text-nowrap'
   * }]
   * ```
   *
   * @property dataColumns
   * @type {Array}
   * @required
   * @default []
   */
  dataColumns: A(),

  /**
   * Column configs for the checkbox column.
   * See http://onechiporenko.github.io/ember-models-table
   *
   *
   * @property checkColumns
   * @type {Array|Boolean}
   * @required
   */
  checkColumn: {
    component: 'components/md-models-table/components/check',
    useFilter: false,
    mayBeHidden: false,
    componentForSortCell: 'components/md-models-table/components/check-all',
    className: 'text-center'
  },

  columns: computed('dataColumns', 'checkColumn', function() {
    let chk = get(this, 'checkColumn');

    if(chk) {
      return [chk].concat(get(this, 'dataColumns'));
    }

    return get(this, 'dataColumns');
  }),

  filteringIgnoreCase: true,
  //rowTemplate: 'components/control/md-select-table/row',

  multipleSelect: true,

  /**
   * Callback on row selection.
   *
   * @method select
   * @param {Object} rec Selected record.
   * @param {Number} index Selected row index.
   * @param {Array} selected Selected records.
   * @return {Array} Selected records.
   */
  select(rec, index, selected) {
    return selected;
  },

  actions: {
    clickOnRow(idx, rec) {
      this._super(...arguments);

      let sel = get(this, '_selectedItems');

      rec.toggleProperty('_selected');
      this.get('select')(rec, idx, sel);
    },

    toggleAllSelection() {
      this._super(...arguments);

      let selected = get(this, '_selectedItems');
      let data = get(this, 'data');

      if(get(selected, 'length')) {
        selected.setEach('_selected', true);
        return;
      }

      data.setEach('_selected', false);

      this.get('select')(null, null, selected);
    }
  }
});
