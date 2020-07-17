import { find, render, triggerEvent } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import {
  assertTooltipVisible,
  assertTooltipContent
} from 'ember-tooltips/test-support';

module('Integration | Component | input/md-textarea', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

    await render(hbs `<form>
      {{input/md-textarea
      value="Foo bar baz"
      label="FooBar"
      placeholder="Enter FooBar"
      required=true
      infotip=true
      rows=10}}</form>
      `);

    assert.equal(find('textarea').value, 'Foo bar baz');
    assert.equal(find('label').textContent, 'FooBar',
      'label renders');
    assert.dom('.required > label').hasPseudoElementStyle(
    ':after', { 'font-family': 'FontAwesome' });

    await triggerEvent('.md-infotip', 'mouseenter');

    assertTooltipVisible(assert);
    assertTooltipContent(assert, {
      contentString: 'Enter FooBar',
    });

    // Template block usage:" + EOL +
    await render(hbs `
      {{#input/md-textarea class="testme"}}
        template block text
      {{/input/md-textarea}}
    `);

    assert.equal(find('.testme').textContent
      .trim(), 'template block text', 'block renders');
  });
});
