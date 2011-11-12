/**
* Library Deets go here
* USE OUR CODES
* 
* Version 0.0.1
*
* // Constructor Parameters :
* {
*  url : "String - url to fetch data from",
*  jsonp : "boolean - true if this is a jsonp request",
*  delimiter : "String - a delimiter string that is used in a tabular datafile",
*  data : "Object - an actual javascript object that already contains the data",
*  table : "Element - a DOM table that contains the data",
*  format : "String - optional file format specification, otherwise we'll try to guess",
*  recursive : "Boolean - if true build nested arrays of objects as datasets",
*  strict : "Whether to expect the json in our format or whether to interpret as raw array of objects, default false",
*  parse : "function to apply to JSON before internal interpretation, optional"
* }
*/

(function(global) {

  var DS = function(options) {
    options = options || (options = {});

    this._options = options;
    this._buildData();
  };

  // CONSTS
  DS.datatypes = {
    UNKNOWN: "Unknown",
    NUMBER : 0,
    STRING : 1,
    BOOLEAN: 2, 
    ARRAY  : 3, 
    OBJECT : 4
  };

  // Public Methods
  _.extend(DS.prototype, {
    _buildData : function() {
      if (this._options.strict) {
        this._data = this._options.data;
        delete this._options.data;
      } else {
        this._data = this._normalizeData();
      }
    },

    _normalizeData : function() {
      //TODO preprocessing for CSV/TSV etc
      this._data = this._fromObject(options.data);
      delete options.data;
    },

    _fromObject : function() {
      //assumes array of objects, takes types from first row
      _.each(options.data[0], function(value, key) {
        //TODO fill in
      });
    },

    metadata : function() {

    },

    filter : function() {

    },

    transform : function() {

    },

    derive : function() {

    },

    sort : function() {

    },

    push : function() {

    },

    pop : function() {

    },

    columns : function(name) {

    },

    add : function() {

    },

    get : function(row, column) {

    },

    set : function(row, data, options) {

    },

    min : function() {

    },

    max : function() {

    },

    mean : function() {

    },

    mode : function() {

    },

    freq : function() {

    } 

  });

  /**
   * Returns the type of an input object.
   * Stolen from jQuery via @rwaldron (http://pastie.org/2849690)
   * @param {?} obj - the object being detected.
   */ 
  DS.typeOf = function(obj) {
    var classType = {},
      types = "Boolean Number String Function Array Date RegExp Object".split(" "),
      length = types.length,
      i = 0;
    for ( ; i < length; i++ ) {
      classType[ "[object " + types[ i ] + "]" ] = types[ i ].toLowerCase();
    }
    return obj == null ?
      String( obj ) :
      classType[ {}.toString.call(obj) ] || "object";
  };

  
  DS.Importers = function() {};
  _.extend(DS.Importers, {
    _buildColumn: function(name, type) {
      return {
        _id : _.uniqueId(),
        name : name,
        type : type
      };
    }
  });
  
  /**
   * Converts an array of objects to strict format.
   * @params {Object} obj = [{},{}...]
   */
  DS.Importers.Obj = function(data, options) {
    this._data = data;
  };
  _.extend(DS.Importers.Obj.prototype, {
    
    _buildColumns : function(n) {
      
      // Pick a sample of n (default is 5) rows
      (n || (n = 5)); 
      var sample = this._data.slice(0, n);
      
      // How many keys do we have?
      var keys  = _.keys(this._data[0]);
      
      // Aggregate the types. For each key,
      // check if the value resolution reduces to a single type.
      // If it does, call that your type.
      var types = _.map(keys, function(key) {
        
        // Build a reduced array of types for this key.
        // If we have N values, we are going to hope that at the end we
        // have an array of length 1 with a single type, like ["string"]
        var vals =  _.inject(this._data, function(memo, row) {
          if (memo.indexOf(DS.typeOf(row[key])) == -1)
            memo.push(DS.typeOf(row[key]));
            return memo;
        }, []); 
        
        if (vals.length == 1) {
          return DS.Importers._buildColumn(key, vals[0]);
        } else {
          return DS.Importers._buildColumn(key, DS.datatypes.UNKNOWN);
        }
      }, this);
      
      return types;
    },
    parse : function() {
      
      var d = {};
      
      // Build columns
      d.columns = this._buildColumns(this._data);
      
      // Build rows
      d.rows = _.map(this._data, function(row) {
        
        var r = {};
        
        // Assemble a row by iterating over each column and grabbing
        // the values in the order we expect.
        r.data = _.map(d.columns, function(column) {
          return row[column.name];
        });
        
        // TODO: add id plucking out of data, if exists.
        r._id = _.uniqueId();
        return r;
      });
      
      return d;
    }
  });
  
  DS.VERSION = "0.0.1";
  global.DS = DS;

}(this));
