'use strict';

const assert = require('assert');
const jsl = require('../index');

describe('Serializer', function() {
  it('should serialize object 1', function() {

    const toBeSerialized = {
      id: 'unique_id',
      fullName: 'Fabrício',
      description: 'JSON API',
      newEvent: '1'
    };

    const serialized = {
      data: {
        id: 'unique_id',
        type: 'users',
        attributes: {
          'full-name': 'Fabrício',
          description: 'JSON API',
          anniversary: null
        },
        relationships: {
          'new-event': {
            data: {
              id: '1',
              type: 'events'
            }
          }
        }
      }
    };

    assert.deepEqual(serialized, jsl.serialize(toBeSerialized, {
      type: 'users',

      attributes: [
        'fullName',
        'description',
        'anniversary'
      ],

      relationships: [
        { rel: 'newEvent', type: 'events' }
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
        },
        newEvent: '2'
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
          },
          relationships: {
            'new-event': {
              data: {
                id: '2',
                type: 'events'
              }
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
          },
          relationships: {
            'new-event': {
              data: null
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
          },
          relationships: {
            'new-event': {
              data: null
            }
          }
        }
      ]
    };

    assert.deepEqual(serialized, jsl.serialize(toBeSerialized, {
      type: 'users',

      attributes: [
        'fullName',
        'description',
        'address.street',
        'address.city'
      ],

      relationships: [
        { rel: 'newEvent', type: 'events' }
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

    assert.deepEqual(serialized, jsl.serialize(toBeSerialized, {
      type: 'users',
      
      attributes: [
        'fullName',
        'settings.lang'
      ]
    }));
  });

  // ---

  it('should serialize object 3', function() {

    const toBeSerialized = {
      id: 'unique_id',
      addressLine1: 'Local Avenue',
      addressLine2: '8080'
    };

    const serialized = {
      data: {
        id: 'unique_id',
        type: 'users',
        attributes: {
          'address-line1': 'Local Avenue',
          'address-line2': '8080'
        }
      }
    };

    assert.deepEqual(serialized, jsl.serialize(toBeSerialized, {
      digitAsWord: false,
      
      type: 'users',
      
      attributes: [
        'addressLine1',
        'addressLine2'
      ]
    }));
  });

  // ---

  it('should serialize object 4', function() {

    const toBeSerialized = {
      id: 'unique_id',
      addressLine1AndLine2: 'Local Avenue, 8080'
    };

    const serialized = {
      data: {
        id: 'unique_id',
        type: 'users',
        attributes: {
          'address-line1-and-line2': 'Local Avenue, 8080'
        }
      }
    };

    assert.deepEqual(serialized, jsl.serialize(toBeSerialized, {
      digitAsWord: false,
      
      type: 'users',
      
      attributes: [
        'addressLine1AndLine2'
      ]
    }));
  });

  // ---

  it('should serialize object 5', function() {

    const toBeSerialized = {
      id: 'unique_id',
      addressLine1: 'Local Avenue',
      addressLine2: '8080'
    };

    const serialized = {
      data: {
        id: 'unique_id',
        type: 'users',
        attributes: {
          'address-line-1': 'Local Avenue',
          'address-line-2': '8080'
        }
      }
    };

    assert.deepEqual(serialized, jsl.serialize(toBeSerialized, {
      digitAsWord: true,
      
      type: 'users',
      
      attributes: [
        'addressLine1',
        'addressLine2'
      ]
    }));
  });

  // ---

  it('should serialize object 6', function() {

    const toBeSerialized = {
      id: 'unique_id',
      addressLine1AndLine2: 'Local Avenue, 8080'
    };

    const serialized = {
      data: {
        id: 'unique_id',
        type: 'users',
        attributes: {
          'address-line-1-and-line-2': 'Local Avenue, 8080'
        }
      }
    };

    assert.deepEqual(serialized, jsl.serialize(toBeSerialized, {
      digitAsWord: true,
      
      type: 'users',
      
      attributes: [
        'addressLine1AndLine2'
      ]
    }));
  });

  // ---

  it('should serialize object 7', function() {

    const toBeSerialized = {
      id: 'unique_id',
      addressLine1: 'Local Avenue',
      addressLine2: '8080'
    };

    const serialized = {
      data: {
        id: 'unique_id',
        type: 'users',
        attributes: {
          'address-line-1': 'Local Avenue',
          'address-line-2': '8080'
        }
      }
    };

    assert.deepEqual(serialized, jsl.serialize(toBeSerialized, {
      type: 'users',
      
      attributes: [
        'addressLine1',
        'addressLine2'
      ]
    }));
  });

  // ---

  it('should serialize object 8', function() {

    const toBeSerialized = {
      id: 'unique_id',
      addressLine1AndLine2: 'Local Avenue, 8080'
    };

    const serialized = {
      data: {
        id: 'unique_id',
        type: 'users',
        attributes: {
          'address-line-1-and-line-2': 'Local Avenue, 8080'
        }
      }
    };

    assert.deepEqual(serialized, jsl.serialize(toBeSerialized, {
      type: 'users',
      
      attributes: [
        'addressLine1AndLine2'
      ]
    }));
  });
});
