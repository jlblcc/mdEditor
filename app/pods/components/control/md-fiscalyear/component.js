import Ember from 'ember';
import Select from 'mdeditor/pods/components/input/md-select/component';
import layout from 'mdeditor/pods/components/input/md-select/template';
import moment from 'moment';
import {
  inject as service
} from '@ember/service';

const {
  computed
} = Ember;

export default Select.extend({
  layout,
  settings: service('settings'),
  classNames: ['md-fiscalyear'],
  objectArray: computed(function () {
    return Array.apply(0, Array(12)).map(function (element, index) {
      return {
        year: index + (moment().year() - 10)
      };
    });
  }),
  label: 'Pick Fiscal Year',
  valuePath: 'year',
  namePath: 'year',
  tooltip: false,
  searchEnabled: true,
  placeholder: 'Pick a Fiscal Year',
  create: true,
  change() {
    let val = this.get('value');
    let month = parseInt(this.get(
      'settings.data.fiscalStartMonth'), 10) - 1;
    let dt = month <= 6 ? moment(val, 'YYYY') : moment(val, 'YYYY').subtract(1, 'year');
    let start = dt.month(month).startOf('month');
    //let end = moment(val, 'YYYY').month('September').endOf('month');
    let end = start.clone().add(11, 'months').endOf('month');
    let context = this.get('context');

    this.setProperties({
      end: end,
      start: start
    });

    //have to set values using datetimepicker
    context.$('.start .date')
      .data("DateTimePicker")
      .date(start);
    context.$('.end .date')
      .data("DateTimePicker")
      .date(end);

    this.set('value', null);
  }
});
