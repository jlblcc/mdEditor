import Component from '@ember/component';

export default Component.extend({
  tagName: 'button',
  classNames: 'md-button-confirm',
  attributeBindings: ['type', 'disabled'],
  type: 'button',
  isShowingConfirm: false,
  propagateClick: false,
  disabled: null,

  /**
   * The function to call when action is confirmed.
   *
   * @method onConfirm
   * @return {[type]} [description]
   */
  onConfirm(){},

  //click handler, sets button state
  click(evt) {
    if(!this.get('propagateClick')) {
      evt.stopPropagation();
    }

    if(this.get('isShowingConfirm')) {
      this.get('onConfirm')();
    } else {
      this.set('isShowingConfirm', true);
    }
  },

  //cancel confirm state on button blur
  didInsertElement() {
    this._super(...arguments);
    this.$()
      .on('blur', () => {
        this.set('isShowingConfirm', false);
      });
  }
});
