/**
 * @license Copyright 2018 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/* globals getElementsInDocument */

const Gatherer = require('../gatherer.js');
const pageFunctions = require('../../../lib/page-functions.js');

function getEmbeddedContent() {
  const selector = 'object, embed, applet';
  /** @type {HTMLElement[]} */
  // @ts-expect-error - getElementsInDocument put into scope via stringification
  const elements = getElementsInDocument(selector);
  return elements
    .map(node => ({
      tagName: node.tagName,
      type: node.getAttribute('type'),
      src: node.getAttribute('src'),
      data: node.getAttribute('data'),
      code: node.getAttribute('code'),
      params: Array.from(node.children)
        .filter(el => el.tagName === 'PARAM')
        .map(el => ({
          name: el.getAttribute('name') || '',
          value: el.getAttribute('value') || '',
        })),
    }));
}

class EmbeddedContent extends Gatherer {
  /**
   * @param {LH.Gatherer.PassContext} passContext
   * @return {Promise<LH.Artifacts['EmbeddedContent']>}
   */
  afterPass(passContext) {
    return passContext.driver.evaluate(getEmbeddedContent, {
      args: [],
      deps: [pageFunctions.getElementsInDocument],
    });
  }
}

module.exports = EmbeddedContent;
