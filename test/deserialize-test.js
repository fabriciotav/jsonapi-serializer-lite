'use strict';

const assert = require('assert');
const jsl = require('../index');

describe('Deserialize', function() {
  it('should deserialize JSON structure', function() {

    const jsonapiObject = {
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
            data: {
              type: 'people',
              id: '1'
            }
          }
        }
      }
    };

    const deserialized = {
      attributes: {
        fullName: 'Fabrício',
        description: 'JSON API'
      },
      relationships: {
        createdBy: '1',
        modifiedBy: '1'
      }
    };

    assert.deepEqual(deserialized, jsl.deserialize(jsonapiObject, { flat: false }));
  });

  it('should deserialize JSON structure', function() {

    const jsonapiObject = {
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

    const deserialized = {
        fullName: 'Fabrício',
        description: 'JSON API',
        createdBy: '1',
        modifiedBy: null
    };

    assert.deepEqual(deserialized, jsl.deserialize(jsonapiObject));
  });
});
