'use strict';

if (typeof module === 'object' && module.exports) {
  var _ = require('lodash');
}

!function() {
  var jsl = { version: '0.8.0' };

  /**
   * Deserialize a JSONAPI object.
   *
   * Options default:
   * 
   * ```
   * {
   *   flat: true,
   *   convertCase: 'camelCase'
   * }
   * ```
   *
   * @param {array} jsonapiObject
   * @param {oject} options
   *
   * @return {object} Resource flattened
   */
  jsl.deserialize = function deserialize (jsonapiObject, options) {
    options = options || {};
    let flat = options.flat !== undefined ? options.flat : true;
    let convertCase = options.convertCase || 'camelCase';

    const jsonapiAttributes = _.keys(jsonapiObject.data.attributes);
    const jsonapiRelationships = _.keys(jsonapiObject.data.relationships);

    let attributes = {};
    let relationships = {};
  
    jsonapiAttributes.forEach((attr) => {
      attributes[_[convertCase](attr)] = jsonapiObject.data.attributes[attr];
    });
  
    jsonapiRelationships.forEach((rel) => {
      let data = jsonapiObject.data.relationships[rel].data;
    
      if (data === null) {
        relationships[_[convertCase](rel)] = null;
      } else if (_.isArray(data)) {
        relationships[_[convertCase](rel)] = _.map(data, 'id');
      } else {
        relationships[_[convertCase](rel)] = data.id;
      }
    });
    
    if (flat === true) {
      return _.assign(attributes, relationships);
    } else {
      return { attributes: attributes, relationships: relationships };
    }
  };

  /**
   * Serialize a flat structure into JSONAPI compliant.
   *
   * @param {object|array} data
   * @param {object} options
   *
   * @return {object}
   */
  jsl.serialize = function serialize (data, options) {
    // Default parameters
    let type = options.type || 'resource';
    let id = options.id || 'id';
    let attributes = options.attributes || [];
    let relationships = options.relationships || [];
    let digitAsWord = Object.prototype.hasOwnProperty.call(options, 'digitAsWord') ? options.digitAsWord : true;
  
    let resource = {};
  
    if (_.isArray(data)) {
      resource.data = [];

      data.forEach(function(d, i) {
        let n = {};

        n.type = type;
        n.id = d[id];
        n.attributes = {};
        
        attributes.forEach((attrKey) => {
          let value = _.head(_.at(d, attrKey));
          (value === undefined) ? value = null : value = value;

          let keys = attrKey.split('.');
          keys = keys.map((key) => dasherize(key, digitAsWord));
          keys = keys.join('.');

          _.set(n.attributes, keys, value);
        });
      
        if (relationships.length > 0) {
          n.relationships = {};
    
          relationships.forEach((rel) => {
            n.relationships[dasherize(rel.rel, digitAsWord)] = convert(rel.type, d[rel.rel]);
          });
        }

        resource.data.push(n);
      });

    } else {
      resource.data = {};
      resource.data.type = type;
      resource.data.id = data[id];
      resource.data.attributes = {};
      
      attributes.forEach((attrKey) => {
        let value = _.head(_.at(data, attrKey));
        (value === undefined) ? value = null : value = value;

        let keys = attrKey.split('.');
          keys = keys.map((key) => dasherize(key, digitAsWord));
          keys = keys.join('.');

          _.set(resource.data.attributes, keys, value);
      });
  
      if (relationships.length > 0) {
        resource.data.relationships = {};
  
        relationships.forEach((rel) => {
          resource.data.relationships[dasherize(rel.rel, digitAsWord)] = convert(rel.type, data[rel.rel]);
        });
      }
    }

    return resource;
  }

  /**
   *
   *
   * @param {string} str
   *
   * @return {string}
   */
  function dasherize(str, digitAsWord) {
    if (digitAsWord === true) {
      return _.kebabCase(str);
    } else {
      const STRING_DECAMELIZE_REGEXP = /([a-z\d])([A-Z])/g;
      return str.replace(STRING_DECAMELIZE_REGEXP, '$1-$2').toLowerCase();
    }
  }

  /**
   *
   *
   * @param {string|array} data
   *
   * @return {object|array}
   */
  function convert (type, data) {
    let result = null;
  
    if (_.isArray(data)) {
      result = [];

      data.forEach((id) => {
        result.push({
          type: type,
          id: id
        });
      });
    } else {
      if (data) {
        result = {
          type: type,
          id: data
        };
      } else {
        result = null;
      }
    }
  
    return { data: result };
  }

  if (typeof define === 'function' && define.amd) {
    define(jsl);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = jsl;
  } else {
    this.jsl = jsl;
  }
}();
