'use strict';

const assert = require('assert');
const serializer = require('../index');

describe('Serializer', function() {
  it('should serialize object 1', function() {

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
        description: 'JSON API',
        "address": {
          "street": "A",
          "city": "City A"
        }
      },
      {
        id: 'unique-id-2',
        fullName: 'Fabrício Tavares',
        description: 'JSON API',
        "address": {
          "street": "B",
          "city": "City B"
        }
      },
      {
        id: 'unique-id-3',
        fullName: 'Fabrício 3',
        description: 'JSON API 3',
        "address": {
          "street": "C",
          "city": "City C"
        }
      }
    ];

    const serialized = {
      data: [
        {
          id: 'unique-id-1',
          type: 'users',
          attributes: {
            'full-name': 'Fabrício 1',
            description: 'JSON API',
            "address": {
              "street": "A",
              "city": "City A"
            }
          }
        },

        {
          id: 'unique-id-2',
          type: 'users',
          attributes: {
            'full-name': 'Fabrício Tavares',
            description: 'JSON API',
            "address": {
              "street": "B",
              "city": "City B"
            }
          }
        },
        {
          id: 'unique-id-3',
          type: 'users',
          attributes: {
            'full-name': 'Fabrício 3',
            description: 'JSON API 3',
            "address": {
              "street": "C",
              "city": "City C"
            }
          }
        }
      ]
    };

    assert.deepEqual(serialized, serializer.serialize('users', toBeSerialized, {
      attributes: [
        'fullName',
        'description',
        'address.street',
        'address.city'
      ]
    }));
  });

  // ---

  it('should serialize object 2', function() {

    const toBeSerialized = {
      id: 'unique_id',
      fullName: 'Fabrício',
      settings: {
        lang: 'pt-BR'
      }
    };

    const serialized = {
      data: {
        id: 'unique_id',
        type: 'users',
        attributes: {
          'full-name': 'Fabrício',
          settings: {
            lang: 'pt-BR'
          }
        }
      }
    };

    assert.deepEqual(serialized, serializer.serialize('users', toBeSerialized, {
      attributes: [
        'fullName',
        'settings.lang'
      ]
    }));
  });
});
