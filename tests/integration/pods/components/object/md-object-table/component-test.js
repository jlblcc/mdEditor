import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, waitFor } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { formatContent } from 'mdeditor/tests/helpers/md-helpers';

module('Integration | Component | object/md-object-table', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });
    this.model = [{
      biz: 'biz0',
      baz: 'baz0'
    }, {
      biz: 'biz1',
      baz: 'baz1'
    }];

    await render(
      hbs `{{object/md-object-table header="Foo Bars" attributes="biz,baz"}}`
    );

    assert.equal(formatContent(this.element),
      '|No|Foo|Bars|found.|Add|Foo|Bar|');

    // Template block usage:
    await render(hbs `
      {{#object/md-object-table
       items=model
       header="FooBar"
       buttonText="Add FooBar"
       ellipsis=true
       profilePath="foobar"
       attributes="biz,baz" as |foo|
      }}
        <span>Biz:{{foo.biz}}</span>
        <span>Baz:{{foo.baz}}</span>
      {{/object/md-object-table}}
    `);

    assert.equal(formatContent(this.element),
      '|FooBar|2|Add|OK|#|Biz|Baz|0|biz0|baz0|Edit|Delete|1|biz1|baz1|Edit|Delete|',
      'block');

    await render(hbs `
      {{#object/md-object-table
       items=model
       header="Foo Bars Custom"
       attributes="biz:Yim Yam,?baz:Boolean Info"
       buttonText="Add FooBar"
       ellipsis=true
       profilePath="foobar" as |foo|
      }}
        <span>Biz:{{foo.biz}}</span>
        <span>Baz:{{foo.baz}}</span>
      {{/object/md-object-table}}
    `);

    assert.equal(formatContent(this.element),
      '|Foo|Bars|Custom|2|Add|OK|#|Yim|Yam|Boolean|Info|0|biz0|true|Edit|Delete|1|biz1|true|Edit|Delete|',
      'custom headers');

    this.set('model.firstObject.baz', null);

    //await this.pauseTest();
    //debugger;
    assert.equal(formatContent(this.element.querySelector(
        '.md-object-table tbody tr:nth-of-type(1)')),
      '|0|biz0|Not|Defined|Edit|Delete|',
      'render null boolean column');
  });

  test('actions', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });
    this.model = [{
      biz: 'biz0',
      baz: 'baz0'
    }, {
      biz: 'biz1',
      baz: 'baz1'
    }];

    // Template block usage:
    await render(hbs `
      {{#object/md-object-table
       items=model
       header="FooBar"
       buttonText="Add FooBar"
       ellipsis=true
       profilePath="foobar"
       attributes="biz,baz" as |foo|
      }}
        <span>Biz:{{foo.biz}}</span>
        <span>Baz:{{foo.baz}}</span>
      {{/object/md-object-table}}
    `);

    //debugger;
    assert.equal(this.element.querySelectorAll(
      '.md-object-table tbody tr').length, 2, 'renders rows');

    await click('tr:nth-of-type(1) .btn-success');
    await waitFor('.object-editor', { timeout: 2000 });

    assert.equal(formatContent(this.element.querySelector(
        '.object-editor')),
      '|Biz:biz0|Baz:baz0|OK|', 'show object');

    await click('.object-editor .btn-info');
    await click('.md-object-table .btn-danger');
    await click('.md-object-table .btn-danger');

    assert.equal(this.element.querySelectorAll(
      '.md-object-table tbody tr').length, 1, 'delete row');

  });
});
