import { render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { parseInput, formatContent } from 'mdeditor/tests/helpers/md-helpers';

module('Integration | Component | object/md online resource', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    this.model = {
      "name": "name",
      "uri": "http://URI.example.com",
      "protocol": "protocol",
      "description": "description",
      "function": "download",
      "applicationProfile": "applicationProfile",
      "protocolRequest": "protocolRequest"
    };

    let input = Object.values(this.model).join('|');

    await render(
      hbs `{{object/md-online-resource model=model profilePath="foobar"}}`
    );

    assert.equal(formatContent(this.element)
      .trim(),
      '|Name|URI|Protocol|Description|Function|download|?|×|Application|Profile|applicationProfile|×|Protocol|Request|'
    );

    assert.equal(parseInput(this.element), input, 'input renders');

    // Template block usage:
    await render(hbs `
      {{#object/md-online-resource profilePath="foobar" model=model}}
        template block text
      {{/object/md-online-resource}}
    `);

    assert.equal(formatContent(this.element)
      .trim(),
      '|Name|URI|Protocol|Description|Function|download|?|×|Application|Profile|applicationProfile|×|Protocol|Request|template|block|text|',
      'block');
  });
});
