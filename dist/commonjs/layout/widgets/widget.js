"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Widget = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require("lodash");

var _ = _interopRequireWildcard(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Widget = exports.Widget = function () {
  function Widget(settings) {
    _classCallCheck(this, Widget);

    this._settings = settings;
    this._behaviors = [];
  }

  Widget.prototype.getStateKey = function getStateKey() {
    if (this.stateStorage) return this.stateStorage.createKey(this.dashboard.name, this.name);
    return "";
  };

  Widget.prototype.getState = function getState() {
    if (this.stateStorage) {
      var s = this.stateStorage.get(this.getStateKey());
      if (s) return s;
    }
    return undefined;
  };

  Widget.prototype.setState = function setState(value) {
    if (this.stateStorage) {
      if (!value) this.stateStorage.remove(this.getStateKey());else this.stateStorage.set(this.getStateKey(), value);
    }
  };

  Widget.prototype.attachBehavior = function attachBehavior(behavior) {
    behavior.attachToWidget(this);
  };

  Widget.prototype.attachBehaviors = function attachBehaviors() {
    if (this.settings.behavior) {
      for (var _iterator = this.settings.behavior, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var b = _ref;

        this.attachBehavior(b);
      }
    }
  };

  Widget.prototype.changeSettings = function changeSettings(newSettings) {
    var _this = this;

    if (newSettings) {
      _.forOwn(newSettings, function (v, k) {
        _this.settings[k] = v;
      });
      this.refresh();
    }
  };

  Widget.prototype.refresh = function refresh() {};

  Widget.prototype.dispose = function dispose() {
    while (true) {
      if (this.behaviors.length > 0) this.behaviors[0].detach();else break;
    }
  };

  _createClass(Widget, [{
    key: "self",
    get: function get() {
      return this;
    }
  }, {
    key: "settings",
    get: function get() {
      return this._settings;
    }
  }, {
    key: "behaviors",
    get: function get() {
      return this._behaviors;
    }
  }, {
    key: "name",
    get: function get() {
      return this.settings.name;
    }
  }, {
    key: "resourceGroup",
    get: function get() {
      return this.settings.resourceGroup;
    }
  }, {
    key: "minHeight",
    get: function get() {
      return this.settings.minHeight;
    },
    set: function set(value) {
      this.settings.minHeight = value;
    }
  }, {
    key: "stateType",
    get: function get() {
      return this._type;
    },
    set: function set(value) {
      this._type = value;
    }
  }, {
    key: "showHeader",
    get: function get() {
      return this.settings.showHeader;
    }
  }, {
    key: "dataHolder",
    set: function set(value) {
      this._dataHolder = value;
    },
    get: function get() {
      return this._dataHolder;
    }
  }, {
    key: "header",
    get: function get() {
      return this.settings.header;
    },
    set: function set(value) {
      this.settings.header = value;
    }
  }, {
    key: "stateStorage",
    get: function get() {
      return this.settings.stateStorage;
    }
  }, {
    key: "dataSource",
    set: function set(value) {
      this.settings.dataSource = value;
    },
    get: function get() {
      return this.settings.dataSource;
    }
  }, {
    key: "dataMapper",
    get: function get() {
      return this.settings.dataMapper;
    }
  }, {
    key: "dataFilter",
    get: function get() {
      return this._dataFilter;
    },
    set: function set(value) {
      this._dataFilter = value;
    }
  }, {
    key: "type",
    get: function get() {
      return this._type;
    }
  }, {
    key: "dashboard",
    get: function get() {
      return this._dashboard;
    },
    set: function set(value) {
      this._dashboard = value;
    }
  }]);

  return Widget;
}();