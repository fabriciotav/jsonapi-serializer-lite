'use strict';

const assert = require('assert');
const serializer = require('../index');

describe('Serializer', function() {
  it('should serialize object', function() {

    const toBeSerialized = {
      id: 'unique_id',
      fullName: 'Fabrício',
      description: 'JSON API'
    };

    const serialized = {
      data: {
        id: 'unique_id',
        type: 'users',
        attributes: {
          'full-name': 'Fabrício',
          description: 'JSON API'
        }
      }
    };

    assert.deepEqual(serialized, serializer.serialize('users', toBeSerialized, {
      attributes: [
        'fullName',
        'description'
      ]
    }));
  });

  it('should serialize array', function() {
    const toBeSerialized = [
      {
        id: 'unique-id-1',
        fullName: 'Fabrício 1',
        description: 'JSON API'
      },
      {
        id: 'unique-id-2',
        fullName: 'Fabrício Tavares',
        description: 'JSON API'
      },
      {
        id: 'unique-id-3',
        fullName: 'Fabrício 3',
        description: 'JSON API 3'
      }
    ];

    const serialized = {
      data: [
        {
          id: 'unique-id-1',
          type: 'users',
          attributes: {
            'full-name': 'Fabrício 1',
            description: 'JSON API'
          }
        },

        {
          id: 'unique-id-2',
          type: 'users',
          attributes: {
            'full-name': 'Fabrício Tavares',
            description: 'JSON API'
          }
        },
        {
          id: 'unique-id-3',
          type: 'users',
          attributes: {
            'full-name': 'Fabrício 3',
            description: 'JSON API 3'
          }
        }
      ]
    };

    assert.deepEqual(serialized, serializer.serialize('users', toBeSerialized, {
      attributes: [
        'fullName',
        'description'
      ]
    }));
  });
});
