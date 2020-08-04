import { module, test } from 'qunit';
import RSVP from 'rsvp';
import { later } from '@ember/runloop';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import {
  typeInSearch,
  clickTrigger
} from 'ember-power-select/test-support/helpers';

module('Integration | Component | input/md-select-epsg', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    this.options = [{
      codeName: '6326: WGS 84',
      codeId: '6326',
      tooltip: 'World Geodetic System 1984'
    }]

    await render(hbs `{{input/md-select-epsg objectArray=options}}`);

    //await this.pauseTest();
    debugger;
    assert.equal(this.element.textContent.trim(),
      'Select a code or type to search the EPSG database.');

    await clickTrigger();

    assert.dom('.ember-power-select-option').exists({
        count: this.options
          .length
      },
      'There is as many options in the markup as in the supplied array'
    );
    assert.dom('.ember-power-select-option:nth-child(1)').hasText(this
      .options[0].codeName + ' ?');

    // Template block usage:
    //
    await render(hbs `
      {{#input/md-select-epsg objectArray=options}}
      {{/input/md-select-epsg}}
    `);

    assert.equal(this.element.textContent.trim(),
      'Select a code or type to search the EPSG database.');
  });

  test('search EPSG', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    this.options = [{
      codeName: '6326: WGS 84',
      codeId: '6326',
      tooltip: 'World Geodetic System 1984'
    }]

    let data = {
      results: [{
        "code": "4326",
        "kind": "CRS-GEOGCRS",
        "wkt": "GEOGCS[\"WGS 84\",DATUM[\"WGS_1984\",SPHEROID[\"WGS 84\",6378137,298.257223563,AUTHORITY[\"EPSG\",\"7030\"]],AUTHORITY[\"EPSG\",\"6326\"]],PRIMEM[\"Greenwich\",0,AUTHORITY[\"EPSG\",\"8901\"]],UNIT[\"degree\",0.0174532925199433,AUTHORITY[\"EPSG\",\"9122\"]],AUTHORITY[\"EPSG\",\"4326\"]]",
        "unit": "degree (supplier to define representation)",
        "proj4": "+proj=longlat +datum=WGS84 +no_defs",
        "name": "WGS 84",
        "area": "World."
      }, {
        "code": "6400",
        "kind": "CRS-GEOGCRS",
        "wkt": "GEOGCS[\"WGS 84\",DATUM[\"WGS_1984\",SPHEROID[\"WGS 84\",6378137,298.257223563,AUTHORITY[\"EPSG\",\"7030\"]],AUTHORITY[\"EPSG\",\"6326\"]],PRIMEM[\"Greenwich\",0,AUTHORITY[\"EPSG\",\"8901\"]],UNIT[\"degree\",0.0174532925199433,AUTHORITY[\"EPSG\",\"9122\"]],AUTHORITY[\"EPSG\",\"4326\"]]",
        "unit": "degree (supplier to define representation)",
        "proj4": "+proj=longlat +datum=WGS84 +no_defs",
        "name": "Foo Bar",
        "area": "Mars."
      }]
    };

    this.ajax = {
      request: (url) => {
        assert.equal(url, 'https://epsg.io/?q=o kind:CRS&format=json',
          'perform search');

        return new RSVP.Promise(function (resolve) {
          resolve(data);
        });
      }
    };
    await render(hbs `{{input/md-select-epsg
      objectArray=options
      ajax=ajax
      kind="CRS"
    }}`);

    assert.equal(this.element.textContent.trim(),
      'Select a code or type to search the EPSG database.');

    await clickTrigger();
    await typeInSearch('o');

    assert.dom('.ember-power-select-option').exists({ count: 2 },
      'The dropdown is opened and results shown after search'
    );
    assert.dom('.ember-power-select-option:nth-child(1)').hasText(
      `${data.results[0].code}: ${data.results[0].name} ?`);
    assert.dom('.ember-power-select-option:nth-child(2)').hasText(
      `${data.results[1].code}: ${data.results[1].name} ?`);
  });
});
