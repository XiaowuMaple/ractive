import { ATTRIBUTE } from 'config/types';
import runloop from 'src/global/runloop';
import Input from './Input';
import { isBindable } from '../binding/selectBinding';
import createItem from '../../createItem';
import Fragment from '../../../Fragment';

export default class Textarea extends Input {
  constructor(options) {
    const template = options.template;

    options.deferContent = true;

    super(options);

    // check for single interpolator binding
    if (!this.attributeByName.value) {
      if (template.f && isBindable({ template })) {
        (this.attributes || (this.attributes = [])).push(
          createItem({
            owner: this,
            template: { t: ATTRIBUTE, f: template.f, n: 'value' },
            up: this.up
          })
        );
      } else {
        this.fragment = new Fragment({
          owner: this,
          cssIds: null,
          template: template.f
        });
      }
    }
  }

  bubble() {
    if (!this.dirty) {
      this.dirty = true;

      if (this.rendered && !this.binding && this.fragment) {
        runloop.scheduleTask(() => {
          this.dirty = false;
          this.node.value = this.fragment.toString();
        });
      }

      this.up.bubble(); // default behaviour
    }
  }
}
