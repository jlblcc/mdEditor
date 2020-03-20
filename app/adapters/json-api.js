import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { alias } from '@ember/object/computed';
import { v4 } from 'uuid';
import { inject as service } from '@ember/service';
import { assign } from '@ember/polyfills';
import { A } from '@ember/array';
import { singularize } from 'ember-inflector';
import { all } from 'rsvp';

export default JSONAPIAdapter.extend({
  host: alias('settings.data.jsonApiUrl'),
  flashMessages: service(),
  settings: service(),

  init() {
    this._super(...arguments);

    // this.set('headers', {
    //   'Content-Type': 'application/vnd.api+json',
    // });
  },
  generateIdForRecord( /*store, type, inputProperties*/ ) {
    return v4();
  },

  // isInvalid(status, headers, payload) {
  //   console.log(...arguments);
  //
  //   if(payload.errors) {
  //     let error = payload.errors.firstObject;
  //
  //     this.flashMessages.danger(
  //       `${error.title}::${error.detail}(${error.code}, ${error.status}).`
  //     );
  //   }
  //
  //   this._super(...arguments);
  // },

  serialize(snapshot, options) {
    let json = snapshot.serialize(options);

    return json;
  },

  importData(content, options) {
    // merge defaults
    options = assign({
      json: true,
      truncate: true
    }, options || {});

    // let truncateTypes = A();
    let promises = A();

    content = options.json ? JSON.parse(content) : content;

    // if(options.truncate) {
    //   content.data.forEach((record) => {
    //     truncateTypes.addObject(record.type);
    //   });
    //
    //   truncateTypes.map((type) => {
    //     this.store.peekAll(type).forEach((rec) => {
    //       promises.pushObject(rec.destroyRecord().then(() => this
    //         .store.unloadRecord(rec)));
    //     });
    //   });
    // }

    let fixed = {
      data: content.data.map(c => {
        let js = c.attributes.json;

        if(typeof js === 'string') {
          c.attributes.json = JSON.parse(js);
        }

        c.type = singularize(c.type);
        //not supported in demo mdjsonapi service
        c.relationships = undefined;
        return c;
      })
    };
    //let records = this.store.push(fixed);
    let records = fixed.data.map(d => {
      let rec = this.store.peekRecord(d.type, d.id) || this.store
        .createRecord(d.type, { id: d.id });

      rec.setProperties(d.attributes);
      return rec;
    });

    promises.concat(records.map((rec) => {
      return rec.save().catch((err) => {
        // Error callback
        if(err) {
          let e = err.errors.firstObject;

          this.flashMessages.danger(
            `${e.detail}(Code:${e.code}, Status:${e.status}).`, {
              title: e.title
            });
        }
      });
    }));

    return all(promises)
      .then(function () {
        // reload from store
        console.log(content.data.length);
      });
  }
});
