import {
  find,
  findAll,
  render,
  triggerEvent,
  click
} from '@ember/test-helpers';
import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import {
  clickTrigger,
  typeInSearch
} from 'ember-power-select/test-support/helpers';
import {
  assertTooltipVisible,
  assertTooltipContent
} from 'ember-tooltips/test-support';
import { formatContent } from 'mdeditor/tests/helpers/md-helpers';

module('Integration | Component | input/md-select', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +
    this.set('objArray', [EmberObject.create({
      id: 1,
      name: 'foo',
      tip: 'bar'
    })]);

    await render(hbs `
      {{input/md-select
        value=1
        objectArray=objArray
        valuePath="id"
        namePath="name"
        tooltipPath="tip"
        infotip=true
        label="FooBar"
        placeholder="Select one"}}
    `);

    assert.equal(find('.md-select').textContent
      .replace(/[ \n]+/g, '|'), '|FooBar|foo|', 'renders ok');

    await triggerEvent('.md-infotip', 'mouseenter');

    assertTooltipVisible(assert);
    assertTooltipContent(assert, {
      contentString: 'Select one',
    });
  });

  test('set value', async function (assert) {
    assert.expect(3);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +
    this.set('objArray', [EmberObject.create({
      id: 1,
      name: 'foo',
      tip: 'bar'
    }), EmberObject.create({
      id: 2,
      name: 'baz',
      tip: 'biz'
    })]);

    this.set('value', 1);

    await render(hbs `
      {{input/md-select
        value=value
        objectArray=objArray
        valuePath="id"
        namePath="name"}}
    `);

    assert.equal(find('.md-select').textContent
      .replace(/[ \n]+/g, '|'), '|foo|', 'value set');

    await clickTrigger();
    await click('.ember-power-select-option:nth-child(2)');

    assert.equal(find('.md-select').textContent
      .replace(/[ \n]+/g, '|'), '|baz|', 'display value updates');

    assert.equal(this.get('value'), 2, 'value is updated');
  });

  test('create option', async function (assert) {
    assert.expect(7);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +
    this.set('objArray', [EmberObject.create({
      id: 1,
      name: 'foo',
      tip: 'bar'
    }), EmberObject.create({
      id: 2,
      name: 'baz',
      tip: 'biz'
    })]);

    this.set('externalAction', (type) => {
      assert.ok(type, `search action: ${type}`);

      return [EmberObject.create({
        codeId: 3,
        codeName: 'buzz',
        tooltip: 'boo'
      })]
    });

    this.set('changeAction', (item, api, comp) => {
      if(comp.codelist.findBy("codeId", item.codeId) === undefined) {
        comp.codelist.pushObject(item);
      }

      assert.ok(item, `value changed action`);
    });
    this.set('value', 1);

    await render(hbs `
      {{input/md-select
        value=value
        create=true
        objectArray=objArray
        valuePath="id"
        namePath="name"}}
    `);

    assert.equal(formatContent(find('.md-select')),
      '|foo|', 'value set');

    await clickTrigger();
    await typeInSearch('biz');
    await click('.ember-power-select-option:nth-child(1)');

    assert.equal(formatContent(find('.md-select')),
      '|biz|', 'display value updates');

    assert.equal(this.get('value'), 'biz', 'value is updated to biz');

    await render(hbs `
      {{input/md-select
        value=value
        create=false
        objectArray=objArray
        valuePath="id"
        search=this.externalAction
        change=this.changeAction
        namePath="name"}}
    `);

    await clickTrigger();
    await typeInSearch('bye');
    await click('.ember-power-select-option:nth-child(1)');

    assert.equal(formatContent(find('.md-select')),
      '|buzz|', 'display value updates');

    assert.equal(this.get('value'), 3, 'value is updated to 3');
  });
});
