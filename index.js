'use strict';

if (typeof module === 'object' && module.exports) {
  var _ = require('lodash');
  var ok = require('object-key');
}

!function() {
  var jsl = { version: '0.6.1' };

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
    let stringCase = options.stringCase || 'kebab';
  
    let resource = {};
  
    if (_.isArray(data)) {
      resource.data = [];

      data.forEach(function(d, i) {
        let n = {};

        n.type = type;
        n.id = d[id];
        n.attributes = {};
        
        attributes.forEach((attrKey) => {
          ok.assign(n.attributes, attrKey, ok.lookup(attrKey, d), stringCase);
        });
      
        if (relationships.length > 0) {
          n.relationships = {};
    
          relationships.forEach((rel) => {
            n.relationships[_.kebabCase(rel.rel)] = convert(rel.type, d[rel.rel]);
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
        ok.assign(resource.data.attributes, attrKey, ok.lookup(attrKey, data), stringCase);
      });
  
      if (relationships.length > 0) {
        resource.data.relationships = {};
  
        relationships.forEach((rel) => {
          resource.data.relationships[_.kebabCase(rel.rel)] = convert(rel.type, data[rel.rel]);
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
  function convert(type, data) {
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
        }
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
