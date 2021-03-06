import { isArray } from 'utils/is';

export default function Ractive$findAll(selector, options = {}) {
  if (!this.rendered)
    throw new Error(
      `Cannot call ractive.findAll('${selector}', ...) unless instance is rendered to the DOM`
    );

  if (!isArray(options.result)) options.result = [];

  this.fragment.findAll(selector, options);

  if (options.remote) {
    // seach non-fragment children
    this._children.forEach(c => {
      if (!c.target && c.instance.fragment && c.instance.fragment.rendered) {
        c.instance.findAll(selector, options);
      }
    });
  }

  return options.result;
}
