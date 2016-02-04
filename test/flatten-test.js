'use strict';

const assert = require('assert');
const serializer = require('../index');

describe('Flatten', function() {
  it('should flatten JSON structure', function() {

    const preFlatten = {
      data: {
        attributes: {
          'full-name': 'Fabrício',
          description: 'JSON API'
        }
      }
    };

    const posFlatten = {
      resource: {
        fullName: 'Fabrício',
        description: 'JSON API'
      },
      extRelationships: {}
    };

    assert.deepEqual(posFlatten, serializer.flatten(preFlatten));
  });
});
