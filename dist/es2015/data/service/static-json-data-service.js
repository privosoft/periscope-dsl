var _dec, _dec2, _class;

import { inject, transient } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { DataService } from './data-service';
import { DataHelper } from './../../helpers/data-helper';
import { QueryExpressionEvaluator } from './../query-expression-evaluator';
import * as _ from 'lodash';

export let StaticJsonDataService = (_dec = transient(), _dec2 = inject(HttpClient), _dec(_class = _dec2(_class = class StaticJsonDataService extends DataService {
  constructor(http) {
    super();
    http.configure(config => {
      config.useStandardConfiguration();
    });
    this._http = http;
  }

  read(options) {
    return this._http.fetch(this.url).then(response => {
      return response.json();
    }).then(jsonData => {
      var d = jsonData;
      d = this.dataMapper ? this.dataMapper(d) : d;
      if (options.filter) {
        var evaluator = new QueryExpressionEvaluator();
        d = evaluator.evaluate(d, options.filter);
      }
      var total = d.length;

      if (options.sort) d = _.orderBy(d, [options.sort], [options.sortDir]);
      var l = options.skip + options.take;
      d = l ? _.slice(d, options.skip, l > d.length ? d.length : l) : d;
      if (options.fields && options.fields.length > 0) d = _.map(d, item => {
        return _.pick(item, options.fields);
      });
      return {
        data: DataHelper.deserializeDates(d),
        total: this.totalMapper ? this.totalMapper(jsonData) : total
      };
    });
  }

}) || _class) || _class);