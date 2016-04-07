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
        },

        relationships: {
          'created-by': {
            data: {
              type: 'people',
              id: '1'
            }
          },
          'modified-by': {
            data: null
          }
        }
      }
    };

    const posFlatten = {
      resource: {
        fullName: 'Fabrício',
        description: 'JSON API'
      },
      extRelationships: {
        'created-by': '1',
        'modified-by': null
      }
    };

    assert.deepEqual(posFlatten, serializer.flatten(preFlatten, 'created-by', 'modified-by'));
  });
});
