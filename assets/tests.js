'use strict';

define('mdeditor/tests/acceptance/pods/components/layout/md-breadcrumb-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Acceptance | pods/components/md breadcrumb', function (hooks) {
    (0, _emberQunit.setupApplicationTest)(hooks);

    (0, _qunit.test)('visiting /record/new', async function (assert) {
      assert.expect(5);

      await visit('/record/new');

      assert.ok(currentURL().match(/record\/new\/[a-z0-9]+/));

      const listItems = find('ol.breadcrumb li').text();
      const linkItems = find('ol.breadcrumb li a').text();

      const hasRecordInallList = listItems.indexOf('Record') >= 0;
      const hasNewTextInallList = listItems.indexOf('New') >= 0;

      const doesNotHaveRecordInLinkList = linkItems.indexOf('Record') === -1;
      const doesNotHaveNewInLinkList = linkItems.indexOf('New') === -1;

      assert.ok(hasRecordInallList, 'renders the right inferred name');
      assert.ok(hasNewTextInallList, 'renders the right inferred name');
      assert.ok(doesNotHaveRecordInLinkList, 'renders the right inferred name');
      assert.ok(doesNotHaveNewInLinkList, 'renders the right inferred name');
    });
  });
});
define('mdeditor/tests/acceptance/pods/contact/new-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Acceptance | pods/contact/new', function (hooks) {
    (0, _emberQunit.setupApplicationTest)(hooks);

    (0, _qunit.test)('visiting /pods/contact/new', async function (assert) {
      await visit('/contact/new');
      assert.ok(currentURL().match(/contact\/new\/[a-z0-9]+/));
    });

    (0, _qunit.test)('test new contact initial page conditions', async function (assert) {
      assert.expect(5);
      await visit('/contact/new');
      assert.equal(find('input:eq(0)').val(), 'on');
      assert.equal(find('input:eq(1)').val().length, 36);
      assert.equal(find('input:eq(2)').val(), "");
      assert.equal(find('input:eq(3)').val(), "");
      assert.equal(find('button.md-form-save').prop('disabled'), true);
    });

    (0, _qunit.test)('test new contact individual', async function (assert) {
      assert.expect(2);
      await visit('/contact/new');
      await fillIn('input:eq(2)', 'Individual Name');
      await fillIn('input:eq(3)', '');
      assert.equal(find('input:eq(2)').val(), 'Individual Name');
      assert.equal(find('button.md-form-save').prop('disabled'), false);
    });

    (0, _qunit.test)('test new contact organization', async function (assert) {
      assert.expect(2);
      await visit('/contact/new');
      click('input:eq(0)').then(async function () {
        await fillIn('input:eq(2)', 'Organization Name');
        await fillIn('input:eq(1)', '1234');
        await fillIn('input:eq(3)', '');
        assert.equal(find('input:eq(2)').val(), "Organization Name");
        assert.equal(find('button.md-form-save').prop('disabled'), false);
      });
    });

    (0, _qunit.test)('test new contact missing contact ID', async function (assert) {
      assert.expect(1);
      await visit('/contact/new');
      await fillIn('input:eq(1)', '');
      await fillIn('input:eq(2)', 'Individual Name');
      assert.equal(find('button.md-form-save').prop('disabled'), true);
    });
  });
});
define('mdeditor/tests/acceptance/pods/contacts/contacts-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Acceptance | pods/contacts', function (hooks) {
    (0, _emberQunit.setupApplicationTest)(hooks);

    (0, _qunit.test)('visiting /contacts', async function (assert) {
      await visit('/contacts');

      assert.equal(currentURL(), '/contacts');
    });

    (0, _qunit.test)('delete should display a confirm', async function (assert) {
      assert.expect(4);

      var store = this.application.__container__.lookup('service:store');

      //make sure there's at least one record visible
      Ember.run(function () {
        store.createRecord('contact');
      });

      await visit('/contacts');

      assert.dialogOpensAndCloses({
        openSelector: 'button.md-button-modal.btn-danger:first',
        closeSelector: '.ember-modal-overlay',
        //closeSelector: '.md-modal-container button.btn-primary',
        hasOverlay: true,
        context: 'html'
      });
    });
  });
});
define('mdeditor/tests/acceptance/pods/dictionary/new-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  /* global selectChoose*/
  (0, _qunit.module)('Acceptance | pods/dictionary/new', function (hooks) {
    (0, _emberQunit.setupApplicationTest)(hooks);

    (0, _qunit.test)('visiting /pods/dictionary/new', async function (assert) {
      await visit('/dictionary/new');
      assert.ok(currentURL().match(/dictionary\/new\/[a-z0-9]+/));
    });

    (0, _qunit.test)('test new dictionary initial page conditions', async function (assert) {
      assert.expect(4);
      await visit('/dictionary/new');
      assert.equal(find('input:eq(0)').val(), "");
      assert.equal(find('ember-power-select-selected-item .select-value').text(), "");
      assert.equal(find('button.md-form-save').prop('disabled'), true);
      assert.equal(find('div.md-form-alert').length, 2);
    });

    (0, _qunit.test)('test new dictionary completed form', async function (assert) {
      assert.expect(4);
      await visit('/dictionary/new');
      await fillIn('input:eq(0)', 'Dictionary Name');
      selectChoose('div.md-form-select .md-select', 'aggregate');
      assert.equal(find('input:eq(0)').val(), "Dictionary Name");
      assert.equal(find('div.md-form-select .ember-power-select-selected-item .select-value').text().trim(), "aggregate");
      assert.equal(find('button.md-form-save').prop('disabled'), false);
      assert.equal(find('div.md-form-alert').length, 0);
    });

    (0, _qunit.test)('test new dictionary missing dictionary name', async function (assert) {
      assert.expect(2);
      await visit('/dictionary/new');
      //fillIn('div.md-form-select select', 'aggregate');
      selectChoose('div.md-form-select .md-select', 'aggregate');
      assert.equal(find('button.md-form-save').prop('disabled'), true);
      assert.equal(find('div.md-form-alert').length, 1);
    });

    (0, _qunit.test)('test new dictionary missing data resource type', async function (assert) {
      assert.expect(2);
      await visit('/dictionary/new');
      await fillIn('input:eq(0)', 'Dictionary Name');
      assert.equal(find('button.md-form-save').prop('disabled'), true);
      assert.equal(find('div.md-form-alert').length, 1);
    });
  });
});
define('mdeditor/tests/acceptance/pods/record/new-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  /* global selectChoose*/
  (0, _qunit.module)('Acceptance | pods/record/new', function (hooks) {
    (0, _emberQunit.setupApplicationTest)(hooks);

    (0, _qunit.test)('visiting /pods/record/new', async function (assert) {
      await visit('/record/new');
      assert.ok(currentURL().match(/record\/new\/[a-z0-9]+/));
    });

    (0, _qunit.test)('test new mdJSON record initial page conditions', async function (assert) {
      assert.expect(4);
      await visit('/record/new');
      assert.ok(find('input:eq(0)').val());
      assert.equal(find('input:eq(1)').val(), '');
      assert.equal(find('ember-power-select-selected-item .select-value').text(), "");
      assert.equal(find('button.md-form-save').prop('disabled'), true);
    });

    (0, _qunit.test)('test new mdJSON record completed form', async function (assert) {
      assert.expect(3);
      await visit('/record/new');
      await fillIn('input:eq(1)', 'Record Title');
      selectChoose('.md-select', 'attribute');
      assert.equal(find('input:eq(1)').val(), "Record Title");
      assert.equal(find('div.md-select .ember-power-select-selected-item .select-value').text().trim(), "attribute");
      assert.equal(find('button.md-form-save').prop('disabled'), false);
    });

    (0, _qunit.test)('test new mdJSON record missing record title', async function (assert) {
      assert.expect(1);
      await visit('/record/new');
      selectChoose('.md-select', 'attribute');
      assert.equal(find('button.md-form-save').prop('disabled'), true);
    });

    (0, _qunit.test)('test new mdJSON record missing data record type (scope)', async function (assert) {
      assert.expect(2);
      await visit('/record/new');
      await fillIn('input:eq(1)', 'Record Title');
      assert.equal(find('button.md-form-save').prop('disabled'), true);
      assert.equal(find('.md-error').length, 1);
    });
  });
});
define('mdeditor/tests/app.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | app');

  QUnit.test('adapters/application.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'adapters/application.js should pass ESLint\n\n');
  });

  QUnit.test('app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass ESLint\n\n');
  });

  QUnit.test('formats.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'formats.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/add-em.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/add-em.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/bbox-to-poly.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/bbox-to-poly.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/get-dash.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/get-dash.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/get-property.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/get-property.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/md-markdown.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/md-markdown.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/mod.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/mod.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/present.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/present.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/uc-words.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/uc-words.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/word-limit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/word-limit.js should pass ESLint\n\n');
  });

  QUnit.test('initializers/leaflet.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'initializers/leaflet.js should pass ESLint\n\n');
  });

  QUnit.test('initializers/local-storage-export.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'initializers/local-storage-export.js should pass ESLint\n\n');
  });

  QUnit.test('instance-initializers/profile.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'instance-initializers/profile.js should pass ESLint\n\n');
  });

  QUnit.test('instance-initializers/route-publish.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'instance-initializers/route-publish.js should pass ESLint\n\n');
  });

  QUnit.test('instance-initializers/settings.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'instance-initializers/settings.js should pass ESLint\n\n');
  });

  QUnit.test('mixins/hash-poll.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mixins/hash-poll.js should pass ESLint\n\n');
  });

  QUnit.test('mixins/object-template.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mixins/object-template.js should pass ESLint\n\n');
  });

  QUnit.test('mixins/scroll-to.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'mixins/scroll-to.js should pass ESLint\n\n');
  });

  QUnit.test('models/base.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/base.js should pass ESLint\n\n46:18 - Don\'t use observers if possible (ember/no-observers)\n54:20 - Don\'t use observers if possible (ember/no-observers)');
  });

  QUnit.test('models/contact.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/contact.js should pass ESLint\n\n');
  });

  QUnit.test('models/dictionary.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/dictionary.js should pass ESLint\n\n');
  });

  QUnit.test('models/record.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/record.js should pass ESLint\n\n');
  });

  QUnit.test('models/setting.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/setting.js should pass ESLint\n\n71:19 - Don\'t use observers if possible (ember/no-observers)');
  });

  QUnit.test('pods/components/control/md-button-confirm/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/control/md-button-confirm/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/control/md-button-modal/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/control/md-button-modal/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/control/md-contact-link/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/control/md-contact-link/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/control/md-contact-title/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/control/md-contact-title/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/control/md-crud-buttons/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/control/md-crud-buttons/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/control/md-definition/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/control/md-definition/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/control/md-errors/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/control/md-errors/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/control/md-fiscalyear/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/control/md-fiscalyear/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/control/md-import-csv/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/control/md-import-csv/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/control/md-itis/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/control/md-itis/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/control/md-json-button/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/control/md-json-button/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/control/md-json-viewer/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/control/md-json-viewer/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/control/md-modal/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/control/md-modal/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/control/md-record-table/buttons/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/control/md-record-table/buttons/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/control/md-record-table/buttons/custom/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/control/md-record-table/buttons/custom/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/control/md-record-table/buttons/filter/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/control/md-record-table/buttons/filter/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/control/md-record-table/buttons/show/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/control/md-record-table/buttons/show/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/control/md-record-table/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/control/md-record-table/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/control/md-repo-link/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/control/md-repo-link/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/control/md-scroll-spy/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/control/md-scroll-spy/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/control/md-select-table/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/control/md-select-table/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/control/md-spinner/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/control/md-spinner/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/control/md-spotlight/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/control/md-spotlight/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/control/md-status/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/control/md-status/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/control/subbar-citation/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/control/subbar-citation/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/control/subbar-extent/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/control/subbar-extent/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/control/subbar-importcsv/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/control/subbar-importcsv/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/control/subbar-keywords/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/control/subbar-keywords/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/control/subbar-link/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/control/subbar-link/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/control/subbar-spatial/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/control/subbar-spatial/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/control/subbar-thesaurus/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/control/subbar-thesaurus/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/ember-tooltip/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/ember-tooltip/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/input/md-boolean/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/input/md-boolean/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/input/md-codelist-multi/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/input/md-codelist-multi/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/input/md-codelist/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/input/md-codelist/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/input/md-date-range/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/input/md-date-range/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/input/md-datetime/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/input/md-datetime/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/input/md-input-confirm/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/input/md-input-confirm/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/input/md-input/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/input/md-input/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/input/md-markdown-area/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/input/md-markdown-area/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/input/md-month/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/input/md-month/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/input/md-select-contact/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/input/md-select-contact/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/input/md-select-contacts/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/input/md-select-contacts/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/input/md-select-profile/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/input/md-select-profile/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/input/md-select-thesaurus/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/input/md-select-thesaurus/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/input/md-select/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/input/md-select/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/input/md-textarea/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/input/md-textarea/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/input/md-toggle/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/input/md-toggle/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/layout/md-breadcrumb/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/layout/md-breadcrumb/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/layout/md-card/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/layout/md-card/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/layout/md-footer/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/layout/md-footer/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/layout/md-nav-main/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/layout/md-nav-main/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/layout/md-nav-secondary/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/layout/md-nav-secondary/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/layout/md-nav-sidebar/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/layout/md-nav-sidebar/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/layout/md-slider/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/layout/md-slider/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/layout/md-wrap/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/layout/md-wrap/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/md-help/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/md-help/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/md-models-table/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/md-models-table/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/md-models-table/components/check-all/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/md-models-table/components/check-all/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/md-models-table/components/check/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/md-models-table/components/check/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/md-models-table/themes/bootstrap3.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/md-models-table/themes/bootstrap3.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/md-title/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/md-title/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/md-translate/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/md-translate/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-address/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-address/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-address/md-address-block/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-address/md-address-block/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-allocation/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-allocation/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-array-table/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-array-table/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-associated/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-associated/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-associated/preview/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-associated/preview/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-attribute/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-attribute/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-attribute/preview/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-attribute/preview/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-bbox/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-bbox/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-citation-array/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-citation-array/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-citation/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-citation/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-citation/preview/body/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-citation/preview/body/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-citation/preview/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-citation/preview/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-constraint/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-constraint/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-date-array/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-date-array/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-date/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-date/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-distribution/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-distribution/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-distributor/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-distributor/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-distributor/preview/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-distributor/preview/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-documentation/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-documentation/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-documentation/preview/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-documentation/preview/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-domain/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-domain/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-domainitem/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-domainitem/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-domainitem/preview/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-domainitem/preview/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-entity/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-entity/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-funding/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-funding/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-funding/preview/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-funding/preview/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-graphic-array/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-graphic-array/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-identifier-array/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-identifier-array/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-identifier-object-table/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-identifier-object-table/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-identifier/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-identifier/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-keyword-citation/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-keyword-citation/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-keyword-list/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-keyword-list/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-lineage/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-lineage/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-lineage/preview/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-lineage/preview/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-locale-array/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-locale-array/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-locale/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-locale/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-maintenance/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-maintenance/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-medium/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-medium/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-object-table/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-object-table/component.js should pass ESLint\n\n324:19 - Don\'t use observers if possible (ember/no-observers)');
  });

  QUnit.test('pods/components/object/md-objectroute-table/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-objectroute-table/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-online-resource-array/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-online-resource-array/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-online-resource/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-online-resource/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-party-array/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-party-array/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-party/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-party/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-phone-array/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-phone-array/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-process-step/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-process-step/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-repository-array/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-repository-array/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-resource-type-array/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-resource-type-array/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-simple-array-table/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-simple-array-table/component.js should pass ESLint\n\n73:19 - Don\'t use observers if possible (ember/no-observers)');
  });

  QUnit.test('pods/components/object/md-source/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-source/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-source/preview/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-source/preview/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-spatial-extent/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-spatial-extent/component.js should pass ESLint\n\n35:21 - Don\'t use observers if possible (ember/no-observers)');
  });

  QUnit.test('pods/components/object/md-spatial-info/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-spatial-info/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-spatial-resolution/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-spatial-resolution/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-srs/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-srs/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-taxonomy/classification/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-taxonomy/classification/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-taxonomy/classification/taxon/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-taxonomy/classification/taxon/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-taxonomy/collection/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-taxonomy/collection/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-taxonomy/collection/system/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-taxonomy/collection/system/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-taxonomy/collection/system/preview/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-taxonomy/collection/system/preview/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-taxonomy/collection/voucher/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-taxonomy/collection/voucher/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-taxonomy/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-taxonomy/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-time-period/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-time-period/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/components/object/md-transfer/component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/components/object/md-transfer/component.js should pass ESLint\n\n');
  });

  QUnit.test('pods/contact/new/id/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/contact/new/id/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/contact/new/index/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/contact/new/index/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/contact/new/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/contact/new/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/contact/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/contact/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/contact/show/edit/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/contact/show/edit/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/contact/show/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/contact/show/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/contacts/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/contacts/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/dashboard/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/dashboard/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/dictionaries/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/dictionaries/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/dictionary/new/id/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/dictionary/new/id/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/dictionary/new/index/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/dictionary/new/index/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/dictionary/new/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/dictionary/new/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/dictionary/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/dictionary/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/dictionary/show/edit/citation/identifier/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/dictionary/show/edit/citation/identifier/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/dictionary/show/edit/citation/index/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/dictionary/show/edit/citation/index/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/dictionary/show/edit/citation/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/dictionary/show/edit/citation/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/dictionary/show/edit/domain/edit/citation/identifier/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/dictionary/show/edit/domain/edit/citation/identifier/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/dictionary/show/edit/domain/edit/citation/index/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/dictionary/show/edit/domain/edit/citation/index/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/dictionary/show/edit/domain/edit/citation/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/dictionary/show/edit/domain/edit/citation/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/dictionary/show/edit/domain/edit/index/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/dictionary/show/edit/domain/edit/index/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/dictionary/show/edit/domain/edit/item/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/dictionary/show/edit/domain/edit/item/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/dictionary/show/edit/domain/edit/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/dictionary/show/edit/domain/edit/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/dictionary/show/edit/domain/index/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/dictionary/show/edit/domain/index/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/dictionary/show/edit/domain/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/dictionary/show/edit/domain/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/dictionary/show/edit/entity/edit/attribute/index/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/dictionary/show/edit/entity/edit/attribute/index/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/dictionary/show/edit/entity/edit/attribute/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/dictionary/show/edit/entity/edit/attribute/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/dictionary/show/edit/entity/edit/citation/identifier/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/dictionary/show/edit/entity/edit/citation/identifier/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/dictionary/show/edit/entity/edit/citation/index/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/dictionary/show/edit/entity/edit/citation/index/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/dictionary/show/edit/entity/edit/citation/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/dictionary/show/edit/entity/edit/citation/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/dictionary/show/edit/entity/edit/index/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/dictionary/show/edit/entity/edit/index/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/dictionary/show/edit/entity/edit/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/dictionary/show/edit/entity/edit/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/dictionary/show/edit/entity/import/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/dictionary/show/edit/entity/import/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/dictionary/show/edit/entity/index/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/dictionary/show/edit/entity/index/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/dictionary/show/edit/entity/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/dictionary/show/edit/entity/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/dictionary/show/edit/index/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/dictionary/show/edit/index/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/dictionary/show/edit/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/dictionary/show/edit/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/dictionary/show/index/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/dictionary/show/index/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/dictionary/show/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/dictionary/show/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/error/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/error/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/export/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/export/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/help/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/help/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/import/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/import/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/not-found/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/not-found/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/publish/index/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/publish/index/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/publish/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/publish/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/index/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/index/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/new/id/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/new/id/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/new/index/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/new/index/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/new/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/new/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/associated/index/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/associated/index/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/associated/resource/index/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/associated/resource/index/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/associated/resource/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/associated/resource/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/associated/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/associated/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/constraint/index/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/constraint/index/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/constraint/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/constraint/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/coverages/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/coverages/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/dictionary/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/dictionary/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/distribution/distributor/index/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/distribution/distributor/index/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/distribution/distributor/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/distribution/distributor/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/distribution/index/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/distribution/index/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/distribution/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/distribution/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/documents/citation/index/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/documents/citation/index/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/documents/citation/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/documents/citation/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/documents/index/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/documents/index/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/documents/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/documents/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/extent/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/extent/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/extent/spatial/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/extent/spatial/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/funding/allocation/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/funding/allocation/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/funding/index/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/funding/index/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/funding/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/funding/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/grid/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/grid/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/index/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/index/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/keywords/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/keywords/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/keywords/thesaurus/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/keywords/thesaurus/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/lineage/index/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/lineage/index/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/lineage/lineageobject/citation/identifier/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/lineage/lineageobject/citation/identifier/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/lineage/lineageobject/citation/index/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/lineage/lineageobject/citation/index/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/lineage/lineageobject/citation/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/lineage/lineageobject/citation/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/lineage/lineageobject/index/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/lineage/lineageobject/index/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/lineage/lineageobject/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/lineage/lineageobject/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/lineage/lineageobject/source/index/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/lineage/lineageobject/source/index/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/lineage/lineageobject/source/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/lineage/lineageobject/source/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/lineage/lineageobject/step/citation/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/lineage/lineageobject/step/citation/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/lineage/lineageobject/step/index/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/lineage/lineageobject/step/index/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/lineage/lineageobject/step/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/lineage/lineageobject/step/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/lineage/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/lineage/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/main/citation/identifier/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/main/citation/identifier/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/main/citation/index/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/main/citation/index/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/main/citation/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/main/citation/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/main/index/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/main/index/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/main/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/main/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/metadata/alternate/identifier/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/metadata/alternate/identifier/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/metadata/alternate/index/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/metadata/alternate/index/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/metadata/alternate/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/metadata/alternate/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/metadata/identifier/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/metadata/identifier/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/metadata/index/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/metadata/index/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/metadata/parent/identifier/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/metadata/parent/identifier/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/metadata/parent/index/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/metadata/parent/index/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/metadata/parent/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/metadata/parent/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/metadata/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/metadata/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/spatial/index/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/spatial/index/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/spatial/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/spatial/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/taxonomy/collection/index/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/taxonomy/collection/index/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/taxonomy/collection/itis/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/taxonomy/collection/itis/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/taxonomy/collection/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/taxonomy/collection/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/taxonomy/collection/system/index/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/taxonomy/collection/system/index/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/taxonomy/collection/system/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/taxonomy/collection/system/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/taxonomy/index/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/taxonomy/index/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/edit/taxonomy/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/edit/taxonomy/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/index/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/index/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/record/show/translate/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/record/show/translate/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/records/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/records/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/save/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/save/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/settings/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/settings/route.js should pass ESLint\n\n');
  });

  QUnit.test('pods/translate/route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/translate/route.js should pass ESLint\n\n');
  });

  QUnit.test('resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass ESLint\n\n');
  });

  QUnit.test('router.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass ESLint\n\n');
  });

  QUnit.test('routes/application.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/application.js should pass ESLint\n\n');
  });

  QUnit.test('routes/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/index.js should pass ESLint\n\n');
  });

  QUnit.test('serializers/application.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'serializers/application.js should pass ESLint\n\n');
  });

  QUnit.test('services/cleaner.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'services/cleaner.js should pass ESLint\n\n');
  });

  QUnit.test('services/codelist.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'services/codelist.js should pass ESLint\n\n');
  });

  QUnit.test('services/contacts.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'services/contacts.js should pass ESLint\n\n');
  });

  QUnit.test('services/icon.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'services/icon.js should pass ESLint\n\n');
  });

  QUnit.test('services/itis.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'services/itis.js should pass ESLint\n\n');
  });

  QUnit.test('services/jsonvalidator.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'services/jsonvalidator.js should pass ESLint\n\n');
  });

  QUnit.test('services/keyword.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'services/keyword.js should pass ESLint\n\n');
  });

  QUnit.test('services/mdjson.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'services/mdjson.js should pass ESLint\n\n');
  });

  QUnit.test('services/patch.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'services/patch.js should pass ESLint\n\n');
  });

  QUnit.test('services/profile.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'services/profile.js should pass ESLint\n\n');
  });

  QUnit.test('services/publish.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'services/publish.js should pass ESLint\n\n');
  });

  QUnit.test('services/settings.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'services/settings.js should pass ESLint\n\n');
  });

  QUnit.test('services/slider.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'services/slider.js should pass ESLint\n\n21:18 - Don\'t use observers if possible (ember/no-observers)');
  });

  QUnit.test('services/spotlight.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'services/spotlight.js should pass ESLint\n\n');
  });

  QUnit.test('transforms/json.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'transforms/json.js should pass ESLint\n\n');
  });

  QUnit.test('transitions.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'transitions.js should pass ESLint\n\n');
  });

  QUnit.test('validators/array-required.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'validators/array-required.js should pass ESLint\n\n');
  });

  QUnit.test('validators/array-valid.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'validators/array-valid.js should pass ESLint\n\n');
  });
});
define("mdeditor/tests/helpers/create-contact", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = createContact;
  function createContact(total) {

    const contacts = [];

    for (let i = 0; i < total; i++) {

      const contact = Ember.Object.create({

        json: {
          "contactId": i,
          "organizationName": null,
          "individualName": "Contact" + i,
          "positionName": null,
          "phoneBook": [],
          "address": {},
          "onlineResource": [],
          "contactInstructions": null
        },
        title: 'Contact' + i,
        icon: 'user'
      });

      contacts.push(contact);
    }

    return contacts;
  }
});
define("mdeditor/tests/helpers/create-dictionary", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = createDictionary;
  function createDictionary(total) {

    const dictionaries = [];

    for (let i = 0; i < total; i++) {

      const dictionary = Ember.Object.create({

        json: {
          "dictionaryInfo": {
            "citation": {
              "title": "My Dictionary",
              "date": [{
                "date": new Date().toISOString(),
                "dateType": "creation"
              }]
            },
            "description": "Data dictionary.",
            "resourceType": null
          },
          "domain": [],
          "entity": []
        },
        title: 'My Dictionary' + i,
        icon: 'book'
      });

      dictionaries.push(dictionary);
    }

    return dictionaries;
  }
});
define('mdeditor/tests/helpers/create-map-layer', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = createMapLayer;
  function createMapLayer(total) {

    const layers = {
      type: 'FeatureCollection',
      features: []
    };

    for (let i = 1; i < total + 1; i++) {

      const layer = Ember.Object.create({
        type: 'Feature',
        id: i,
        geometry: {
          type: 'Point',
          coordinates: [-104.99404, 39.75621 + i]
        },
        properties: {
          name: `Feature ` + i
        }
      });

      layers.features.push(layer);
    }

    return layers;
  }
});
define("mdeditor/tests/helpers/create-record", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = createRecord;
  function createRecord(total) {

    const records = [];

    for (let i = 0; i < total; i++) {

      const record = Ember.Object.create({

        json: {
          "version": {
            "name": "mdJson",
            "version": "1.0.0"
          },
          "record": [],
          "metadata": {
            "metadataInfo": {
              "metadataIdentifier": {
                "identifier": 'r' + i,
                "type": "uuid"
              }
            },
            "resourceInfo": {
              "resourceType": null,
              "citation": {
                "title": "My Record" + i,
                "date": [{
                  "date": new Date().toISOString(),
                  "dateType": "creation"
                }]
              },
              "pointOfrecord": [],
              "abstract": null,
              "status": null,
              "language": ["eng; USA"]
            }
          }
        },
        title: 'My Record' + i,
        icon: 'project'
      });

      records.push(record);
    }

    return records;
  }
});
define('mdeditor/tests/helpers/data-transfer', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var c = Ember.Object.extend({
    getData: function getData() {
      return this.get('payload');
    },

    setData: function setData(dataType, payload) {
      this.set("data", { dataType: dataType, payload: payload });
    }
  });

  c.reopenClass({
    makeMockEvent: function makeMockEvent(payload) {
      var transfer = this.create({ payload: payload });
      var res = { dataTransfer: transfer };
      res.preventDefault = function () {
        console.log('prevent default');
      };
      res.stopPropagation = function () {
        console.log('stop propagation');
      };
      return res;
    },

    createDomEvent: function createDomEvent(type) {
      var event = document.createEvent("CustomEvent");
      event.initCustomEvent(type, true, true, null);
      event.dataTransfer = {
        data: {},
        setData: function setData(type, val) {
          this.data[type] = val;
        },
        getData: function getData(type) {
          return this.data[type];
        }
      };
      return event;
    }
  });

  exports.default = c;
});
define('mdeditor/tests/helpers/destroy-app', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = destroyApp;
  function destroyApp(application) {
    var store = application.__container__.lookup('service:store');

    if (store) {
      Ember.run(function () {
        store.unloadAll();
        application.destroy();
      });
    } else {
      Ember.run(application, 'destroy');
    }
  }
});
define('mdeditor/tests/helpers/drag-drop', ['exports', 'ember-native-dom-helpers', 'mdeditor/tests/helpers/mock-event'], function (exports, _emberNativeDomHelpers, _mockEvent) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.drag = drag;


  async function dragOver(dropSelector, moves) {
    moves = moves || [[{ clientX: 1, clientY: 1 }, dropSelector]];
    return moves.forEach(async ([position, selector]) => {
      let event = new _mockEvent.default(position);
      await (0, _emberNativeDomHelpers.triggerEvent)(selector || dropSelector, 'dragover', event);
    });
  }

  async function drop(dragSelector, dragEvent, options) {
    let dropSelector = options.drop,
        dropEndOptions = options.dropEndOptions,
        dragOverMoves = options.dragOverMoves;


    let dropElement = await (0, _emberNativeDomHelpers.find)(dropSelector);
    if (!dropElement) {
      throw `There are no drop targets by the given selector: '${dropSelector}'`;
    }

    await dragOver(dropSelector, dragOverMoves);

    if (options.beforeDrop) {
      await options.beforeDrop.call();
    }

    let event = new _mockEvent.default().useDataTransferData(dragEvent);
    await (0, _emberNativeDomHelpers.triggerEvent)(dropSelector, 'drop', event);

    return await (0, _emberNativeDomHelpers.triggerEvent)(dragSelector, 'dragend', dropEndOptions);
  }

  async function drag(dragSelector, options = {}) {
    let dragEvent = new _mockEvent.default(options.dragStartOptions);

    await (0, _emberNativeDomHelpers.triggerEvent)(dragSelector, 'mouseover');

    await (0, _emberNativeDomHelpers.triggerEvent)(dragSelector, 'dragstart', dragEvent);

    if (options.afterDrag) {
      await options.afterDrag.call();
    }

    if (options.drop) {
      await drop(dragSelector, dragEvent, options);
    }
  }
});
define('mdeditor/tests/helpers/ember-cli-file-picker', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  function createFile(content = ['test'], options = {}) {
    const name = options.name,
          type = options.type,
          lastModifiedDate = options.lastModifiedDate;


    const file = new Blob(content, { type: type ? type : 'text/plain' });
    file.name = name ? name : 'test.txt';

    return file;
  } /* global Blob, jQuery */

  const uploadFileHelper = function uploadFileHelper(content, options) {
    const file = createFile(content, options);

    const event = jQuery.Event('change');
    event.target = {
      files: [file]
    };

    jQuery('.file-picker__input').trigger(event);
  };

  const uploadFile = Ember.Test.registerAsyncHelper('uploadFile', function (app, content, options) {
    uploadFileHelper(content, options);

    return wait();
  });

  exports.uploadFile = uploadFile;
  exports.uploadFileHelper = uploadFileHelper;
});
define('mdeditor/tests/helpers/ember-drag-drop', ['exports', 'mdeditor/tests/helpers/data-transfer'], function (exports, _dataTransfer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.drag = drag;


  function drop($dragHandle, dropCssPath, dragEvent) {
    let $dropTarget = Ember.$(dropCssPath);

    if ($dropTarget.length === 0) {
      throw `There are no drop targets by the given selector: '${dropCssPath}'`;
    }

    Ember.run(() => {
      triggerEvent($dropTarget, 'dragover', _dataTransfer.default.makeMockEvent());
    });

    Ember.run(() => {
      triggerEvent($dropTarget, 'drop', _dataTransfer.default.makeMockEvent(dragEvent.dataTransfer.get('data.payload')));
    });

    Ember.run(() => {
      triggerEvent($dragHandle, 'dragend', _dataTransfer.default.makeMockEvent());
    });
  } /* global triggerEvent , andThen */
  function drag(cssPath, options = {}) {
    let dragEvent = _dataTransfer.default.makeMockEvent();
    let $dragHandle = Ember.$(cssPath);

    Ember.run(() => {
      triggerEvent($dragHandle, 'mouseover');
    });

    Ember.run(() => {
      triggerEvent($dragHandle, 'dragstart', dragEvent);
    });

    andThen(function () {
      if (options.beforeDrop) {
        options.beforeDrop.call();
      }
    });

    andThen(function () {
      if (options.drop) {
        drop($dragHandle, options.drop, dragEvent);
      }
    });
  }
});
define('mdeditor/tests/helpers/ember-power-select', ['exports', 'ember-power-select/test-support/helpers'], function (exports, _helpers) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.selectChoose = exports.touchTrigger = exports.nativeTouch = exports.clickTrigger = exports.typeInSearch = exports.triggerKeydown = exports.nativeMouseUp = exports.nativeMouseDown = exports.findContains = undefined;
  exports.default = deprecatedRegisterHelpers;


  function deprecateHelper(fn, name) {
    return function (...args) {
      (true && !(false) && Ember.deprecate(`DEPRECATED \`import { ${name} } from '../../tests/helpers/ember-power-select';\` is deprecated. Please, replace it with \`import { ${name} } from 'ember-power-select/test-support/helpers';\``, false, { until: '1.11.0', id: `ember-power-select-test-support-${name}` }));

      return fn(...args);
    };
  }

  let findContains = deprecateHelper(_helpers.findContains, 'findContains');
  let nativeMouseDown = deprecateHelper(_helpers.nativeMouseDown, 'nativeMouseDown');
  let nativeMouseUp = deprecateHelper(_helpers.nativeMouseUp, 'nativeMouseUp');
  let triggerKeydown = deprecateHelper(_helpers.triggerKeydown, 'triggerKeydown');
  let typeInSearch = deprecateHelper(_helpers.typeInSearch, 'typeInSearch');
  let clickTrigger = deprecateHelper(_helpers.clickTrigger, 'clickTrigger');
  let nativeTouch = deprecateHelper(_helpers.nativeTouch, 'nativeTouch');
  let touchTrigger = deprecateHelper(_helpers.touchTrigger, 'touchTrigger');
  let selectChoose = deprecateHelper(_helpers.selectChoose, 'selectChoose');

  function deprecatedRegisterHelpers() {
    (true && !(false) && Ember.deprecate("DEPRECATED `import registerPowerSelectHelpers from '../../tests/helpers/ember-power-select';` is deprecated. Please, replace it with `import registerPowerSelectHelpers from 'ember-power-select/test-support/helpers';`", false, { until: '1.11.0', id: 'ember-power-select-test-support-register-helpers' }));

    return (0, _helpers.default)();
  }

  exports.findContains = findContains;
  exports.nativeMouseDown = nativeMouseDown;
  exports.nativeMouseUp = nativeMouseUp;
  exports.triggerKeydown = triggerKeydown;
  exports.typeInSearch = typeInSearch;
  exports.clickTrigger = clickTrigger;
  exports.nativeTouch = nativeTouch;
  exports.touchTrigger = touchTrigger;
  exports.selectChoose = selectChoose;
});
define('mdeditor/tests/helpers/flash-message', ['ember-cli-flash/flash/object'], function (_object) {
  'use strict';

  _object.default.reopen({
    init() {
      return this;
    }
  });
});
define('mdeditor/tests/helpers/mock-event', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.createDomEvent = createDomEvent;
  class DataTransfer {
    constructor() {
      this.data = {};
    }

    setData(type, value) {
      this.data[type] = value;
      return this;
    }

    getData(type = "Text") {
      return this.data[type];
    }

    setDragImage() {}
  }

  class MockEvent {
    constructor(options = {}) {
      this.dataTransfer = new DataTransfer();
      this.dataTransfer.setData('Text', options.dataTransferData);
      this.setProperties(options);
    }

    useDataTransferData(otherEvent) {
      this.dataTransfer.setData('Text', otherEvent.dataTransfer.getData());
      return this;
    }

    setProperties(props) {
      for (let prop in props) {
        this[prop] = props[prop];
      }
      return this;
    }

    preventDefault() {}

    stopPropagation() {}
  }

  exports.default = MockEvent;
  function createDomEvent(type) {
    let event = document.createEvent("CustomEvent");
    event.initCustomEvent(type, true, true, null);
    event.dataTransfer = new DataTransfer();
    return event;
  }
});
define('mdeditor/tests/helpers/modal-asserts', ['exports', 'qunit'], function (exports, _qunit) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = registerAssertHelpers;
  function registerAssertHelpers() {
    const assert = _qunit.default.assert;

    const overlaySelector = '.md-modal-overlay';
    const dialogSelector = '.ember-modal-dialog';

    assert.isPresentOnce = function (selector, message) {
      message = message || `${selector} is present in DOM once`;
      return this.equal(Ember.$(selector).length, 1, message);
    };

    assert.isAbsent = function (selector, message) {
      message = message || `${selector} is absent from DOM`;
      return this.equal(Ember.$(selector).length, 0, message);
    };

    assert.isVisible = function (selector, message) {
      message = message || `${selector} is not visible`;
      return this.ok(Ember.$(selector).is(':visible'), message);
    };

    assert.dialogOpensAndCloses = function (options /*, message*/) {
      //message = message || `Dialog triggered by ${options.openSelector} failed to open and close`;
      const dialogContent = options.dialogText ? [dialogSelector, `:contains(${options.dialogText})`].join('') : dialogSelector;
      const self = this;
      return click(options.openSelector, options.context).then(function () {
        if (options.hasOverlay) {
          self.isPresentOnce(overlaySelector);
        }
        self.isPresentOnce(dialogContent);
        if (options.whileOpen) {
          options.whileOpen();
        }
        return click(options.closeSelector, options.context).then(function () {
          self.isAbsent(overlaySelector);
          self.isAbsent(dialogContent);
        });
      });
    };
  }
});
define('mdeditor/tests/helpers/start-app', ['exports', 'mdeditor/app', 'mdeditor/config/environment', 'mdeditor/tests/helpers/modal-asserts', 'mdeditor/tests/helpers/ember-power-select'], function (exports, _app, _environment, _modalAsserts, _emberPowerSelect) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = startApp;


  (0, _emberPowerSelect.default)();

  function startApp(attrs) {
    let attributes = Ember.merge({}, _environment.default.APP);
    attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

    return Ember.run(() => {
      let application = _app.default.create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
      (0, _modalAsserts.default)();
      return application;
    });
  }
});
define('mdeditor/tests/integration/components/feature-form-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | feature form', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      this.set('model', {
        id: 'foo',
        properties: {
          name: 'bar',
          description: 'foobar'
        }
      });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "qodNgu2S",
        "block": "{\"symbols\":[],\"statements\":[[1,[25,\"feature-form\",null,[[\"model\"],[[20,[\"model\"]]]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('.ember-view').textContent.replace(/[ \n]+/g, '|').trim(), '|Feature|ID|Name|Description|Other|Properties|read-only|Name|Value|None|found.|');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "7/xL/ali",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"feature-form\",null,[[\"model\"],[[20,[\"model\"]]]],{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('.ember-view').textContent.replace(/[ \n]+/g, '|').trim(), '|Feature|ID|Name|Description|Other|Properties|read-only|Name|Value|None|found.|template|block|text|');
    });
  });
});
define('mdeditor/tests/integration/components/feature-group-test', ['@ember/test-helpers', 'qunit', 'ember-qunit', 'mdeditor/tests/helpers/create-map-layer'], function (_testHelpers, _qunit, _emberQunit, _createMapLayer) {
  'use strict';

  (0, _qunit.module)('Integration | Component | feature group', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      this.set('layers', (0, _createMapLayer.default)(2));

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "PlcK7SKa",
        "block": "{\"symbols\":[\"l\"],\"statements\":[[0,\"\\n\"],[4,\"leaflet-draw\",null,[[\"lat\",\"lng\",\"zoom\"],[0,0,2]],{\"statements\":[[4,\"layer-group\",null,[[\"name\",\"baselayer\",\"default\"],[\"Terrain\",true,true]],{\"statements\":[[0,\"          \"],[1,[25,\"tile-layer\",null,[[\"url\",\"attribution\"],[\"http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.png\",[20,[\"mapAttribution\"]]]]],false],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"feature-group\",null,[[\"name\",\"default\"],[\"Extents\",true]],{\"statements\":[[4,\"each\",[[20,[\"layers\"]]],null,{\"statements\":[[0,\"            \"],[1,[25,\"geojson-layer\",null,[[\"geoJSON\",\"draw\"],[[19,1,[]],true]]],false],[0,\"\\n\"]],\"parameters\":[1]},null]],\"parameters\":[]},null],[0,\"\\n        \"],[1,[18,\"layer-control\"],false],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '+- Terrain Extents3000 km2000 miLeaflet');
    });
  });
});
define('mdeditor/tests/integration/components/feature-table-test', ['@ember/test-helpers', 'qunit', 'ember-qunit', 'mdeditor/tests/helpers/create-map-layer'], function (_testHelpers, _qunit, _emberQunit, _createMapLayer) {
  'use strict';

  (0, _qunit.module)('Integration | Component | feature table', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      this.set('data', (0, _createMapLayer.default)(2));
      this.set('showForm', function () {
        return false;
      });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "AnIn4SVs",
        "block": "{\"symbols\":[],\"statements\":[[1,[25,\"feature-table\",null,[[\"data\",\"showForm\"],[[20,[\"data\",\"features\"]],[20,[\"showForm\"]]]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.replace(/[\s, \t]/g, '\n').trim().replace(/[ +\n]+/g, '|'), 'Search:|Columns|Show|All|Hide|All|Restore|Defaults|ID|Name|Description|ID|Name|Description|1|Feature|1|2|Feature|2|Show|1|-|2|of|2|10|25|50|500');
    });
  });
});
define('mdeditor/tests/integration/components/geojson-layer-test', ['@ember/test-helpers', 'qunit', 'ember-qunit', 'mdeditor/tests/helpers/create-map-layer'], function (_testHelpers, _qunit, _emberQunit, _createMapLayer) {
  'use strict';

  (0, _qunit.module)('Integration | Component | geojson layer', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      this.set('layers', (0, _createMapLayer.default)(2));

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "uwoxCVNz",
        "block": "{\"symbols\":[\"l\"],\"statements\":[[0,\"\\n\"],[4,\"leaflet-draw\",null,[[\"lat\",\"lng\",\"zoom\"],[0,0,2]],{\"statements\":[[4,\"layer-group\",null,[[\"name\",\"baselayer\",\"default\"],[\"Terrain\",true,true]],{\"statements\":[[0,\"          \"],[1,[25,\"tile-layer\",null,[[\"url\",\"attribution\"],[\"http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.png\",[20,[\"mapAttribution\"]]]]],false],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"feature-group\",null,[[\"name\",\"default\"],[\"Extents\",true]],{\"statements\":[[4,\"each\",[[20,[\"layers\"]]],null,{\"statements\":[[0,\"            \"],[1,[25,\"geojson-layer\",null,[[\"geoJSON\",\"draw\",\"editLayers\"],[[19,1,[]],true,[20,[\"layers\"]]]]],false],[0,\"\\n\"]],\"parameters\":[1]},null]],\"parameters\":[]},null],[0,\"\\n        \"],[1,[18,\"layer-control\"],false],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '+− Terrain Extents3000 km2000 miLeaflet');
    });
  });
});
define('mdeditor/tests/integration/components/leaflet-draw-test', ['@ember/test-helpers', 'qunit', 'ember-qunit', 'mdeditor/tests/helpers/create-map-layer'], function (_testHelpers, _qunit, _emberQunit, _createMapLayer) {
  'use strict';

  (0, _qunit.module)('Integration | Component | leaflet draw', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      this.set('layers', (0, _createMapLayer.default)(2));

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "zcsQWj/Z",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"leaflet-draw\",null,[[\"lat\",\"lng\",\"zoom\"],[0,0,2]],{\"statements\":[[4,\"layer-group\",null,[[\"name\",\"baselayer\",\"default\"],[\"Terrain\",true,true]],{\"statements\":[[0,\"          \"],[1,[25,\"tile-layer\",null,[[\"url\",\"attribution\"],[\"http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.png\",[20,[\"mapAttribution\"]]]]],false],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n        \"],[1,[18,\"layer-control\"],false],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '+- Terrain3000 km2000 miLeaflet');
    });
  });
});
define('mdeditor/tests/integration/components/leaflet-table-row-actions-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | leaflet table row actions', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "jcOg9pT3",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"leaflet-table-row-actions\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "jwtslw3T",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"leaflet-table-row-actions\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/components/leaflet-table-row-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | leaflet table row', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "h8LSm2i6",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"leaflet-table-row\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "gW3jY4/a",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"leaflet-table-row\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/components/leaflet-table-test', ['@ember/test-helpers', 'qunit', 'ember-qunit', 'mdeditor/tests/helpers/create-map-layer'], function (_testHelpers, _qunit, _emberQunit, _createMapLayer) {
  'use strict';

  (0, _qunit.module)('Integration | Component | leaflet table', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      this.set('layers', (0, _createMapLayer.default)(2));

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "RHH4eUZa",
        "block": "{\"symbols\":[],\"statements\":[[1,[25,\"leaflet-table\",null,[[\"layers\",\"resizeDebouncedEventsEnabled\"],[[20,[\"layers\",\"features\"]],true]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.replace(/[\s\t]/g, '\n').trim().replace(/[ \n]+/g, '|').replace(/Extents.+Leaflet/g, 'Extents|Leaflet'), 'Drop|Here!|+−|Terrain|Extents|Leaflet|||Map|tiles|by|Stamen|Design,|under|CC|BY|3.0.|Data|by|OpenStreetMap,|under|CC|BY|SA.|Feature|Properties|ID|Name|Description|1|Feature|1|2|Feature|2|Show|1|-|2|of|2|10|25|50|500');
    });
  });
});
define('mdeditor/tests/integration/components/sb-publisher-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | sb publisher', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "VfdA2WJz",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"sb-publisher\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "cV4HhWJW",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"sb-publisher\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/components/sb-settings-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | sb settings', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "q1qnKDie",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"sb-settings\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "1faPbTIG",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"sb-settings\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/components/sb-tree-label-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | sb tree label', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "7hhKuYCL",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"sb-tree-label\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "uytS2/Un",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"sb-tree-label\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/components/sb-tree-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | sb tree', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "d5iVKFXO",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"sb-tree\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "ob9U+pwE",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"sb-tree\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/components/tree-branch-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | tree branch', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      this.set('model', {
        broader: 'foo0',
        children: [{
          broader: 'foo2',
          children: [],
          label: 'foo2label',
          uuid: 'foo2'
        }],
        label: 'foo1label',
        uuid: 'foo1'
      });

      this.set('selected', [{
        identifier: 'bar1'
      }]);

      this.set('path', [{ label: 'fiz', identifier: 1 }, { label: 'faz', identifier: 10 }, { label: 'foz', identifier: 100 }]);

      this.set('select', function () {
        assert.ok(true, 'called select');
      });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "3mW3YpdO",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n      \"],[1,[25,\"tree-branch\",null,[[\"model\",\"select\",\"selected\",\"nodeDepth\",\"path\"],[[20,[\"model\"]],[20,[\"select\"]],[20,[\"selected\"]],3,[20,[\"path\"]]]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.expect(3);

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'foo1label');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "ZqvhW9BV",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"tree-branch\",null,[[\"model\",\"select\",\"selected\",\"nodeDepth\",\"path\"],[[20,[\"model\"]],[20,[\"select\"]],[20,[\"selected\"]],3,[20,[\"path\"]]]],{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      await (0, _testHelpers.click)('.tree-leaf .toggle-icon');

      assert.equal((0, _testHelpers.find)('*').textContent.replace(/[ \n]+/g, '|'), '|foo1label|foo2label|');

      assert.equal(this.$('.tree-leaf:last .tree-indent').length, 3, 'proper indentation');
    });
  });
});
define('mdeditor/tests/integration/components/tree-label-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | tree label', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      this.set('model', {
        broader: 'foo0',
        children: [{
          broader: 'foo2',
          children: [],
          label: 'foo2label',
          uuid: 'foo2'
        }],
        label: 'foo1label',
        uuid: 'foo1'
      });
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "bF1V4Gaz",
        "block": "{\"symbols\":[],\"statements\":[[1,[25,\"tree-label\",null,[[\"model\"],[[20,[\"model\"]]]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'foo1label');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "r0tnwhEk",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"tree-label\",null,[[\"model\"],[[20,[\"model\"]]]],{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'foo1label');
    });
  });
});
define('mdeditor/tests/integration/components/tree-leaf-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | tree leaf', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      this.set('model', {
        broader: 'foo0',
        children: [{
          broader: 'foo2',
          children: [],
          label: 'foo2label',
          uuid: 'foo2'
        }],
        label: 'foo1label',
        uuid: 'foo1'
      });

      this.set('selected', [{
        identifier: 'foo1'
      }]);

      this.set('nodePath', [{ label: 'fiz', identifier: 1 }, { label: 'faz', identifier: 10 }, { label: 'foz', identifier: 100 }]);

      this.set('select', function () {
        assert.ok(true, 'called select');
      });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "ZJ1FfM4d",
        "block": "{\"symbols\":[],\"statements\":[[1,[25,\"tree-leaf\",null,[[\"model\",\"inTree\",\"select\",\"selected\",\"nodeDepth\",\"nodePath\"],[[20,[\"model\"]],true,[20,[\"select\"]],[20,[\"selected\"]],3,[20,[\"nodePath\"]]]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      await (0, _testHelpers.click)('.toggle-icon');

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'foo1label');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "4+Kp4ndG",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"tree-leaf\",null,[[\"model\",\"inTree\",\"select\",\"selected\"],[[20,[\"model\"]],false,[20,[\"select\"]],[20,[\"selected\"]]]],{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'foo1label');

      assert.equal((0, _testHelpers.findAll)('.tree-indent').length, 0, 'not in tree');
    });
  });
});
define('mdeditor/tests/integration/components/tree-search-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | tree search', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      this.set('model', [{
        broader: 'foo0',
        children: [{
          broader: 'foo2',
          children: [],
          label: 'foo2label',
          uuid: 'foo2'
        }],
        label: 'foo1label',
        uuid: 'foo1'
      }, {
        broader: 'barfoo0',
        children: [],
        label: 'barfoo1label',
        uuid: 'barfoo1'
      }]);

      this.set('selected', [{
        identifier: 'bar1'
      }]);

      this.set('select', function () {
        assert.ok(true, 'called select');
      });

      this.set('searchString', 'foo');
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "bdNeDZ+H",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n      \"],[1,[25,\"tree-search\",null,[[\"model\",\"selected\",\"select\",\"searchString\",\"exactMatch\"],[[20,[\"model\"]],[20,[\"selected\"]],[20,[\"select\"]],[20,[\"searchString\"]],[20,[\"exactMatch\"]]]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.replace(/[ \n]+/g, '|'), '|Search|Tree:|Exact|Match|3|matches|found.|>|barfoo1label|foo1label|foo1label|>|foo2label|');

      this.set('exactMatch', true);

      assert.equal((0, _testHelpers.find)('*').textContent.replace(/[ \n]+/g, '|'), '|Search|Tree:|Exact|Match|2|matches|found.|foo1label|foo1label|>|foo2label|', 'exact match');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "ytqWeVjt",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"tree-search\",null,[[\"model\",\"selected\",\"select\"],[[20,[\"model\"]],[20,[\"selected\"]],[20,[\"select\"]]]],{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.replace(/[ \n]+/g, '|'), '|Search|Tree:|Exact|Match|template|block|text|');
    });
  });
});
define('mdeditor/tests/integration/components/tree-view-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | tree view', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders and expands', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      this.set('model', [{
        broader: 'foo0',
        children: [{
          broader: 'foo2',
          children: [],
          label: 'foo2label',
          uuid: 'foo2'
        }],
        label: 'foo1label',
        uuid: 'foo1'
      }, {
        broader: 'bar0',
        children: [],
        label: 'bar1label',
        uuid: 'bar1'
      }]);

      this.set('selected', [{
        identifier: 'bar1'
      }]);

      this.set('select', function () {
        assert.ok(true, 'called select');
      });
      // Handle any actions with this.on('myAction', function(val) { ... });
      assert.expect(7);

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "Wm/rVldd",
        "block": "{\"symbols\":[],\"statements\":[[1,[25,\"tree-view\",null,[[\"model\",\"selected\"],[[20,[\"model\"]],[20,[\"selected\"]]]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.replace(/[ \n]+/g, '|'), '|bar1label|foo1label|');

      assert.ok(this.$('.tree-leaf:first').hasClass('tree-highlight'), 'selected leaf highlighted');

      assert.equal(this.$('.tree-leaf:last .expand-icon').length, 1, 'node expand icon rendered');

      this.$('.tree-leaf:last .expand-icon').click();

      assert.equal((0, _testHelpers.findAll)('.tree-leaf').length, 3, 'node expanded');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "I1xf2p5/",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"tree-view\",null,[[\"model\",\"select\"],[[20,[\"model\"]],[20,[\"select\"]]]],{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.replace(/[ \n]+/g, '|'), '|bar1label|foo1label|foo2label|');

      this.$('.tree-leaf:last').click();

      assert.equal((0, _testHelpers.findAll)('.tree-leaf.tree-highlight').length, 2, 'node selected');
    });
  });
});
define('mdeditor/tests/integration/helpers/present-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('helper:present', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    // Replace this with your real tests.
    (0, _qunit.test)('it renders', async function (assert) {
      this.set('inputValue', '1234');

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "BBakFKAP",
        "block": "{\"symbols\":[],\"statements\":[[1,[25,\"present\",[[20,[\"inputValue\"]]],null],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '1234');
    });
  });
});
define('mdeditor/tests/integration/helpers/word-limit-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('helper:word-limit', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    // Replace this with your real tests.
    (0, _qunit.test)('it renders', async function (assert) {
      this.set('inputValue', '1234');

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "Nl0wWOis",
        "block": "{\"symbols\":[],\"statements\":[[1,[25,\"word-limit\",[[20,[\"inputValue\"]]],null],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '1234');
    });
  });
});
define('mdeditor/tests/integration/pods/components/control/md-button-confirm/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | control/md button confirm', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "QCshRkZ4",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"control/md-button-confirm\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:" + EOL +
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "RGc0SS/2",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"control/md-button-confirm\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });

    (0, _qunit.test)('shows and cancels confirm', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

      // Template block usage:" + EOL +
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "6FMA/iOV",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"control/md-button-confirm\",null,null,{\"statements\":[[0,\"        Test\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'Test', 'renders button');

      await (0, _testHelpers.click)('button');

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'Confirm', 'renders confirm');

      var $btn = this.$('button');
      Ember.run(function () {
        $btn.blur();
      });

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'Test', 'cancels confirm');
    });

    (0, _qunit.test)('performs confirm action', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +
      this.set('externalAction', type => {
        assert.ok(type, `${type} called`);
      });

      // Template block usage:" + EOL +
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "TELhXvKF",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"control/md-button-confirm\",null,[[\"onConfirm\"],[[25,\"action\",[[19,0,[]],[20,[\"externalAction\"]],\"onConfirm\"],null]]],{\"statements\":[[0,\"        Test\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      await (0, _testHelpers.click)('button').click();
    });
  });
});
define('mdeditor/tests/integration/pods/components/control/md-button-modal/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit', 'mdeditor/tests/helpers/modal-asserts'], function (_testHelpers, _qunit, _emberQunit, _modalAsserts) {
  'use strict';

  (0, _modalAsserts.default)();

  (0, _qunit.module)('Integration | Component | control/md button modal', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "NDOIm8Eq",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"control/md-button-modal\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:" + EOL +
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "F6rZnLP/",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"control/md-button-modal\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });

    (0, _qunit.test)('shows modal and performs actions', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +
      let modalDialogService = this.owner.lookup('service:modal-dialog');
      modalDialogService.destinationElementId = 'test-div';

      this.set('externalAction', type => {
        assert.ok(type, `${type} called`);
      });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "woyzAw6j",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n      \"],[6,\"div\"],[9,\"id\",\"test-div\"],[7],[8],[0,\"\\n      \"],[4,\"control/md-button-modal\",null,[[\"message\",\"onConfirm\",\"onCancel\"],[\"Hello\",[25,\"action\",[[19,0,[]],[20,[\"externalAction\"]],\"confirm\"],null],[25,\"action\",[[19,0,[]],[20,[\"externalAction\"]],\"cancel\"],null]]],{\"statements\":[[0,\" Test\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      // click the button
      await (0, _testHelpers.click)('.md-button-modal');

      assert.isPresentOnce('.md-modal-overlay');

      let num = (0, _testHelpers.findAll)('.md-modal-buttons button').length;

      await (0, _testHelpers.click)('.md-modal-overlay');

      assert.isAbsent('.md-modal-overlay');

      let i = 0;

      // click the modal buttons
      while (i < num) {
        await (0, _testHelpers.click)('.md-button-modal');
        this.$('.md-modal-buttons button')[i].click();
        i++;
      }
    });
  });
});
define('mdeditor/tests/integration/pods/components/control/md-contact-link/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | control/md contact link', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "7sY1nMIs",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"control/md-contact-link\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "6DNPYnbZ",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"control/md-contact-link\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/control/md-contact-title/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | control/md contact title', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "iQ6BJhv+",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"control/md-contact-title\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "om1YhG0o",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"control/md-contact-title\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/control/md-crud-buttons/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | control/md crud buttons', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "t31fFgHN",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"control/md-crud-buttons\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.replace(/[ \n]+/g, '|'), '|Save|Cancel|Copy|Delete|');

      // Template block usage:" + EOL +
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "GwVGbOGn",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"control/md-crud-buttons\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.replace(/[ \n]+/g, '|'), '|Save|Cancel|Copy|Delete|template|block|text|');
    });

    (0, _qunit.test)('should trigger external action', async function (assert) {
      assert.expect(4);

      // test double for the external action
      this.set('externalAction', type => {
        assert.ok(type, `${type} called`);
      });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "/cX+9bOi",
        "block": "{\"symbols\":[],\"statements\":[[1,[25,\"control/md-crud-buttons\",null,[[\"doSave\",\"doCancel\",\"doCopy\",\"doDelete\"],[[25,\"action\",[[19,0,[]],[20,[\"externalAction\"]],\"doSave\"],null],[25,\"action\",[[19,0,[]],[20,[\"externalAction\"]],\"doCancel\"],null],[25,\"action\",[[19,0,[]],[20,[\"externalAction\"]],\"doCopy\"],null],[25,\"action\",[[19,0,[]],[20,[\"externalAction\"]],\"doDelete\"],null]]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      // click the buttons
      await (0, _testHelpers.click)('.md-crud-buttons .btn-success');
      await (0, _testHelpers.click)('.md-crud-buttons .btn-warning');
      await (0, _testHelpers.click)('.md-crud-buttons .btn-info');
      //we have to click delete twice to confirm
      await (0, _testHelpers.click)('.md-crud-buttons .btn-danger').click();
    });
  });
});
define('mdeditor/tests/integration/pods/components/control/md-definition/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | control/md definition', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "3f7TQimq",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"control/md-definition\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "BR4Sv+Z7",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"control/md-definition\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/control/md-errors/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | control/md errors', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "n6wcRKWy",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"control/md-errors\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "o06J3SMw",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"control/md-errors\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/control/md-fiscalyear/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | control/md fiscalyear', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "J0wbw+FY",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"control/md-fiscalyear\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "XZ9bBhC/",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"control/md-fiscalyear\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/control/md-import-csv/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | control/md import csv', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "oylfaetv",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"control/md-import-csv\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "/vs5eLcz",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"control/md-import-csv\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/control/md-itis/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | control/md itis', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "fmxlIQTt",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"control/md-itis\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "VFcpCX8c",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"control/md-itis\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/control/md-json-button/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | control/md json button', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      this.set('json', {
        foo: 'bar'
      });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "itUu+75b",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"control/md-json-button\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'Preview JSON');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "hEVqRZ6K",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"control/md-json-button\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });

    (0, _qunit.test)('render json modal', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      this.set('json', {
        foo: 'bar'
      });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "dTNtBdof",
        "block": "{\"symbols\":[],\"statements\":[[1,[25,\"control/md-json-button\",null,[[\"json\"],[[20,[\"json\"]]]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      await (0, _testHelpers.click)('button');

      assert.equal(Ember.$('.md-jsmodal-container').text().trim(), '{"foo": "bar"}');
    });
  });
});
define('mdeditor/tests/integration/pods/components/control/md-json-viewer/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | control/md json viewer', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('render json modal', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      this.set('json', {
        foo: 'bar'
      });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "u4beRUY0",
        "block": "{\"symbols\":[],\"statements\":[[1,[25,\"control/md-json-viewer\",null,[[\"json\"],[[20,[\"json\"]]]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal(Ember.$('.md-jsmodal-container').text().trim(), '{"foo": "bar"}');
    });

    (0, _qunit.test)('render json viewer', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      this.set('json', {
        foo: 'bar'
      });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "85gLqzZ/",
        "block": "{\"symbols\":[],\"statements\":[[1,[25,\"control/md-json-viewer\",null,[[\"json\",\"modal\"],[[20,[\"json\"]],false]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '{"foo": "bar"}');
    });
  });
});
define('mdeditor/tests/integration/pods/components/control/md-modal/component-test', ['qunit', 'ember-qunit', '@ember/test-helpers'], function (_qunit, _emberQunit, _testHelpers) {
  'use strict';

  (0, _qunit.module)('Integration | Component | control/md modal', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "yGvdu1qa",
        "block": "{\"symbols\":[],\"statements\":[[1,[25,\"control/md-modal\",null,[[\"isShowing\"],[true]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.ok((0, _testHelpers.find)('.md-modal-container'));

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "f3JPqgHv",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"control/md-modal\",null,[[\"isShowing\"],[true]],{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('.md-modal-container').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/control/md-record-table/buttons/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | control/md record table/buttons', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "+lDzoLsN",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"control/md-record-table/buttons\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "WTPnT5/d",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"control/md-record-table/buttons\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/control/md-record-table/buttons/custom/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | control/md record table/buttons/custom', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "+715xWyu",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"control/md-record-table/buttons/custom\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "OpBicD9M",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"control/md-record-table/buttons/custom\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/control/md-record-table/buttons/filter/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | control/md record table/buttons/filter', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "X/mmNFVV",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"control/md-record-table/buttons/filter\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "MhnLTJku",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"control/md-record-table/buttons/filter\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/control/md-record-table/buttons/show/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | control/md record table/buttons/show', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "GkkIweeL",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"control/md-record-table/buttons/show\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "JdZ+8wmu",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"control/md-record-table/buttons/show\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/control/md-record-table/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | control/md record table', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "+4vK0M0h",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"control/md-record-table\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "uZPj6NJA",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"control/md-record-table\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/control/md-repo-link/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit', 'mdeditor/config/environment'], function (_testHelpers, _qunit, _emberQunit, _environment) {
  'use strict';

  var _config$APP = _environment.default.APP;
  const repository = _config$APP.repository,
        version = _config$APP.version;


  (0, _qunit.module)('Integration | Component | control/md repo link', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "AtI8Y3SI",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"control/md-repo-link\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), version);
      assert.equal((0, _testHelpers.find)('a').getAttribute('href'), `${repository}/tree/${version.substring(version.indexOf('+') + 1)}`);

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "J/VwpCTq",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"control/md-repo-link\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/control/md-scroll-spy/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | control/md scroll spy', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "gvTXQipg",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"control/md-scroll-spy\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "SlklNW4y",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"control/md-scroll-spy\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/control/md-select-table/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | control/md select table', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "f/vKOdH6",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"control/md-select-table\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "LI4m+FX9",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"control/md-select-table\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/control/md-spinner/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | control/md spinner', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "3jWW0Kou",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"control/md-spinner\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "NJovIzPH",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"control/md-spinner\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/control/md-spotlight/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | control/md spotlight', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "IjldBzM9",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"control/md-spotlight\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "sVy+jx6C",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"control/md-spotlight\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/control/md-status/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | control/md status', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      this.set('model', {
        hasDirtyHash: true,
        hasSchemaErrors: false
      });
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "T3Nv+xUg",
        "block": "{\"symbols\":[],\"statements\":[[1,[25,\"control/md-status\",null,[[\"model\"],[[20,[\"model\"]]]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('.md-status').textContent.trim(), 'This record has been modified! Cick to save.');

      this.set('model.hasDirtyHash', false);
      this.set('model.hasSchemaErrors', true);
      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "L0fCJ+fD",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"control/md-status\",null,[[\"model\"],[[20,[\"model\"]]]],{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('.md-status').textContent.trim(), 'This record has errors! Click to view.');
    });
  });
});
define('mdeditor/tests/integration/pods/components/control/subbar-citation/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | control/subbar citation', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "7DkMyxFZ",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"control/subbar-citation\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "dySsOj+Q",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"control/subbar-citation\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/control/subbar-extent/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | control/subbar spatial', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    hooks.beforeEach(function () {
      this.actions = {};
      this.send = (actionName, ...args) => this.actions[actionName].apply(this, args);
    });

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "3ByLjXmj",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"control/subbar-spatial\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.replace(/[ \n]+/g, '|').trim(), '|Add|Spatial|Extent|');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "L8hdN2wf",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"control/subbar-spatial\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.replace(/[ \n]+/g, '|').trim(), '|Add|Spatial|Extent|template|block|text|');
    });

    (0, _qunit.test)('fire actions', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      assert.expect(1);

      var FakeRoute = Ember.Route.extend({
        actions: {
          addExtent: function addExtent() {
            assert.ok(true, 'calls addExtent action');
          }
        }
      });

      this.actions.getContext = function () {
        return new FakeRoute();
      };

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "YP2qnUCj",
        "block": "{\"symbols\":[],\"statements\":[[1,[25,\"control/subbar-spatial\",null,[[\"context\"],[[25,\"action\",[[19,0,[]],\"getContext\"],null]]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      await (0, _testHelpers.click)('button');
    });
  });
});
define('mdeditor/tests/integration/pods/components/control/subbar-importcsv/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | control/subbar importcsv', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "MML5JEXS",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"control/subbar-importcsv\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "V6lDLza3",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"control/subbar-importcsv\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/control/subbar-keywords/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | control/subbar keywords', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    hooks.beforeEach(function () {
      this.actions = {};
      this.send = (actionName, ...args) => this.actions[actionName].apply(this, args);
    });

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "rK1zJUYv",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"control/subbar-keywords\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('button').textContent.replace(/[ \n]+/g, '|').trim(), '|Add|Thesaurus');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "KG3R6F8F",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"control/subbar-keywords\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('.ember-view').textContent.replace(/[ \n]+/g, '|').trim(), '|Add|Thesaurus|template|block|text|');
    });

    (0, _qunit.test)('fire actions', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      assert.expect(1);

      var FakeRoute = Ember.Route.extend({
        actions: {
          addThesaurus: function addThesaurus() {
            assert.ok(true, 'calls addThesaurus action');
            return false;
          }
        }
      });

      this.actions.getContext = function () {
        return new FakeRoute();
      };

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "ZLh6KItu",
        "block": "{\"symbols\":[],\"statements\":[[1,[25,\"control/subbar-keywords\",null,[[\"context\"],[[25,\"action\",[[19,0,[]],\"getContext\"],null]]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      await (0, _testHelpers.click)('button');
    });
  });
});
define('mdeditor/tests/integration/pods/components/control/subbar-link/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | control/subbar link', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "vuOb1j+u",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"control/subbar-link\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "pnE5oh9s",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"control/subbar-link\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/control/subbar-spatial/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | control/subbar extent', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    hooks.beforeEach(function () {
      this.actions = {};
      this.send = (actionName, ...args) => this.actions[actionName].apply(this, args);
    });

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "8/UPPj5Q",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"control/subbar-extent\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.replace(/[ \n]+/g, '|').trim(), '|Add|Spatial|Extent|');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "tfS9gvEp",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"control/subbar-extent\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.replace(/[ \n]+/g, '|').trim(), '|Add|Spatial|Extent|template|block|text|');
    });

    (0, _qunit.test)('fire actions', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      assert.expect(1);

      var FakeRoute = Ember.Route.extend({
        actions: {
          addExtent: function addExtent() {
            assert.ok(true, 'calls addExtent action');
          }
        }
      });

      this.actions.getContext = function () {
        return new FakeRoute();
      };

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "bmYwvvDs",
        "block": "{\"symbols\":[],\"statements\":[[1,[25,\"control/subbar-extent\",null,[[\"context\"],[[25,\"action\",[[19,0,[]],\"getContext\"],null]]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      await (0, _testHelpers.click)('button');
    });
  });
});
define('mdeditor/tests/integration/pods/components/control/subbar-thesaurus/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | control/subbar thesaurus', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    hooks.beforeEach(function () {
      this.actions = {};
      this.send = (actionName, ...args) => this.actions[actionName].apply(this, args);
    });

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "HxgIcwRw",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"control/subbar-thesaurus\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.replace(/[ \n]+/g, '|'), '|Back|to|List|');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "FRN2OQ7C",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"control/subbar-thesaurus\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.replace(/[ \n]+/g, '|'), '|Back|to|List|template|block|text|template|block|text|');
    });

    (0, _qunit.test)('fire actions', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      assert.expect(1);

      var FakeRoute = Ember.Route.extend({
        actions: {
          toList: function toList() {
            assert.ok(true, 'calls toList action');
          }
        }
      });

      this.actions.getContext = function () {
        return new FakeRoute();
      };

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "BsbVxfdM",
        "block": "{\"symbols\":[],\"statements\":[[1,[25,\"control/subbar-thesaurus\",null,[[\"context\"],[[25,\"action\",[[19,0,[]],\"getContext\"],null]]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      await (0, _testHelpers.click)('button');
    });
  });
});
define('mdeditor/tests/integration/pods/components/ember-tooltip/component-test', ['qunit', 'ember-qunit', '@ember/test-helpers'], function (_qunit, _emberQunit, _testHelpers) {
  'use strict';

  (0, _qunit.module)('Integration | Component | ember-tooltip', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.set('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "SPENJ57E",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"ember-tooltip\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal(this.element.textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "wPTAModp",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"ember-tooltip\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal(this.element.textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/input/md-boolean/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | input/md boolean', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "LxPod1/d",
        "block": "{\"symbols\":[],\"statements\":[[1,[25,\"input/md-boolean\",null,[[\"value\",\"text\",\"label\"],[false,\"Foo Bar\",\"Baz\"]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.replace(/[ \n]+/g, '|'), '|Baz|Foo|Bar|');

      // Template block usage:" + EOL +
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "X0tl7Ihh",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"input/md-boolean\",null,[[\"value\",\"text\",\"label\"],[true,\"Foo Bar\",\"Baz\"]],{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.replace(/[ \n]+/g, '|'), '|Baz|Foo|Bar|template|block|text|');

      assert.ok((0, _testHelpers.find)('input').checked);
    });
  });
});
define('mdeditor/tests/integration/pods/components/input/md-codelist-multi/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit', 'mdeditor/tests/helpers/ember-power-select'], function (_testHelpers, _qunit, _emberQunit, _emberPowerSelect) {
  'use strict';

  const foobar = {
    codelist: [{
      code: '001',
      codeName: 'foo',
      description: 'This is foo.'
    }, {
      code: '002',
      codeName: 'bar',
      description: 'This is bar.'
    }]
  };

  const codelist = Ember.Service.extend({
    foobar: foobar
  });

  (0, _qunit.module)('Integration | Component | input/md codelist multi', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    hooks.beforeEach(function () {
      this.actions = {};
      this.send = (actionName, ...args) => this.actions[actionName].apply(this, args);
    });

    hooks.beforeEach(function () {
      this.owner.register('service:codelist', codelist);
      this.codelist = this.owner.lookup('service:codelist');
    });

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +
      this.set('fooVal', ['foo', 'bar']);

      // Template block usage:" + EOL +
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "8F7WkR41",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"input/md-codelist-multi\",null,[[\"mdCodeName\",\"value\"],[\"foobar\",[20,[\"fooVal\"]]]],{\"statements\":[[0,\"        \"],[6,\"p\"],[7],[0,\"template block text\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.replace(/[ \n]+/g, '|'), '|×|bar|×|foo|', 'renders block with array value');
    });

    (0, _qunit.test)('set value action', async function (assert) {
      assert.expect(2);

      //this.set('fooVal', ['foo']);
      this.set('value', ['foo']);
      this.actions.update = actual => {
        assert.equal(actual, this.get('value'), 'submitted value is passed to external action');
      };

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "uG9L24cY",
        "block": "{\"symbols\":[],\"statements\":[[1,[25,\"input/md-codelist-multi\",null,[[\"create\",\"value\",\"mdCodeName\",\"change\"],[false,[20,[\"value\"]],\"foobar\",[25,\"action\",[[19,0,[]],\"update\",[20,[\"value\"]]],null]]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      (0, _emberPowerSelect.clickTrigger)();
      (0, _testHelpers.triggerEvent)((0, _testHelpers.find)('.ember-power-select-option'), 'mouseup');

      return (0, _testHelpers.settled)().then(() => {
        assert.equal((0, _testHelpers.getRootElement)().textContent.replace(/[ \n]+/g, '|'), '|×|bar|×|foo|bar|foo|', 'value updated');
      });
    });

    (0, _qunit.test)('create option', async function (assert) {

      assert.expect(3);

      this.set('value', ['foo']);
      this.actions.update = actual => {
        assert.equal(actual, this.get('value'), 'submitted value is passed to external action');
      };

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "fp38Okep",
        "block": "{\"symbols\":[],\"statements\":[[1,[25,\"input/md-codelist-multi\",null,[[\"create\",\"value\",\"mdCodeName\",\"change\"],[true,[20,[\"value\"]],\"foobar\",[25,\"action\",[[19,0,[]],\"update\",[20,[\"value\"]]],null]]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      (0, _emberPowerSelect.clickTrigger)();
      (0, _emberPowerSelect.typeInSearch)('biz');
      (0, _testHelpers.triggerEvent)((0, _testHelpers.find)('.ember-power-select-option'), 'mouseup');

      return (0, _testHelpers.settled)().then(() => {
        assert.equal((0, _testHelpers.getRootElement)().textContent.replace(/[ \n]+/g, '|'), '|×|foo|×|biz|bar|foo|biz|', 'value updated');
      });
    });
  });
});
define('mdeditor/tests/integration/pods/components/input/md-codelist/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit', 'mdeditor/tests/helpers/ember-power-select'], function (_testHelpers, _qunit, _emberQunit, _emberPowerSelect) {
  'use strict';

  const foobar = {
    codelist: [{
      code: '001',
      codeName: 'foo',
      description: 'This is foo.'
    }, {
      code: '002',
      codeName: 'bar',
      description: 'This is bar.'
    }]
  };

  const codelist = Ember.Service.extend({
    foobar: foobar
  });

  (0, _qunit.module)('Integration | Component | input/md-codelist', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    hooks.beforeEach(function () {
      this.actions = {};
      this.send = (actionName, ...args) => this.actions[actionName].apply(this, args);
    });

    hooks.beforeEach(function () {
      this.owner.register('service:codelist', codelist);
      this.codelist = this.owner.lookup('service:codelist');
    });

    (0, _qunit.test)('it renders', async function (assert) {
      assert.expect(1);
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "XhAf827w",
        "block": "{\"symbols\":[],\"statements\":[[1,[25,\"input/md-codelist\",null,[[\"value\",\"mdCodeName\"],[\"foo\",\"foobar\"]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.replace(/[ \n]+/g, '|'), '|foo|×|');
    });

    (0, _qunit.test)('set value action', async function (assert) {
      assert.expect(2);

      this.set('value', ['foo']);
      this.actions.update = actual => {
        assert.equal(actual, this.get('value'), 'submitted value is passed to external action');
      };

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "I2O8FrLM",
        "block": "{\"symbols\":[],\"statements\":[[1,[25,\"input/md-codelist\",null,[[\"value\",\"mdCodeName\",\"change\"],[[20,[\"value\"]],\"foobar\",[25,\"action\",[[19,0,[]],\"update\",[20,[\"value\"]]],null]]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      (0, _emberPowerSelect.clickTrigger)();
      (0, _testHelpers.triggerEvent)((0, _testHelpers.find)('.ember-power-select-option'), 'mouseup');

      return (0, _testHelpers.settled)().then(() => {
        assert.equal((0, _testHelpers.find)('*').textContent.replace(/[ \n]+/g, '|'), '|bar|×|', 'value updated');
      });
    });

    (0, _qunit.test)('create option', async function (assert) {
      assert.expect(2);

      this.set('value', ['foo']);
      this.actions.update = actual => {
        assert.equal(actual, this.get('value'), 'submitted value is passed to external action');
      };

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "pes7TSnX",
        "block": "{\"symbols\":[],\"statements\":[[1,[25,\"input/md-codelist\",null,[[\"create\",\"value\",\"mdCodeName\",\"change\"],[true,[20,[\"value\"]],\"foobar\",[25,\"action\",[[19,0,[]],\"update\",[20,[\"value\"]]],null]]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      (0, _emberPowerSelect.clickTrigger)();
      (0, _emberPowerSelect.typeInSearch)('biz');
      (0, _testHelpers.triggerEvent)((0, _testHelpers.find)('.ember-power-select-option'), 'mouseup');

      return (0, _testHelpers.settled)().then(() => {
        assert.equal((0, _testHelpers.find)('*').textContent.replace(/[ \n]+/g, '|'), '|biz|×|', 'value updated');
      });
    });
  });
});
define('mdeditor/tests/integration/pods/components/input/md-date-range/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | input/md date range', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "6+2juFS9",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"input/md-date-range\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "jLkNUZxh",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"input/md-date-range\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/input/md-datetime/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | input/md datetime', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('renders and binds', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

      this.set('mydate', '1999-12-31T23:59:59.999+0900');
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "bAl7k7Fb",
        "block": "{\"symbols\":[],\"statements\":[[1,[25,\"input/md-datetime\",null,[[\"date\",\"format\",\"placeholder\"],[[20,[\"mydate\"]],\"YYYY-MM-DD\",\"Enter date\"]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('input').value, '1999-12-31', 'binding works');
    });
  });
});
define('mdeditor/tests/integration/pods/components/input/md-input-confirm/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | input/md input confirm', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "3M5lNWRu",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"input/md-input-confirm\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "eL0jDQk3",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"input/md-input-confirm\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/input/md-input/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | input/md input', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "qLp1smfY",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n      \"],[1,[25,\"input/md-input\",null,[[\"label\",\"value\",\"maxlength\",\"required\",\"inputClass\",\"placeholder\"],[\"Foo\",\"Bar\",100,\"true\",\"test\",\"Enter FooBar\"]]],false],[0,\"\\n    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('label').textContent, 'Foo', 'labeled OK');

      const input = this.$('input');
      const props = [input.prop('required'), input.prop('maxlength'), input.val(), input.prop('placeholder'), input.hasClass('test')];
      assert.deepEqual(props, [true, 100, 'Bar', 'Enter FooBar', true], 'properties set OK');

      // Template block usage:" + EOL +
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "CnKlxvMu",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"input/md-input\",null,null,{\"statements\":[[0,\"        \"],[6,\"p\"],[9,\"class\",\"help-block\"],[7],[0,\"help text\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('.help-block').textContent, 'help text', 'block renders');
    });
  });
});
define('mdeditor/tests/integration/pods/components/input/md-markdown-area/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | input/md markdown area', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "WDcnfuWM",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"input/md-markdown-area\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "Ltu4oWFp",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"input/md-markdown-area\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/input/md-month/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | input/md month', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "JDnpX0Pb",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"input/md-month\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "6HAuTA2f",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"input/md-month\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/input/md-select-contact/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | input/md select contact', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "t8EWVaYY",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"input/md-select-contact\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "B/VACfLw",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"input/md-select-contact\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/input/md-select-contacts/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | input/md select contacts', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "M+FfLap7",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"input/md-select-contacts\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "8wDVLh1f",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"input/md-select-contacts\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/input/md-select-profile/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit', 'mdeditor/tests/helpers/ember-power-select'], function (_testHelpers, _qunit, _emberQunit, _emberPowerSelect) {
  'use strict';

  (0, _qunit.module)('Integration | Component | input/md select profile', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "HG0onW+M",
        "block": "{\"symbols\":[],\"statements\":[[1,[25,\"input/md-select-profile\",null,[[\"value\",\"updateProfile\"],[\"full\",\"updateProfile\"]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.replace(/[ \n]+/g, '|'), '|Profile|full|?|');
    });

    (0, _qunit.test)('should trigger external action on change', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

      // test dummy for the external profile action
      this.set('updateProfile', actual => {
        assert.equal(actual, 'basic', 'submitted value is passed to external action');
      });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "OUdvUPqL",
        "block": "{\"symbols\":[],\"statements\":[[1,[25,\"input/md-select-profile\",null,[[\"value\",\"updateProfile\"],[[20,[\"full\"]],[25,\"action\",[[19,0,[]],[20,[\"updateProfile\"]]],null]]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      // select a value and force an onchange
      (0, _emberPowerSelect.clickTrigger)();
      (0, _testHelpers.triggerEvent)((0, _testHelpers.find)('.ember-power-select-option'), 'mouseup');
    });
  });
});
define('mdeditor/tests/integration/pods/components/input/md-select-thesaurus/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit', 'mdeditor/tests/helpers/ember-power-select'], function (_testHelpers, _qunit, _emberQunit, _emberPowerSelect) {
  'use strict';

  (0, _qunit.module)('Integration | Component | input/md select thesaurus', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "qCDZI9LB",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"input/md-select-thesaurus\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.replace(/[ \n]+/g, '|'), '|Pick|a|thesaurus|');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "ThFIe8O9",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"input/md-select-thesaurus\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.replace(/[ \n]+/g, '|'), '|Pick|a|thesaurus|');
    });

    (0, _qunit.test)('should trigger external action on change', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

      // test dummy for the external profile action
      this.set('selectThesaurus', id => {
        assert.equal(id.citation.identifier[0].identifier, '1eb0ea0a-312c-4d74-8d42-6f1ad758f999', 'submitted value is passed to external action');
      });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "huaGqwin",
        "block": "{\"symbols\":[],\"statements\":[[1,[25,\"input/md-select-thesaurus\",null,[[\"selectThesaurus\"],[[20,[\"selectThesaurus\"]]]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      // select a value and force an onchange
      (0, _emberPowerSelect.clickTrigger)();
      (0, _testHelpers.triggerEvent)((0, _testHelpers.findAll)('.ember-power-select-option')[1], 'mouseup');
    });
  });
});
define('mdeditor/tests/integration/pods/components/input/md-select/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit', 'mdeditor/tests/helpers/ember-power-select'], function (_testHelpers, _qunit, _emberQunit, _emberPowerSelect) {
  'use strict';

  (0, _qunit.module)('Integration | Component | input/md select', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +
      this.set('objArray', [Ember.Object.create({
        id: 1,
        name: 'foo',
        tip: 'bar'
      })]);

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "4LWdOhR8",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n      \"],[1,[25,\"input/md-select\",null,[[\"value\",\"objectArray\",\"valuePath\",\"namePath\",\"tooltipPath\",\"placeholder\"],[1,[20,[\"objArray\"]],\"id\",\"name\",\"tip\",\"Select one\"]]],false],[0,\"\\n    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.replace(/[ \n]+/g, '|'), '|foo|', 'renders ok');
    });

    (0, _qunit.test)('set value', async function (assert) {
      assert.expect(3);

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +
      this.set('objArray', [Ember.Object.create({
        id: 1,
        name: 'foo',
        tip: 'bar'
      }), Ember.Object.create({
        id: 2,
        name: 'baz',
        tip: 'biz'
      })]);

      this.set('value', 1);

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "NoFipOQX",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n      \"],[1,[25,\"input/md-select\",null,[[\"value\",\"objectArray\",\"valuePath\",\"namePath\"],[[20,[\"value\"]],[20,[\"objArray\"]],\"id\",\"name\"]]],false],[0,\"\\n    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.replace(/[ \n]+/g, '|'), '|foo|', 'value set');

      (0, _emberPowerSelect.clickTrigger)();
      (0, _testHelpers.triggerEvent)((0, _testHelpers.findAll)('.ember-power-select-option')[1], 'mouseup');
      return (0, _testHelpers.settled)().then(() => {
        assert.equal((0, _testHelpers.find)('*').textContent.replace(/[ \n]+/g, '|'), '|baz|', 'display value updates');

        assert.equal(this.get('value'), 2, 'value is updated');
      });
    });

    (0, _qunit.test)('create option', async function (assert) {
      assert.expect(3);

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +
      this.set('objArray', [Ember.Object.create({
        id: 1,
        name: 'foo',
        tip: 'bar'
      }), Ember.Object.create({
        id: 2,
        name: 'baz',
        tip: 'biz'
      })]);

      this.set('value', 1);

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "gH/6x77x",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n      \"],[1,[25,\"input/md-select\",null,[[\"value\",\"create\",\"objectArray\",\"valuePath\",\"namePath\"],[[20,[\"value\"]],true,[20,[\"objArray\"]],\"id\",\"name\"]]],false],[0,\"\\n    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.replace(/[ \n]+/g, '|'), '|foo|', 'value set');

      (0, _emberPowerSelect.clickTrigger)();
      (0, _emberPowerSelect.typeInSearch)('biz');
      (0, _testHelpers.triggerEvent)((0, _testHelpers.find)('.ember-power-select-option'), 'mouseup');
      return (0, _testHelpers.settled)().then(() => {
        assert.equal((0, _testHelpers.find)('*').textContent.replace(/[ \n]+/g, '|'), '|biz|', 'display value updates');

        assert.equal(this.get('value'), 'biz', 'value is updated');
      });
    });
  });
});
define('mdeditor/tests/integration/pods/components/input/md-textarea/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | input/md textarea', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "666q13FP",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n      \"],[1,[25,\"input/md-textarea\",null,[[\"value\",\"label\",\"placeholder\",\"rows\"],[\"Foo bar baz\",\"FooBar\",\"placeholder\",10]]],false],[0,\"\\n      \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('textarea').value, 'Foo bar baz');

      assert.equal((0, _testHelpers.find)('label').textContent, 'FooBar', 'label renders');

      // Template block usage:" + EOL +
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "B6drB3E+",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"input/md-textarea\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text', 'block renders');
    });
  });
});
define('mdeditor/tests/integration/pods/components/input/md-toggle/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | input/md toggle', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "453k575J",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"input/md-toggle\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "r9bu1U3d",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"input/md-toggle\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/layout/md-card/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | layout/md card', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "CSI8sDxa",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"layout/md-card\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "M+5H0+hm",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"layout/md-card\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/layout/md-footer/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | layout/md footer', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "ej5BewW2",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"layout/md-footer\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "RWO2fGNn",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"layout/md-footer\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/layout/md-nav-main/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | md nav main', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      assert.expect(2);

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "7sQKbChO",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"layout/md-nav-main\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.replace(/[ \n]+/g, '|'), '|Toggle|navigation|Dashboard|Export|Import|Settings|');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "s9eh9WyK",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"layout/md-nav-main\",null,null,{\"statements\":[[0,\"        template block text \"],[1,[18,\"record/show/edit/nav\"],false],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.replace(/[ \n]+/g, '|'), '|Toggle|navigation|Dashboard|Export|Import|template|block|text|Settings|');
    });
  });
});
define('mdeditor/tests/integration/pods/components/layout/md-nav-secondary/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  //Stub profile service
  const profiles = {
    full: {
      profile: null,
      secondaryNav: [{
        title: 'Foo',
        target: 'record.show.edit.index'

      }, {
        title: 'Bar',
        target: 'record.show.edit.metadata'

      }]
    },
    basic: {
      profile: null,
      secondaryNav: [{
        title: 'FooBar',
        target: 'record.show.edit.index'

      }, {
        title: 'BarFoo',
        target: 'record.show.edit.metadata'

      }]
    }
  };

  const profileStub = Ember.Service.extend({
    getActiveProfile() {
      const active = this.get('active');
      const profile = active && typeof active === 'string' ? active : 'full';
      const profiles = this.get('profiles');

      return profiles[profile];
    },
    profiles: profiles
  });

  (0, _qunit.module)('Integration | Component | md nav secondary', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    hooks.beforeEach(function () {
      this.owner.register('service:profile', profileStub);
      // Calling inject puts the service instance in the test's context,
      // making it accessible as "profileService" within each test
      this.profileService = this.owner.lookup('service:profile');
    });

    (0, _qunit.test)('it renders', async function (assert) {
      assert.expect(2);

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "S3IPATMD",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"layout/md-nav-secondary\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      var more = (0, _testHelpers.findAll)('.overflow-nav').length ? '|More' : '';

      assert.equal((0, _testHelpers.find)('*').textContent.replace(/[ \n]+/g, '|'), more + '|Foo|Bar|');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "ky/fOzqd",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"layout/md-nav-secondary\",null,null,{\"statements\":[[0,\"        \"],[6,\"li\"],[7],[0,\"template block text\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      more = (0, _testHelpers.findAll)('.overflow-nav').length ? '|More' : '';

      assert.equal((0, _testHelpers.find)('*').textContent.replace(/[ \n]+/g, '|'), more + '|Foo|Bar|template|block|text|');
    });

    (0, _qunit.test)('render after setting profile', async function (assert) {
      assert.expect(1);

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      this.set('profileService.active', 'basic');

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "S3IPATMD",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"layout/md-nav-secondary\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      var more = (0, _testHelpers.findAll)('.overflow-nav').length ? '|More' : '';

      assert.equal((0, _testHelpers.find)('*').textContent.replace(/[ \n]+/g, '|'), more + '|FooBar|BarFoo|');
    });
  });
});
define('mdeditor/tests/integration/pods/components/layout/md-nav-sidebar/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit', 'mdeditor/tests/helpers/create-contact', 'mdeditor/tests/helpers/create-record', 'mdeditor/tests/helpers/create-dictionary'], function (_testHelpers, _qunit, _emberQunit, _createContact, _createRecord, _createDictionary) {
  'use strict';

  (0, _qunit.module)('Integration | Component | md nav sidebar', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      assert.expect(1);

      const contacts = (0, _createContact.default)(2);
      contacts.meta = {
        type: 'contact',
        list: 'contacts',
        title: 'Contacts'
      };

      const records = (0, _createRecord.default)(2);
      records.meta = {
        type: 'record',
        list: 'records',
        title: 'Records'
      };

      const dicts = (0, _createDictionary.default)(2);
      dicts.meta = {
        type: 'dictionary',
        list: 'dictionaries',
        title: 'Dictionaries'
      };

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      this.set('model', [records, contacts, dicts]);

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "KSMvTrkL",
        "block": "{\"symbols\":[],\"statements\":[[1,[25,\"layout/md-nav-sidebar\",null,[[\"items\",\"version\"],[[20,[\"model\"]],\"test\"]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.replace(/[ \n]+/g, '|'), '|mdditorvtest|Records|(2)|My|Record0|My|Record1|Contacts|(2)|Contact0|Contact1|Dictionaries|(2)|My|Dictionary0|My|Dictionary1|');
    });

    (0, _qunit.test)('toggle help action', async function (assert) {
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "n3NhbD47",
        "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"id\",\"md-sidebar-wrapper\"],[7],[1,[18,\"layout/md-nav-sidebar\"],false],[8]],\"hasEval\":false}",
        "meta": {}
      }));
      await (0, _testHelpers.click)('#md-btn-help');
      assert.ok((0, _testHelpers.find)('#md-sidebar-wrapper').classList.contains('help'));
    });

    (0, _qunit.test)('toggle sidebar action', async function (assert) {
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "Wr6J0SD7",
        "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"id\",\"md-wrapper\"],[7],[6,\"div\"],[9,\"id\",\"md-sidebar-wrapper\"],[7],[1,[18,\"layout/md-nav-sidebar\"],false],[8],[8]],\"hasEval\":false}",
        "meta": {}
      }));
      await (0, _testHelpers.click)('.sidebar-brand-link');
      assert.ok((0, _testHelpers.find)('#md-wrapper').classList.contains('toggled'));
    });
  });
});
define('mdeditor/tests/integration/pods/components/layout/md-slider/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | layout/md slider', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "22l3UMoH",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"layout/md-slider\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "fqyUhYX0",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"layout/md-slider\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/layout/md-wrap/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | layout/md wrap', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "ktl7YtnS",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"layout/md-wrap\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "Btzwd13U",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"layout/md-wrap\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/md-help/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | md help', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      assert.expect(2);

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "ycYFAtTz",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"md-help\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.ok((0, _testHelpers.find)('*').textContent.indexOf('Lorem ipsum' > 0));

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "mDCBuwo3",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"md-help\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.ok((0, _testHelpers.find)('*').textContent.trim().indexOf('template block text' > 0));
    });
  });
});
define('mdeditor/tests/integration/pods/components/md-models-table/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | md models table', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "2QG2pO0U",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"md-models-table\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "HFawtjvi",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"md-models-table\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/md-models-table/components/check-all/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | md models table/components/check all', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "pq3XQQym",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"md-models-table/components/check-all\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "xwLd9HXZ",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"md-models-table/components/check-all\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/md-models-table/components/check/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | md models table/components/check', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "HTf0S+bQ",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"md-models-table/components/check\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "vzjRZrkF",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"md-models-table/components/check\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/md-title/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | md title', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "PcS8ZzJ7",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"md-title\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "i7KE7rEm",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"md-title\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/md-translate/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | md translate', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "c+as3mJq",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"md-translate\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "1qFgffnw",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"md-translate\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-address/md-address-block/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md address/md address block', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "Zzk1n9i9",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-address/md-address-block\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "mY60hbSQ",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-address/md-address-block\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-allocation/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md allocation', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "8gHY20Ea",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-allocation\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "OpNYYqst",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-allocation\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-array-table/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md array table', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "LjbFYwdU",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-array-table\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "l7RfaUYx",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-array-table\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-associated/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md associated', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "ZvlsJYM/",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-associated\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "RfFDQ2EC",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-associated\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-associated/preview/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md associated/preview', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "DYWubGrz",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-associated/preview\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "s0F91Sf5",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-associated/preview\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-attribute/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md attribute', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "QXdXFrGg",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-attribute\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "2r5cb7XN",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-attribute\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-attribute/preview/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md attribute/preview', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "xLgDD0mU",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-attribute/preview\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "HPK37VsD",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-attribute/preview\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-bbox/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md bbox', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "PpIRdLM/",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-bbox\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "Xciy7Cjz",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-bbox\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-citation-array/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md citation array', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "K/NBqIVp",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-citation-array\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "8LMMQcD1",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-citation-array\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-citation/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md citation', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "Ki3rSMDp",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-citation\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "3mR9K3MQ",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-citation\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-citation/preview/body/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md citation/preview/body', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "uII2hb0d",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-citation/preview/body\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "sUcR8ZyH",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-citation/preview/body\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-citation/preview/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md citation/preview', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "djcvSV+t",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-citation/preview\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "2DnwUCVu",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-citation/preview\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-constraint/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md constraint', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "Uinwe+xT",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-constraint\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "2+8tjJsb",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-constraint\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-date-array/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md date array', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "8MibG97P",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-date-array\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "jC3l5pap",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-date-array\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-date/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md date', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "pSklZ30Y",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-date\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "/AcDRj3F",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-date\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-distribution/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md distribution', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "RTRW3adT",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-distribution\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "mtyviVYN",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-distribution\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-distributor/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md distributor', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "7QSpsZga",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-distributor\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "5OavlLyx",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-distributor\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-distributor/preview/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md distributor/preview', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "c0ZOpqwO",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-distributor/preview\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "THGaBF/W",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-distributor/preview\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-documentation/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md documentation', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "9Zk1JiSz",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-documentation\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "u7JXV7ty",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-documentation\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-documentation/preview/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md documentation/preview', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "BBv1I11G",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-documentation/preview\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "Jk/k2B0V",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-documentation/preview\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-domain/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md domain', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "ewqNDitB",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-domain\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "CWUiXEVf",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-domain\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-domainitem/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md domainitem', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "iUe++eq7",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-domainitem\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "NkABG9Ct",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-domainitem\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-domainitem/preview/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md domainitem/preview', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "Ta0LxPvz",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-domainitem/preview\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "n+uqTJGF",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-domainitem/preview\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-entity/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md entity', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "BNvLfPjj",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-entity\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "/9bPUjE5",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-entity\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-funding/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md funding', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "Nl5fQm2K",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-funding\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "ZC04ovCS",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-funding\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-funding/preview/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md funding/preview', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "I08a2/T/",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-funding/preview\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "4b9OWNk9",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-funding/preview\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-graphic-array/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md graphic array', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "Z1jGEc2M",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-graphic-array\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "Dvt6xAw6",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-graphic-array\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-identifier-array/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md identifier array', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "7vWx6rhH",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-identifier-array\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "4eUPH/Qb",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-identifier-array\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-identifier-object-table/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md identifier object table', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "poJE0W+k",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-identifier-object-table\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "e+6pAH/T",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-identifier-object-table\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-identifier/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md identifier', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "hGrirX7R",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-identifier\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "fWvg+CcG",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-identifier\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-keyword-citation/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md keyword citation', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "SorZVSbO",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-keyword-citation\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "hHT6Ro1P",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-keyword-citation\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-keyword-list/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md keyword list', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      this.set('model', {
        'keyword': [{
          'identifier': 'id1',
          'keyword': 'foo1',
          'path': ['foo1']
        }, {
          'identifier': 'id2',
          'keyword': 'bar1',
          'path': ['foo1', 'bar1']
        }]
      });
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "PD/YcUCG",
        "block": "{\"symbols\":[],\"statements\":[[1,[25,\"object/md-keyword-list\",null,[[\"model\"],[[20,[\"model\"]]]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.replace(/[ \n]+/g, '|').trim(), '|Delete|foo1|Delete|bar1|');

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "I4PaXnlW",
        "block": "{\"symbols\":[],\"statements\":[[1,[25,\"object/md-keyword-list\",null,[[\"model\",\"readOnly\"],[[20,[\"model\"]],false]]],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.findAll)('tr').length, 4, 'Check number of rows.');
      assert.equal((0, _testHelpers.findAll)('input').length, 4, 'Check number of input el.');
      assert.equal(this.$('input')[2].value, 'bar1', 'Correct value for keyword input.');
      assert.equal(this.$('input')[3].value, 'id2', 'Correct value for id input.');
      assert.equal((0, _testHelpers.find)('*').textContent.replace(/[ \n]+/g, '|').trim(), '|Keyword|Id|(Optional)|Delete|Delete|Add|Keyword|', 'readOnly = false.');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "32aKsT5k",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-keyword-list\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.replace(/[ \n]+/g, '|').trim(), '|Add|some|keywords.|template|block|text|', 'Block form renders.');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-lineage/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md lineage', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "1ogBDacq",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-lineage\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "6Jwm43iv",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-lineage\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-lineage/preview/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md lineage/preview', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "7XNDGcbw",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-lineage/preview\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "cT/yHJQu",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-lineage/preview\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-locale-array/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md locale array', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "0IRUzuX7",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-locale-array\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "RpEtvD8W",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-locale-array\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-locale/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md locale', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "DhC0P3Yq",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-locale\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "gw8acWu8",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-locale\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-maintenance/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md maintenance', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "qkmgQDdL",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-maintenance\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "E5F1mT7c",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-maintenance\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-medium/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md medium', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "g1/YavqN",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-medium\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "KxxSNq/D",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-medium\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-objectroute-table/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md objectroute table', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "bi7r1pxJ",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-objectroute-table\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "327cfRrB",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-objectroute-table\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-online-resource/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md online resource', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "gasNweQc",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-online-resource\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "mMZELtWz",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-online-resource\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-party-array/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md party', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "empqurYF",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-party-array\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "mo/dm2Z0",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-party-array\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-party/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md party', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "aNgeb0eO",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-party\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "mltt2Maj",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-party\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-process-step/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md process step', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "R9ICg+97",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-process-step\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "wGE0vu+I",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-process-step\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-repository-array/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md repository array', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "7wVHc1UT",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-repository-array\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "dxowweel",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-repository-array\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-resource-type-array/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md resource type array', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "Cs2ldKzE",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-resource-type-array\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "v2xI7RL7",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-resource-type-array\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-simple-array-table/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md simple array table', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "cfzjKS1L",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-simple-array-table\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "PpN+CBSi",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-simple-array-table\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-source/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md source', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "k084dJ8P",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-source\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "uzEG3mPm",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-source\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-source/preview/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md source/preview', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "+YcT2MVB",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-source/preview\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "bjR8PzXG",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-source/preview\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-spatial-extent/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md spatial extent', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "y0tn821q",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-spatial-extent\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "mpdPUss7",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-spatial-extent\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-spatial-info/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md spatial info', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "OTvHV0n6",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-spatial-info\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "qEGSNYNJ",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-spatial-info\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-spatial-resolution/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md spatial resolution', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "J2ehxRSw",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-spatial-resolution\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "eB3V1t5h",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-spatial-resolution\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-srs/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md srs', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "tpqxPz3U",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-srs\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "D2H4iH1J",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-srs\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-taxonomy/classification/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md taxonomy/classification', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "SBfyzrBS",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-taxonomy/classification\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "lguY3oHx",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-taxonomy/classification\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-taxonomy/classification/taxon/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md taxonomy/classification/taxon', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "n2cRMJu6",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-taxonomy/classification/taxon\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "WVyRpWUB",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-taxonomy/classification/taxon\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-taxonomy/collection/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md taxonomy/collection', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "MZ1UC7Lo",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-taxonomy/collection\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "g2QryW6N",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-taxonomy/collection\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-taxonomy/collection/system/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md taxonomy/collection/system', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "e5J5a/Hi",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-taxonomy/collection/system\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "igZAN1lT",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-taxonomy/collection/system\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-taxonomy/collection/system/preview/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md taxonomy/collection/system/preview', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "+306W8BY",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-taxonomy/collection/system/preview\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "WZnYo2jM",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-taxonomy/collection/system/preview\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-taxonomy/collection/voucher/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md taxonomy/collection/voucher', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "nGBHUkTL",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-taxonomy/collection/voucher\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "yKDhLO+X",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-taxonomy/collection/voucher\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-taxonomy/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md taxonomy', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "IHv6JXoK",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-taxonomy\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "HDyTEyIi",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-taxonomy\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-time-period/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md time period', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "yhYFxxUP",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-time-period\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "8gyQoiwg",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-time-period\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/integration/pods/components/object/md-transfer/component-test', ['@ember/test-helpers', 'qunit', 'ember-qunit'], function (_testHelpers, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Integration | Component | object/md transfer', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {

      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "x5rPehFX",
        "block": "{\"symbols\":[],\"statements\":[[1,[18,\"object/md-transfer\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "A5I8188A",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"object/md-transfer\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal((0, _testHelpers.find)('*').textContent.trim(), 'template block text');
    });
  });
});
define('mdeditor/tests/test-helper', ['mdeditor/app', 'mdeditor/config/environment', '@ember/test-helpers', 'ember-qunit'], function (_app, _environment, _testHelpers, _emberQunit) {
  'use strict';

  (0, _testHelpers.setApplication)(_app.default.create(_environment.default.APP));

  (0, _emberQunit.start)();
});
define('mdeditor/tests/tests.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | tests');

  QUnit.test('acceptance/pods/components/layout/md-breadcrumb-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/pods/components/layout/md-breadcrumb-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/pods/contact/new-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/pods/contact/new-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/pods/contacts/contacts-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/pods/contacts/contacts-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/pods/dictionary/new-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/pods/dictionary/new-test.js should pass ESLint\n\n');
  });

  QUnit.test('acceptance/pods/record/new-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'acceptance/pods/record/new-test.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/create-contact.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/create-contact.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/create-dictionary.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/create-dictionary.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/create-map-layer.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/create-map-layer.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/create-record.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/create-record.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/destroy-app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/destroy-app.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/flash-message.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/flash-message.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/modal-asserts.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/modal-asserts.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/start-app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/start-app.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/feature-form-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/feature-form-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/feature-group-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/feature-group-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/feature-table-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/feature-table-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/geojson-layer-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/geojson-layer-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/leaflet-draw-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/leaflet-draw-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/leaflet-table-row-actions-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/leaflet-table-row-actions-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/leaflet-table-row-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/leaflet-table-row-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/leaflet-table-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/leaflet-table-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/sb-publisher-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/sb-publisher-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/sb-settings-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/sb-settings-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/sb-tree-label-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/sb-tree-label-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/sb-tree-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/sb-tree-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/tree-branch-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/tree-branch-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/tree-label-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/tree-label-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/tree-leaf-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/tree-leaf-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/tree-search-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/tree-search-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/tree-view-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/tree-view-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/helpers/present-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/helpers/present-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/helpers/word-limit-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/helpers/word-limit-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/control/md-button-confirm/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/control/md-button-confirm/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/control/md-button-modal/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/control/md-button-modal/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/control/md-contact-link/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/control/md-contact-link/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/control/md-contact-title/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/control/md-contact-title/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/control/md-crud-buttons/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/control/md-crud-buttons/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/control/md-definition/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/control/md-definition/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/control/md-errors/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/control/md-errors/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/control/md-fiscalyear/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/control/md-fiscalyear/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/control/md-import-csv/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/control/md-import-csv/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/control/md-itis/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/control/md-itis/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/control/md-json-button/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/control/md-json-button/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/control/md-json-viewer/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/control/md-json-viewer/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/control/md-modal/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/control/md-modal/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/control/md-record-table/buttons/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/control/md-record-table/buttons/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/control/md-record-table/buttons/custom/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/control/md-record-table/buttons/custom/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/control/md-record-table/buttons/filter/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/control/md-record-table/buttons/filter/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/control/md-record-table/buttons/show/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/control/md-record-table/buttons/show/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/control/md-record-table/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/control/md-record-table/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/control/md-repo-link/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/control/md-repo-link/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/control/md-scroll-spy/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/control/md-scroll-spy/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/control/md-select-table/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/control/md-select-table/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/control/md-spinner/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/control/md-spinner/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/control/md-spotlight/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/control/md-spotlight/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/control/md-status/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/control/md-status/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/control/subbar-citation/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/control/subbar-citation/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/control/subbar-extent/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/control/subbar-extent/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/control/subbar-importcsv/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/control/subbar-importcsv/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/control/subbar-keywords/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/control/subbar-keywords/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/control/subbar-link/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/control/subbar-link/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/control/subbar-spatial/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/control/subbar-spatial/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/control/subbar-thesaurus/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/control/subbar-thesaurus/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/ember-tooltip/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/ember-tooltip/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/input/md-boolean/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/input/md-boolean/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/input/md-codelist-multi/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/input/md-codelist-multi/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/input/md-codelist/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/input/md-codelist/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/input/md-date-range/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/input/md-date-range/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/input/md-datetime/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/input/md-datetime/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/input/md-input-confirm/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/input/md-input-confirm/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/input/md-input/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/input/md-input/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/input/md-markdown-area/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/input/md-markdown-area/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/input/md-month/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/input/md-month/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/input/md-select-contact/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/input/md-select-contact/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/input/md-select-contacts/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/input/md-select-contacts/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/input/md-select-profile/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/input/md-select-profile/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/input/md-select-thesaurus/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/input/md-select-thesaurus/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/input/md-select/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/input/md-select/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/input/md-textarea/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/input/md-textarea/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/input/md-toggle/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/input/md-toggle/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/layout/md-card/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/layout/md-card/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/layout/md-footer/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/layout/md-footer/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/layout/md-nav-main/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/layout/md-nav-main/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/layout/md-nav-secondary/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/layout/md-nav-secondary/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/layout/md-nav-sidebar/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/layout/md-nav-sidebar/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/layout/md-slider/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/layout/md-slider/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/layout/md-wrap/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/layout/md-wrap/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/md-help/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/md-help/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/md-models-table/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/md-models-table/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/md-models-table/components/check-all/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/md-models-table/components/check-all/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/md-models-table/components/check/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/md-models-table/components/check/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/md-title/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/md-title/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/md-translate/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/md-translate/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-address/md-address-block/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-address/md-address-block/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-allocation/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-allocation/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-array-table/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-array-table/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-associated/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-associated/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-associated/preview/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-associated/preview/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-attribute/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-attribute/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-attribute/preview/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-attribute/preview/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-bbox/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-bbox/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-citation-array/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-citation-array/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-citation/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-citation/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-citation/preview/body/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-citation/preview/body/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-citation/preview/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-citation/preview/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-constraint/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-constraint/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-date-array/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-date-array/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-date/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-date/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-distribution/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-distribution/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-distributor/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-distributor/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-distributor/preview/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-distributor/preview/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-documentation/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-documentation/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-documentation/preview/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-documentation/preview/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-domain/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-domain/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-domainitem/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-domainitem/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-domainitem/preview/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-domainitem/preview/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-entity/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-entity/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-funding/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-funding/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-funding/preview/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-funding/preview/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-graphic-array/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-graphic-array/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-identifier-array/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-identifier-array/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-identifier-object-table/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-identifier-object-table/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-identifier/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-identifier/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-keyword-citation/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-keyword-citation/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-keyword-list/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-keyword-list/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-lineage/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-lineage/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-lineage/preview/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-lineage/preview/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-locale-array/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-locale-array/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-locale/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-locale/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-maintenance/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-maintenance/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-medium/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-medium/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-objectroute-table/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-objectroute-table/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-online-resource/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-online-resource/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-party-array/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-party-array/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-party/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-party/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-process-step/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-process-step/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-repository-array/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-repository-array/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-resource-type-array/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-resource-type-array/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-simple-array-table/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-simple-array-table/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-source/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-source/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-source/preview/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-source/preview/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-spatial-extent/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-spatial-extent/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-spatial-info/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-spatial-info/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-spatial-resolution/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-spatial-resolution/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-srs/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-srs/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-taxonomy/classification/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-taxonomy/classification/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-taxonomy/classification/taxon/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-taxonomy/classification/taxon/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-taxonomy/collection/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-taxonomy/collection/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-taxonomy/collection/system/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-taxonomy/collection/system/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-taxonomy/collection/system/preview/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-taxonomy/collection/system/preview/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-taxonomy/collection/voucher/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-taxonomy/collection/voucher/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-taxonomy/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-taxonomy/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-time-period/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-time-period/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/pods/components/object/md-transfer/component-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/pods/components/object/md-transfer/component-test.js should pass ESLint\n\n');
  });

  QUnit.test('test-helper.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass ESLint\n\n');
  });

  QUnit.test('unit/adapters/application-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/adapters/application-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/helpers/bbox-to-poly-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/helpers/bbox-to-poly-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/helpers/get-dash-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/helpers/get-dash-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/helpers/make-range-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/helpers/make-range-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/helpers/md-markdown-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/helpers/md-markdown-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/helpers/mod-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/helpers/mod-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/initializers/leaflet-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/initializers/leaflet-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/initializers/local-storage-export-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/initializers/local-storage-export-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/instance-initializers/profile-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/instance-initializers/profile-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/instance-initializers/route-publish-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/instance-initializers/route-publish-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/instance-initializers/settings-sciencebase-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/instance-initializers/settings-sciencebase-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/instance-initializers/settings-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/instance-initializers/settings-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/mixins/hash-poll-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/mixins/hash-poll-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/mixins/object-template-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/mixins/object-template-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/mixins/scroll-to-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/mixins/scroll-to-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/models/base-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/base-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/models/contact-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/contact-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/models/dictionary-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/dictionary-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/models/record-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/record-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/models/setting-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/models/setting-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/contact/new/id/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/contact/new/id/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/contact/new/index/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/contact/new/index/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/contact/show/edit/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/contact/show/edit/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/contact/show/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/contact/show/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/contacts/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/contacts/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/dashboard/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/dashboard/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/dictionaries/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/dictionaries/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/dictionary/new/id/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/dictionary/new/id/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/dictionary/new/index/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/dictionary/new/index/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/dictionary/show/edit/citation/identifier/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/dictionary/show/edit/citation/identifier/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/dictionary/show/edit/citation/index/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/dictionary/show/edit/citation/index/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/dictionary/show/edit/citation/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/dictionary/show/edit/citation/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/dictionary/show/edit/domain/edit/citation/identifier/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/dictionary/show/edit/domain/edit/citation/identifier/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/dictionary/show/edit/domain/edit/citation/index/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/dictionary/show/edit/domain/edit/citation/index/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/dictionary/show/edit/domain/edit/citation/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/dictionary/show/edit/domain/edit/citation/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/dictionary/show/edit/domain/edit/index/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/dictionary/show/edit/domain/edit/index/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/dictionary/show/edit/domain/edit/item/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/dictionary/show/edit/domain/edit/item/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/dictionary/show/edit/domain/edit/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/dictionary/show/edit/domain/edit/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/dictionary/show/edit/domain/index/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/dictionary/show/edit/domain/index/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/dictionary/show/edit/domain/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/dictionary/show/edit/domain/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/dictionary/show/edit/entity/edit/attribute/index/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/dictionary/show/edit/entity/edit/attribute/index/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/dictionary/show/edit/entity/edit/attribute/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/dictionary/show/edit/entity/edit/attribute/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/dictionary/show/edit/entity/edit/citation/identifier/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/dictionary/show/edit/entity/edit/citation/identifier/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/dictionary/show/edit/entity/edit/citation/index/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/dictionary/show/edit/entity/edit/citation/index/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/dictionary/show/edit/entity/edit/citation/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/dictionary/show/edit/entity/edit/citation/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/dictionary/show/edit/entity/edit/index/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/dictionary/show/edit/entity/edit/index/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/dictionary/show/edit/entity/edit/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/dictionary/show/edit/entity/edit/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/dictionary/show/edit/entity/import/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/dictionary/show/edit/entity/import/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/dictionary/show/edit/entity/index/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/dictionary/show/edit/entity/index/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/dictionary/show/edit/entity/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/dictionary/show/edit/entity/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/dictionary/show/edit/index/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/dictionary/show/edit/index/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/dictionary/show/edit/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/dictionary/show/edit/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/dictionary/show/index/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/dictionary/show/index/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/dictionary/show/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/dictionary/show/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/error/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/error/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/export/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/export/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/help/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/help/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/import/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/import/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/not-found/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/not-found/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/publish/index/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/publish/index/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/publish/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/publish/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/index/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/index/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/new/id/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/new/id/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/new/index/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/new/index/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/associated/index/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/associated/index/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/associated/resource/index/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/associated/resource/index/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/associated/resource/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/associated/resource/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/associated/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/associated/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/constraint/index/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/constraint/index/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/constraint/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/constraint/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/coverages/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/coverages/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/dictionary/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/dictionary/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/distribution/distributor/index/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/distribution/distributor/index/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/distribution/distributor/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/distribution/distributor/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/distribution/index/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/distribution/index/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/distribution/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/distribution/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/documents/citation/index/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/documents/citation/index/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/documents/citation/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/documents/citation/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/documents/index/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/documents/index/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/documents/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/documents/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/funding/allocation/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/funding/allocation/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/funding/index/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/funding/index/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/funding/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/funding/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/grid/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/grid/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/index/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/index/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/keywords/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/keywords/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/keywords/thesaurus/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/keywords/thesaurus/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/lineage/lineageobject/citation/identifier/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/lineage/lineageobject/citation/identifier/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/lineage/lineageobject/citation/index/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/lineage/lineageobject/citation/index/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/lineage/lineageobject/citation/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/lineage/lineageobject/citation/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/lineage/lineageobject/index/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/lineage/lineageobject/index/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/lineage/lineageobject/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/lineage/lineageobject/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/lineage/lineageobject/source/index/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/lineage/lineageobject/source/index/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/lineage/lineageobject/source/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/lineage/lineageobject/source/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/lineage/lineageobject/step/citation/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/lineage/lineageobject/step/citation/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/lineage/lineageobject/step/index/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/lineage/lineageobject/step/index/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/lineage/lineageobject/step/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/lineage/lineageobject/step/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/main/citation/identifier/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/main/citation/identifier/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/main/citation/index/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/main/citation/index/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/main/citation/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/main/citation/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/main/index/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/main/index/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/main/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/main/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/metadata/alternate/identifier/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/metadata/alternate/identifier/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/metadata/alternate/index/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/metadata/alternate/index/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/metadata/alternate/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/metadata/alternate/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/metadata/identifier/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/metadata/identifier/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/metadata/index/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/metadata/index/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/metadata/parent/identifier/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/metadata/parent/identifier/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/metadata/parent/index/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/metadata/parent/index/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/metadata/parent/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/metadata/parent/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/metadata/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/metadata/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/spatial/extent/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/spatial/extent/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/spatial/index/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/spatial/index/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/spatial/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/spatial/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/taxonomy/collection/index/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/taxonomy/collection/index/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/taxonomy/collection/itis/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/taxonomy/collection/itis/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/taxonomy/collection/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/taxonomy/collection/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/taxonomy/collection/system/index/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/taxonomy/collection/system/index/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/taxonomy/collection/system/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/taxonomy/collection/system/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/taxonomy/index/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/taxonomy/index/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/edit/taxonomy/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/edit/taxonomy/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/index/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/index/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/record/show/translate/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/record/show/translate/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/records/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/records/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/settings/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/settings/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/pods/translate/route-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/translate/route-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/application-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/application-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/index-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/index-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/publish/sciencebase-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/publish/sciencebase-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/serializers/application-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/serializers/application-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/services/cleaner-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/cleaner-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/services/codelist-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/codelist-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/services/contacts-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/contacts-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/services/icon-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/icon-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/services/itis-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/itis-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/services/jsonvalidator-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/jsonvalidator-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/services/keyword-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/keyword-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/services/mdjson-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/mdjson-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/services/patch-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/patch-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/services/profile-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/profile-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/services/publish-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/publish-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/services/settings-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/settings-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/services/slider-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/slider-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/services/spotlight-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/spotlight-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/transforms/json-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/transforms/json-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/utils/config-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/utils/config-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/utils/sb-tree-node-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/utils/sb-tree-node-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/validators/array-required-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/validators/array-required-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/validators/array-valid-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/validators/array-valid-test.js should pass ESLint\n\n');
  });
});
define('mdeditor/tests/unit/adapters/application-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Adapter | application', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    // Replace this with your real tests.
    (0, _qunit.test)('it exists', function (assert) {
      var adapter = this.owner.lookup('adapter:application');
      assert.ok(adapter);
    });

    (0, _qunit.test)('it has a importData method', function (assert) {
      var adapter = this.owner.lookup('adapter:application');
      assert.ok(typeof adapter.importData === 'function');
    });

    (0, _qunit.test)('it has a exportData method', function (assert) {
      var adapter = this.owner.lookup('adapter:application');
      assert.ok(typeof adapter.exportData === 'function');
    });
  });
});
define('mdeditor/tests/unit/helpers/bbox-to-poly-test', ['mdeditor/helpers/bbox-to-poly', 'qunit'], function (_bboxToPoly, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Helper | bbox to poly', function () {
    // Replace this with your real tests.
    (0, _qunit.test)('it works', function (assert) {
      let result = (0, _bboxToPoly.bboxToPoly)([42]);
      assert.ok(result);
    });
  });
});
define('mdeditor/tests/unit/helpers/get-dash-test', ['mdeditor/helpers/get-dash', 'qunit'], function (_getDash, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Helper | get dash', function () {
    // Replace this with your real tests.
    (0, _qunit.test)('it works', function (assert) {
      let result = (0, _getDash.getDash)([42]);
      assert.ok(result);
    });
  });
});
define('mdeditor/tests/unit/helpers/make-range-test', ['mdeditor/helpers/make-range', 'qunit'], function (_makeRange, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Helper | make range', function () {
    // Replace this with your real tests.
    (0, _qunit.test)('it works', function (assert) {
      let result = (0, _makeRange.makeRange)([42]);
      assert.ok(result);
    });
  });
});
define('mdeditor/tests/unit/helpers/md-markdown-test', ['mdeditor/helpers/md-markdown', 'qunit'], function (_mdMarkdown, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Helper | md markdown', function () {
    // Replace this with your real tests.
    (0, _qunit.test)('it works', function (assert) {
      let result = (0, _mdMarkdown.mdMarkdown)([42]);
      assert.ok(result);
    });
  });
});
define('mdeditor/tests/unit/helpers/mod-test', ['mdeditor/helpers/mod', 'qunit'], function (_mod, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Helper | mod', function () {
    // Replace this with your real tests.
    (0, _qunit.test)('it works', function (assert) {
      let result = (0, _mod.mod)([42]);
      assert.ok(result);
    });
  });
});
define('mdeditor/tests/unit/initializers/leaflet-test', ['mdeditor/initializers/leaflet', 'qunit'], function (_leaflet, _qunit) {
  'use strict';

  let application;

  (0, _qunit.module)('Unit | Initializer | leaflet', function (hooks) {
    hooks.beforeEach(function () {
      Ember.run(function () {
        application = Ember.Application.create();
        application.deferReadiness();
      });
    });

    // Replace this with your real tests.
    (0, _qunit.test)('it works', function (assert) {
      _leaflet.default.initialize(application);

      // you would normally confirm the results of the initializer here
      assert.ok(true);
    });
  });
});
define('mdeditor/tests/unit/initializers/local-storage-export-test', ['mdeditor/initializers/local-storage-export', 'qunit', 'mdeditor/tests/helpers/destroy-app'], function (_localStorageExport, _qunit, _destroyApp) {
  'use strict';

  (0, _qunit.module)('Unit | Initializer | local storage export', function (hooks) {
    hooks.beforeEach(function () {
      Ember.run(() => {
        this.application = Ember.Application.create();
        this.application.deferReadiness();
      });
    });

    hooks.afterEach(function () {
      (0, _destroyApp.default)(this.application);
    });

    // Replace this with your real tests.
    (0, _qunit.test)('it works', function (assert) {
      (0, _localStorageExport.initialize)(this.application);

      // you would normally confirm the results of the initializer here
      assert.ok(true);
    });
  });
});
define('mdeditor/tests/unit/instance-initializers/profile-test', ['mdeditor/instance-initializers/profile', 'qunit', 'mdeditor/tests/helpers/destroy-app'], function (_profile, _qunit, _destroyApp) {
  'use strict';

  (0, _qunit.module)('Unit | Instance Initializer | profile', function (hooks) {
    hooks.beforeEach(function () {
      Ember.run(() => {
        this.application = Ember.Application.create();
        this.appInstance = this.application.buildInstance();
      });
    });

    hooks.afterEach(function () {
      Ember.run(this.appInstance, 'destroy');
      (0, _destroyApp.default)(this.application);
    });

    // Replace this with your real tests.
    (0, _qunit.test)('it works', function (assert) {
      (0, _profile.initialize)(this.appInstance);

      // you would normally confirm the results of the initializer here
      assert.ok(true);
    });
  });
});
define('mdeditor/tests/unit/instance-initializers/route-publish-test', ['mdeditor/instance-initializers/route-publish', 'qunit', 'mdeditor/tests/helpers/destroy-app'], function (_routePublish, _qunit, _destroyApp) {
  'use strict';

  (0, _qunit.module)('Unit | Instance Initializer | route publish', function (hooks) {
    hooks.beforeEach(function () {
      Ember.run(() => {
        this.application = Ember.Application.create();
        this.appInstance = this.application.buildInstance();
      });
    });

    hooks.afterEach(function () {
      Ember.run(this.appInstance, 'destroy');
      (0, _destroyApp.default)(this.application);
    });

    // Replace this with your real tests.
    (0, _qunit.test)('it works', function (assert) {
      (0, _routePublish.initialize)(this.appInstance);

      // you would normally confirm the results of the initializer here
      assert.ok(true);
    });
  });
});
define('mdeditor/tests/unit/instance-initializers/settings-sciencebase-test', ['mdeditor/instance-initializers/settings-sciencebase', 'qunit', 'mdeditor/tests/helpers/destroy-app'], function (_settingsSciencebase, _qunit, _destroyApp) {
  'use strict';

  (0, _qunit.module)('Unit | Instance Initializer | settings sciencebase', function (hooks) {
    hooks.beforeEach(function () {
      Ember.run(() => {
        this.application = Ember.Application.create();
        this.appInstance = this.application.buildInstance();
      });
    });

    hooks.afterEach(function () {
      Ember.run(this.appInstance, 'destroy');
      (0, _destroyApp.default)(this.application);
    });

    // Replace this with your real tests.
    (0, _qunit.test)('it works', function (assert) {
      (0, _settingsSciencebase.initialize)(this.appInstance);

      // you would normally confirm the results of the initializer here
      assert.ok(true);
    });
  });
});
define('mdeditor/tests/unit/instance-initializers/settings-test', ['mdeditor/instance-initializers/settings', 'qunit', 'mdeditor/tests/helpers/destroy-app'], function (_settings, _qunit, _destroyApp) {
  'use strict';

  (0, _qunit.module)('Unit | Instance Initializer | settings', function (hooks) {
    hooks.beforeEach(function () {
      Ember.run(() => {
        this.application = Ember.Application.create();
        this.appInstance = this.application.buildInstance();
      });
    });

    hooks.afterEach(function () {
      Ember.run(this.appInstance, 'destroy');
      (0, _destroyApp.default)(this.application);
    });

    // Replace this with your real tests.
    (0, _qunit.test)('it works', function (assert) {
      (0, _settings.initialize)(this.appInstance);

      // you would normally confirm the results of the initializer here
      assert.ok(true);
    });
  });
});
define('mdeditor/tests/unit/mixins/hash-poll-test', ['mdeditor/mixins/hash-poll', 'qunit'], function (_hashPoll, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Mixin | hash poll', function () {
    // Replace this with your real tests.
    (0, _qunit.test)('it works', function (assert) {
      let HashPollObject = Ember.Object.extend(_hashPoll.default);
      let subject = HashPollObject.create();
      assert.ok(subject);
    });
  });
});
define('mdeditor/tests/unit/mixins/object-template-test', ['mdeditor/mixins/object-template', 'qunit'], function (_objectTemplate, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Mixin | object template', function () {
    // Replace this with your real tests.
    (0, _qunit.test)('it works', function (assert) {
      let ObjectTemplateObject = Ember.Object.extend(_objectTemplate.default);
      let subject = ObjectTemplateObject.create();
      assert.ok(subject);
    });
  });
});
define('mdeditor/tests/unit/mixins/scroll-to-test', ['mdeditor/mixins/scroll-to', 'qunit'], function (_scrollTo, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Mixin | scroll to', function () {
    // Replace this with your real tests.
    (0, _qunit.test)('it works', function (assert) {
      let ScrollToObject = Ember.Object.extend(_scrollTo.default);
      let subject = ScrollToObject.create();
      assert.ok(subject);
    });
  });
});
define('mdeditor/tests/unit/models/base-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Model | base', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let model = Ember.run(() => this.owner.lookup('service:store').modelFor('base'));
      // let store = this.store();
      assert.equal(model.modelName, 'base');
    });
  });
});
define('mdeditor/tests/unit/models/contact-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Model | contact', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let model = Ember.run(() => this.owner.lookup('service:store').createRecord('contact'));
      // var store = this.store();
      assert.ok(!!model);
    });

    (0, _qunit.test)('should correctly compute title', function (assert) {
      const me = Ember.run(() => this.owner.lookup('service:store').createRecord('contact'));

      assert.expect(3);
      me.set('json.name', 'bar');
      me.set('json.positionName', 'foo');
      assert.equal(me.get('title'), 'bar');
      me.set('json.name', null);
      me.set('json.isOrganization', false);
      assert.equal(me.get('title'), 'foo');
      me.set('json.isOrganization', true);
      assert.equal(me.get('title'), null);
    });

    (0, _qunit.test)('should correctly compute icon', function (assert) {
      const me = Ember.run(() => this.owner.lookup('service:store').createRecord('contact'));

      assert.expect(2);
      me.set('json.isOrganization', true);
      assert.equal(me.get('icon'), 'users');
      me.set('json.isOrganization', false);
      assert.equal(me.get('icon'), 'user');
    });
  });
});
define('mdeditor/tests/unit/models/dictionary-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Model | dictionary', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      var model = Ember.run(() => this.owner.lookup('service:store').createRecord('dictionary'));
      // var store = this.store();
      assert.ok(!!model);
    });

    (0, _qunit.test)('should correctly compute title', function (assert) {
      const me = Ember.run(() => this.owner.lookup('service:store').createRecord('dictionary'));

      assert.expect(1);
      me.set('json.dataDictionary.citation.title', 'bar');
      assert.equal(me.get('title'), 'bar');
    });
  });
});
define('mdeditor/tests/unit/models/record-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Model | record', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      var model = Ember.run(() => this.owner.lookup('service:store').createRecord('record'));
      // var store = this.store();
      assert.ok(!!model);
    });

    (0, _qunit.test)('should correctly compute title', function (assert) {
      const me = Ember.run(() => this.owner.lookup('service:store').createRecord('record'));

      assert.expect(1);
      me.set('json.metadata.resourceInfo.citation.title', 'foo');
      assert.equal(me.get('title'), 'foo');
    });

    (0, _qunit.test)('should correctly compute icon', function (assert) {
      const me = Ember.run(() => this.owner.lookup('service:store').createRecord('record'));
      const list = this.owner.lookup('service:icon');

      assert.expect(1);
      me.set('json.metadata.resourceInfo.resourceType.firstObject.type', 'project');
      assert.equal(me.get('icon'), list.get('project'));
    });
  });
});
define('mdeditor/tests/unit/models/setting-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Model | setting', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let model = Ember.run(() => this.owner.lookup('service:store').createRecord('setting'));
      // let store = this.store();
      assert.ok(!!model);
    });
  });
});
define('mdeditor/tests/unit/pods/contact/new/id/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | contact/new/id', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:contact/new/id');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/contact/new/index/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | contact/new/index', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:contact/new/index');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/contact/show/edit/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | contact/edit', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      var route = this.owner.lookup('route:contact/show/edit');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/contact/show/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | contact/show', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      var route = this.owner.lookup('route:contact/show');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/contacts/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  let originalConfirm;

  (0, _qunit.module)('Unit | Route | contacts', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    hooks.beforeEach(function () {
      originalConfirm = window.confirm;
    });

    hooks.afterEach(function () {
      window.confirm = originalConfirm;
    });

    (0, _qunit.test)('it exists', function (assert) {
      var route = this.owner.lookup('route:contacts');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/dashboard/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | dashboard', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      var route = this.owner.lookup('route:dashboard');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/dictionaries/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  let originalConfirm;

  (0, _qunit.module)('Unit | Route | dictionaries', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    hooks.beforeEach(function () {
      originalConfirm = window.confirm;
    });

    hooks.afterEach(function () {
      window.confirm = originalConfirm;
    });

    (0, _qunit.test)('it exists', function (assert) {
      var route = this.owner.lookup('route:dictionaries');
      assert.ok(route);
    });

    (0, _qunit.test)('should display a confirm', function (assert) {
      assert.expect(2);

      let route = this.owner.lookup('route:dictionaries');

      // test _deleteItem to displays the expected window.confirm message
      const expectedTextFoo = 'foo';
      window.confirm = message => {
        assert.equal(message, expectedTextFoo, 'expect confirm to display ${expectedTextFoo}');
      };
      route._deleteItem(0, expectedTextFoo);

      // test action deleteItem calls _deleteItem and displays a window.confirm
      window.confirm = message => {
        assert.ok(message, 'expect confirm to display a message');
      };
      route.send('deleteItem', 0);
    });
  });
});
define('mdeditor/tests/unit/pods/dictionary/new/id/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | dictionary/new/id', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:dictionary/new/id');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/dictionary/new/index/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | dictionary/new/index', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:dictionary/new/index');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/dictionary/show/edit/citation/identifier/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | dictionary/show/edit/citation/identifier', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:dictionary/show/edit/citation/identifier');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/dictionary/show/edit/citation/index/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | dictionary/show/edit/citation/index', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:dictionary/show/edit/citation/index');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/dictionary/show/edit/citation/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | dictionary/show/edit/citation', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:dictionary/show/edit/citation');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/dictionary/show/edit/domain/edit/citation/identifier/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | dictionary/show/edit/domain/edit/citation/identifier', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:dictionary/show/edit/domain/edit/citation/identifier');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/dictionary/show/edit/domain/edit/citation/index/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | dictionary/show/edit/domain/edit/citation/index', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:dictionary/show/edit/domain/edit/citation/index');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/dictionary/show/edit/domain/edit/citation/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | dictionary/show/edit/domain/edit/citation', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:dictionary/show/edit/domain/edit/citation');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/dictionary/show/edit/domain/edit/index/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | dictionary/show/edit/domain/edit/index', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:dictionary/show/edit/domain/edit/index');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/dictionary/show/edit/domain/edit/item/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | dictionary/show/edit/domain/edit/item', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:dictionary/show/edit/domain/edit/item');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/dictionary/show/edit/domain/edit/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | dictionary/show/edit/domain/edit', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:dictionary/show/edit/domain/edit');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/dictionary/show/edit/domain/index/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | dictionary/show/edit/domain/index', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:dictionary/show/edit/domain/index');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/dictionary/show/edit/domain/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | dictionary/show/edit/domain', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:dictionary/show/edit/domain');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/dictionary/show/edit/entity/edit/attribute/index/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | dictionary/show/edit/entity/edit/attribute/index', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:dictionary/show/edit/entity/edit/attribute/index');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/dictionary/show/edit/entity/edit/attribute/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | dictionary/show/edit/entity/edit/attribute', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:dictionary/show/edit/entity/edit/attribute');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/dictionary/show/edit/entity/edit/citation/identifier/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | dictionary/show/edit/entity/edit/citation/identifier', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:dictionary/show/edit/entity/edit/citation/identifier');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/dictionary/show/edit/entity/edit/citation/index/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | dictionary/show/edit/entity/edit/citation/index', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:dictionary/show/edit/entity/edit/citation/index');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/dictionary/show/edit/entity/edit/citation/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | dictionary/show/edit/entity/edit/citation', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:dictionary/show/edit/entity/edit/citation');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/dictionary/show/edit/entity/edit/index/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | dictionary/show/edit/entity/edit/index', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:dictionary/show/edit/entity/edit/index');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/dictionary/show/edit/entity/edit/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | dictionary/show/edit/entity/edit', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:dictionary/show/edit/entity/edit');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/dictionary/show/edit/entity/import/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | dictionary/show/edit/entity/import', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:dictionary/show/edit/entity/import');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/dictionary/show/edit/entity/index/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | dictionary/show/edit/entity/index', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:dictionary/show/edit/entity/index');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/dictionary/show/edit/entity/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | dictionary/show/edit/entity', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:dictionary/show/edit/entity');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/dictionary/show/edit/index/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | dictionary/show/edit/index', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      var route = this.owner.lookup('route:dictionary/show/edit/index');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/dictionary/show/edit/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | dictionary/edit', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      var route = this.owner.lookup('route:dictionary/show/edit');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/dictionary/show/index/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | dictionary/show/index', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:dictionary/show/index');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/dictionary/show/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | dictionary/show', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      var route = this.owner.lookup('route:dictionary/show');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/error/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | error', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:error');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/export/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | save', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      var route = this.owner.lookup('route:save');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/help/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | help', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      var route = this.owner.lookup('route:help');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/import/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | import', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      var route = this.owner.lookup('route:import');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/not-found/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | not found', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:not-found');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/publish/index/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | publish/index', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:publish/index');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/publish/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | publish', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      var route = this.owner.lookup('route:publish');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/index/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/index', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/index');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/new/id/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/new/id', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/new/id');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/new/index/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/new/index', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/new/index');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/associated/index/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/associated/index', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/associated/index');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/associated/resource/index/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/associated/resource/index', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/associated/resource/index');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/associated/resource/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/associated/resource', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/associated/resource');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/associated/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/edit/associated', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      var route = this.owner.lookup('route:record/show/edit/associated');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/constraint/index/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/constraint/index', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/constraint/index');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/constraint/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/constraint', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/constraint');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/coverages/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/edit/coverages', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      var route = this.owner.lookup('route:record/show/edit/coverages');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/dictionary/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/dictionary', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/dictionary');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/distribution/distributor/index/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/distribution/distributor/index', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/distribution/distributor/index');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/distribution/distributor/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/distribution/distributor', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/distribution/distributor');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/distribution/index/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/distribution/index', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/distribution/index');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/distribution/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/edit/distribution', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      var route = this.owner.lookup('route:record/show/edit/distribution');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/documents/citation/index/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/documents/citation/index', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/documents/citation/index');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/documents/citation/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/documents/citation', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/documents/citation');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/documents/index/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/documents/index', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/documents/index');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/documents/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/edit/documents', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      var route = this.owner.lookup('route:record/show/edit/documents');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/funding/allocation/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/funding/allocation', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/funding/allocation');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/funding/index/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/funding/index', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/funding/index');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/funding/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/funding', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/funding');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/grid/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/edit/grid', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      var route = this.owner.lookup('route:record/show/edit/grid');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/index/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/index', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/index');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/keywords/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/edit/keywords', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      var route = this.owner.lookup('route:record/show/edit/keywords');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/keywords/thesaurus/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/keywords/thesaurus', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/keywords/thesaurus');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/lineage/lineageobject/citation/identifier/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/lineage/lineageobject/citation/identifier', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/lineage/lineageobject/citation/identifier');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/lineage/lineageobject/citation/index/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/lineage/lineageobject/citation/index', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/lineage/lineageobject/citation/index');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/lineage/lineageobject/citation/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/lineage/lineageobject/citation', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/lineage/lineageobject/citation');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/lineage/lineageobject/index/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/lineage/lineageobject/index', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/lineage/lineageobject/index');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/lineage/lineageobject/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/lineage/lineageobject', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/lineage/lineageobject');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/lineage/lineageobject/source/index/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/lineage/lineageobject/source/index', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/lineage/lineageobject/source/index');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/lineage/lineageobject/source/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/lineage/lineageobject/source', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/lineage/lineageobject/source');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/lineage/lineageobject/step/citation/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/lineage/lineageobject/step/citation', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/lineage/lineageobject/step/citation');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/lineage/lineageobject/step/index/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/lineage/lineageobject/step/index', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/lineage/lineageobject/step/index');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/lineage/lineageobject/step/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/lineage/lineageobject/step', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/lineage/lineageobject/step');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/main/citation/identifier/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/main/citation/identifier', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/main/citation/identifier');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/main/citation/index/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/main/citation/index', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/main/citation/index');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/main/citation/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/main/citation', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/main/citation');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/main/index/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/main/index', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/main/index');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/main/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/main', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/main');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/metadata/alternate/identifier/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/metadata/alternate/identifier', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/metadata/alternate/identifier');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/metadata/alternate/index/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/metadata/alternate/index', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/metadata/alternate/index');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/metadata/alternate/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/metadata/alternate', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/metadata/alternate');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/metadata/identifier/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/metadata/identifier', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/metadata/identifier');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/metadata/index/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/metadata/index', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/metadata/index');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/metadata/parent/identifier/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/metadata/parent/identifier', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/metadata/parent/identifier');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/metadata/parent/index/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/metadata/parent/index', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/metadata/parent/index');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/metadata/parent/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/metadata/parent', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/metadata/parent');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/metadata/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/metadata', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/metadata');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/edit', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      var route = this.owner.lookup('route:record/show/edit');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/spatial/extent/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/extent/spatial', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/extent/spatial');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/spatial/index/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/spatial/index', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/spatial/index');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/spatial/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/spatial', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/spatial');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/taxonomy/collection/index/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/taxonomy/collection/index', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/taxonomy/collection/index');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/taxonomy/collection/itis/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/taxonomy/collection/itis', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/taxonomy/collection/itis');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/taxonomy/collection/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/taxonomy/collection', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/taxonomy/collection');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/taxonomy/collection/system/index/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/taxonomy/collection/system/index', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/taxonomy/collection/system/index');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/taxonomy/collection/system/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/taxonomy/collection/system', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/taxonomy/collection/system');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/taxonomy/index/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/taxonomy/index', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/taxonomy/index');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/edit/taxonomy/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/edit/taxonomy', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/edit/taxonomy');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/index/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/index', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/index');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      var route = this.owner.lookup('route:record/show');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/record/show/translate/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | record/show/translate', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:record/show/translate');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/records/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  let originalConfirm;

  (0, _qunit.module)('Unit | Route | records', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    hooks.beforeEach(function () {
      originalConfirm = window.confirm;
    });

    hooks.afterEach(function () {
      window.confirm = originalConfirm;
    });

    (0, _qunit.test)('it exists', function (assert) {
      var route = this.owner.lookup('route:records');
      assert.ok(route);
    });

    (0, _qunit.test)('should display a confirm', function (assert) {
      assert.expect(2);

      let route = this.owner.lookup('route:records');

      // test _deleteItem to displays the expected window.confirm message
      const expectedTextFoo = 'foo';
      window.confirm = message => {
        assert.equal(message, expectedTextFoo, 'expect confirm to display ${expectedTextFoo}');
      };
      route._deleteItem(0, expectedTextFoo);

      // test action deleteItem calls _deleteItem and displays a window.confirm
      window.confirm = message => {
        assert.ok(message, 'expect confirm to display a message');
      };
      route.send('deleteItem', 0);
    });
  });
});
define('mdeditor/tests/unit/pods/settings/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | settings', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      var route = this.owner.lookup('route:settings');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/pods/translate/route-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | translate', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      var route = this.owner.lookup('route:translate');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/routes/application-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | application', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      var route = this.owner.lookup('route:application');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/routes/index-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | index', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      var route = this.owner.lookup('route:index');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/routes/publish/sciencebase-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | publish/sciencebase', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:publish/sciencebase');
      assert.ok(route);
    });
  });
});
define('mdeditor/tests/unit/serializers/application-test', ['ember-data', 'qunit', 'ember-qunit'], function (_emberData, _qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Serializer | application', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it serializes records', function (assert) {
      assert.expect(2);

      let serializer = this.owner.lookup('serializer:application');
      let store = this.owner.lookup('service:store');
      let record;
      const expected = {
        "data": {
          "attributes": {
            "name": "foo",
            "skill": "bar",
            "games-played": "[100,200]"
          },
          "type": "tests"
        }
      };
      const data = {
        id: 1,
        name: 'foo',
        skill: 'bar',
        gamesPlayed: [100, 200]
      };
      let model = _emberData.default.Model.extend({
        name: _emberData.default.attr(),
        skill: _emberData.default.attr(),
        gamesPlayed: _emberData.default.attr('json')
      });

      this.owner.register('model:test', model);

      Ember.run(function () {
        record = store.createRecord('test', data);
      });

      assert.deepEqual(record.serialize(), expected, 'record serialized OK');
      assert.deepEqual(serializer.serialize(record._createSnapshot()), expected, 'serialized snapshot OK');
    });
  });
});
define('mdeditor/tests/unit/services/cleaner-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Service | cleaner', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    // Replace this with your real tests.
    (0, _qunit.test)('it exists', function (assert) {
      let service = this.owner.lookup('service:cleaner');
      assert.ok(service);
    });
  });
});
define('mdeditor/tests/unit/services/codelist-test', ['qunit', 'ember-qunit', 'npm:mdcodes/resources/js/mdcodes.js'], function (_qunit, _emberQunit, _mdcodes) {
  'use strict';

  (0, _qunit.module)('Unit | Service | codelist', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('all codelists are present', function (assert) {
      var service = this.owner.lookup('service:codelist');

      Object.keys(_mdcodes.default).forEach(function (key) {
        const name = key.replace(/^iso_/, '');

        assert.ok(service.get(name), name + ' is present.');
      });
    });
  });
});
define('mdeditor/tests/unit/services/contacts-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Service | contacts', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    // Replace this with your real tests.
    (0, _qunit.test)('it exists', function (assert) {
      let service = this.owner.lookup('service:contacts');
      assert.ok(service);
    });
  });
});
define('mdeditor/tests/unit/services/icon-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Service | icon', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    // Replace this with your real tests.
    (0, _qunit.test)('it exists', function (assert) {
      var service = this.owner.lookup('service:icon');
      assert.ok(service);
    });
  });
});
define('mdeditor/tests/unit/services/itis-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Service | itis', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    // Replace this with your real tests.
    (0, _qunit.test)('it exists', function (assert) {
      let service = this.owner.lookup('service:itis');
      assert.ok(service);
    });
  });
});
define('mdeditor/tests/unit/services/jsonvalidator-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Service | jsonvalidator', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('test jsonapi validation', function (assert) {
      var service = this.owner.lookup('service:jsonvalidator');
      var obj = {
        "data": [{
          "id": "8ke11eu1",
          "attributes": {
            "profile": "full",
            "json": "{}",
            "date-updated": "2016-09-16T22:08:04.425Z"
          },
          "type": "records",
          "meta": {
            "title": "ytr",
            "export": true
          }
        }, {
          "id": "spt9cadc",
          "attributes": {
            "json": "{}",
            "date-updated": "2016-09-16T22:08:11.080Z"
          },
          "type": "contacts",
          "meta": {
            "title": "ewrrrrrrrrrrrrrr",
            "export": true
          }
        }]
      };

      assert.ok(service.validate('jsonapi', obj));
    });
  });
});
define('mdeditor/tests/unit/services/keyword-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Service | keyword', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    // Replace this with your real tests.
    (0, _qunit.test)('it exists', function (assert) {
      let service = this.owner.lookup('service:keyword');
      assert.ok(service);
    });
  });
});
define('mdeditor/tests/unit/services/mdjson-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Service | mdjson', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    // Replace this with your real tests.
    (0, _qunit.test)('it exists', function (assert) {
      let service = this.owner.lookup('service:mdjson');
      assert.ok(service);
    });
  });
});
define('mdeditor/tests/unit/services/patch-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Service | patch', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    // Replace this with your real tests.
    (0, _qunit.test)('it exists', function (assert) {
      let service = this.owner.lookup('service:patch');
      assert.ok(service);
    });
  });
});
define('mdeditor/tests/unit/services/profile-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Service | profile', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    // Replace this with your real tests.
    (0, _qunit.test)('it exists', function (assert) {
      var service = this.owner.lookup('service:profile');
      assert.ok(service);
    });
  });
});
define('mdeditor/tests/unit/services/publish-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Service | publish', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    // Replace this with your real tests.
    (0, _qunit.test)('it exists', function (assert) {
      let service = this.owner.lookup('service:publish');
      assert.ok(service);
    });
  });
});
define('mdeditor/tests/unit/services/settings-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Service | settings', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    // Replace this with your real tests.
    (0, _qunit.test)('it exists', function (assert) {
      let service = this.owner.lookup('service:settings');
      assert.ok(service);
    });
  });
});
define('mdeditor/tests/unit/services/slider-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Service | slider', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    // Replace this with your real tests.
    (0, _qunit.test)('it exists', function (assert) {
      let service = this.owner.lookup('service:slider');
      assert.ok(service);
    });
  });
});
define('mdeditor/tests/unit/services/spotlight-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Service | spotlight', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    // Replace this with your real tests.
    (0, _qunit.test)('it exists', function (assert) {
      let service = this.owner.lookup('service:spotlight');
      assert.ok(service);
    });
  });
});
define('mdeditor/tests/unit/transforms/json-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Transform | json', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it deserialized', function (assert) {
      let transform = this.owner.lookup('transform:json');
      assert.deepEqual(transform.deserialize('{"foo":"bar"}'), {
        foo: "bar"
      });
    });

    (0, _qunit.test)('it serialized', function (assert) {
      let transform = this.owner.lookup('transform:json');
      assert.equal(transform.serialize({
        foo: 'bar'
      }), '{"foo":"bar"}');
    });
  });
});
define('mdeditor/tests/unit/utils/config-test', ['mdeditor/utils/config', 'qunit'], function (_config, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Utility | config', function () {
    // Replace this with your real tests.
    (0, _qunit.test)('it works', function (assert) {
      let result = (0, _config.default)();
      assert.ok(result);
    });
  });
});
define('mdeditor/tests/unit/utils/sb-tree-node-test', ['mdeditor/utils/sb-tree-node', 'qunit'], function (_sbTreeNode, _qunit) {
  'use strict';

  (0, _qunit.module)('Unit | Utility | sb tree node', function () {
    // Replace this with your real tests.
    (0, _qunit.test)('it works', function (assert) {
      let result = (0, _sbTreeNode.default)();
      assert.ok(result);
    });
  });
});
define('mdeditor/tests/unit/validators/array-required-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Validator | array-required', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it works', function (assert) {
      var validator = this.owner.lookup('validator:array-required');
      assert.ok(validator);
    });
  });
});
define('mdeditor/tests/unit/validators/array-valid-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Validator | array-valid', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it works', function (assert) {
      var validator = this.owner.lookup('validator:array-valid');
      assert.ok(validator);
    });
  });
});
define('mdeditor/config/environment', [], function() {
  var prefix = 'mdeditor';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

require('mdeditor/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests.map
