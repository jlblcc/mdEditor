import Route from '@ember/routing/route';
import { isEmpty } from '@ember/utils';
import { isArray } from '@ember/array';
import { computed } from '@ember/object';

export default Route.extend({
  model(params) {
    this.set('srsId', params.srs_id);

    return this.setupModel();
  },
  breadCrumb: computed('srsId', function () {
    return {
      title: 'SRS ' + this.srsId,
      linkable: true
    };
  }),
  setupController: function () {
    // Call _super for default behavior
    this._super(...arguments);

    this.controller.set('parentModel', this.modelFor('record.show.edit'));
    this.controller.set('srsId', this.srsId);
    this.controllerFor('record.show.edit')
      .setProperties({
        onCancel: this.setupModel,
        cancelScope: this
      });
  },

  setupModel() {
    let srsId = this.srsId;
    let model = this.modelFor('record.show.edit');
    let srsArray = model.get(
      'json.metadata.resourceInfo.spatialReferenceSystem');
    let srs = srsId && isArray(srsArray) ? srsArray.get(
      srsId) : undefined;

    //make sure the srs exists
    if(isEmpty(srs)) {
      this.flashMessages
        .warning('No Spatial Reference System found! Re-directing...');
      this.replaceWith('record.show.edit.spatial');

      return;
    }

    return srs;
  },
  actions: {
    parentModel() {
      return this.modelFor('record.show.edit');
    }
  }
});
