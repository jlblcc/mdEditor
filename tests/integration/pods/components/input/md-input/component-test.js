import { find, render, triggerEvent } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import {
  assertTooltipVisible,
  assertTooltipContent
} from 'ember-tooltips/test-support';

module('Integration | Component | input/md-input', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

    await render(hbs `
      {{input/md-input
        label="Foo"
        value="Bar"
        maxlength=100
        required=true
        inputClass="test"
        infotip=true
        placeholder="Enter FooBar"}}
    `);

    assert.equal(find('label').textContent, 'Foo', 'labeled OK');

    const input = find('input');
    const props = [
      input.required,
      input.maxLength,
      input.value,
      input.placeholder
    ];

    assert.deepEqual(props, [true, 100, 'Bar', 'Enter FooBar'],
      'properties set OK');
    assert.dom(input).hasClass('test');

    await triggerEvent('.md-infotip', 'mouseenter');

    assertTooltipVisible(assert);
    assertTooltipContent(assert, {
      contentString: 'Enter FooBar',
    });

    // Template block usage:" + EOL +
    await render(hbs `
      {{#input/md-input}}
        <p class="help-block">help text</p>
      {{/input/md-input}}
    `);

    assert.equal(find('.help-block').textContent, 'help text', 'block renders');
  });
});
