import Component from '@ember/component';
import {
  inject as service
} from '@ember/service';
import {
  computed,
  set,
  get,
  getWithDefault
} from '@ember/object';
import {
  or
} from '@ember/object/computed';
import {
  isArray,
  A
} from '@ember/array';
import {
  later
} from '@ember/runloop';
import {
  assert
} from '@ember/debug';
import moment from 'moment';
import {
  formatCitation
} from '../../object/md-citation/component';

export default Component.extend({
  init() {
    this._super(...arguments);

    this.selected = [];
    assert('No taxonomy object supplied', this.get('taxonomy'));
  },
  tagName: 'form',
  // classNames: ['form-horizontal'],
  itis: service(),
  flashMessages: service(),
  searchString: null,
  kingdom: null,
  total: null,
  isLoading: false,
  limit: 25,
  resultTitle: computed('limit', 'total', 'searchResult.[]', function () {
    let total = this.get('total');
    let result = this.get('searchResult.length');
    let limit = this.get('limit');

    return total <= limit ? result : `${result} of ${total}`;
  }),
  notFound: computed('searchResult', function () {
    let result = this.get('searchResult');

    return isArray(result) && result.length === 0;
  }),
  found: or('selected.length', 'searchResult.length'),
  submit() {
    let itis = this.get('itis');

    this.set('isLoading', true);
    this.set('searchResult', null);

    itis.sendQuery(this.get('searchString'), this.get(
      'kingdom'), this.get('limit')).then(response => {

      if(!response) {
        return;
      }

      let docs = response.response.docs;
      let data = docs.map(doc => itis.parseDoc(doc));

      this.set('searchResult', data);
      this.set('total', response.response.numFound);
      this.set('isLoading', false);
    });
  },
  actions: {
    search() {
      this.get('submit').call(this);
    },
    selectItem(item) {
      item.set('animate', true);
      item.set('selected', true);
      later(this, function () {
        this.get('searchResult').removeObject(item);
        this.get('selected').pushObject(item);
      }, 250);
    },
    deselectItem(item) {
      item.set('selected', false);
      later(this, function () {
        this.get('selected').removeObject(item);
        this.get('searchResult').pushObject(item);
      }, 250);
    },
    importTaxa(taxa) {
      let taxonomy = this.get('taxonomy');
      let itisCitation = this.get('itis.citation');

      let classification = set(taxonomy, 'taxonomicClassification', getWithDefault(taxonomy,
        'taxonomicClassification', []));
      let systems= set(taxonomy, 'taxonomicSystem', getWithDefault(taxonomy,
        'taxonomicSystem', [{citation:{}}]));
      let system = systems.findBy('citation.title', get(itisCitation,'title'));

      let allTaxa = taxa.reduce((acc, itm) => acc.pushObjects(itm.taxonomy), []);
      let today = moment().format('YYYY-MM-DD');
      let dateObj = {
        date: today,
        dateType: 'transmitted',
        description: 'Taxa imported from ITIS'
      };

      allTaxa.forEach(itm => this.get('itis').mergeTaxa(itm, classification));

      if(!system) {
        itisCitation.get('date').pushObject(dateObj);
        systems.pushObject({
          citation: itisCitation
        });
      } else {
        let citation = set(system, 'citation', getWithDefault(system,'citation', {}));
        formatCitation(citation);

        let date = A(get(citation, 'date'));

        if(!date.findBy('date', today)) {
          date.pushObject(dateObj);
        }
      }

      this.get('flashMessages')
        .success(
          `Successfully imported ${ allTaxa.length } taxa from ITIS.`
        );
    }
  }
});