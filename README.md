# jsonapi-serializer-lite

## Usage

```js
const jsl = require('jsl');
```

### jsl.serialize(data[, options])

List of `options` default values:

```js
{
  type: 'resource',
  id: 'id',
  attributes: [],
  relationships: []
}
```

```js
const toBeSerialized = {
  id: 'unique_id',
  fullName: 'Fabrício',
  description: 'JSON API',
  newEvent: '1'
};

jsl.serialize(toBeSerialized, {
  type: 'users',

  attributes: [
    'fullName',
    'description',
    'anniversary'
  ],

  relationships: [
    { rel: 'newEvent', type: 'events' }
  ]
});
```

Returns:

```js
{
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
}
```

### jsl.deserialize(jsonapiObject[, options])

List of `options` default values:


```js
{
  flat: true,
  convertCase: 'camelCase'  // one of: camelCase, kebabCase, snakeCase
}
```

```js
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

jsl.deserialize(jsonapiObject, { flat: false });
```

Returns:

```js
{
  attributes: {
    fullName: 'Fabrício',
    description: 'JSON API'
  },
  relationships: {
    createdBy: '1',
    modifiedBy: '1'
  }
}
```
