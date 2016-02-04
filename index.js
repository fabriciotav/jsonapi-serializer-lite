'use strict';

if (typeof module === 'object' && module.exports) {
  var _ = require('lodash');
}

!function() {
  var jsl = { version: '0.1.0' };

  /**
   * Flattens a JSONAPI object.
   *
   * @param {oject} body
   *
   * @return {object} Resource flattened
   */
  jsl.flatten = function flatten(body, extRelList) {
    let resource = {};
    let extRelationships = {};
  
    const attributes = _.keys(body.data.attributes);
    const relationships = _.keys(body.data.relationships);
  
    attributes.forEach((attr) => {
      resource[_.camelCase(attr)] = body.data.attributes[attr]
    });
  
    relationships.forEach((rel) => {
      let data = body.data.relationships[rel].data;
  
      if (_.isArray(data)) {
        let plucked = _.map(data, 'id');
        _.includes(extRelList, rel) ? extRelationships[rel] = plucked : resource[rel] = plucked;
      } else {
        _.includes(extRelList, rel) ? extRelationships[rel] = data.id : resource[rel] = data.id;
      }
    });
  
    return { resource: resource, extRelationships: extRelationships };
  };

  /**
   * Serialize a flat structure into JSONAPI compliant.
   *
   * @param {string} type
   * @param {object|array} data
   * @param {object} options
   *
   * @return {object}
   */
  jsl.serialize = function serialize(type, data, options) {
    // Default parameters
    let id = options.id || 'id';
    let attributes = options.attributes || [];
    let relationships = options.relationships || [];
  
    let resource = {};
  
    if (_.isArray(data)) {
      resource.data = [];

      data.forEach(function(d, i) {
        let n = {};

        n.type = type;
        n.id = d[id];
        n.attributes = {};
        
        attributes.forEach((attrKey) => {
          n.attributes[_.kebabCase(attrKey)] = d[attrKey];
        });
      
        if (relationships.length > 0) {
          n.relationships = {};
    
          relationships.forEach((rel) => {
            n.relationships[rel.rel] = convert(rel.type, d[rel.rel]);
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
        resource.data.attributes[_.kebabCase(attrKey)] = data[attrKey];
      });
  
      if (relationships.length > 0) {
        resource.data.relationships = {};
  
        relationships.forEach((rel) => {
          resource.data.relationships[rel.rel] = convert(rel.type, data[rel.rel]);
        });
      }
    }

    return resource;
  }

  /**
   *
   *
   * @param {string|array} data
   *
   * @return {object|array}
   */
  jsl.convert = function convert(type, data) {
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
      result = {
        type: type,
        id: data
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
