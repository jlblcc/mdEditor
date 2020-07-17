import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, triggerEvent } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import {
  assertTooltipVisible,
  assertTooltipContent
} from 'ember-tooltips/test-support';

module('Integration | Component | control/md-infotip', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });
    const { element } = this;

    await render(hbs `{{control/md-infotip text="FooBar"}}`);

    await triggerEvent('.md-infotip', 'mouseenter');
    assertTooltipVisible(assert);
    assertTooltipContent(assert, {
      contentString: 'FooBar',
    });

    // Template block usage:
    await render(hbs `
      {{#control/md-infotip}}
        template block text
      {{/control/md-infotip}}
    `);

    assert.equal(element.textContent.trim(), 'template block text');
  });
});
