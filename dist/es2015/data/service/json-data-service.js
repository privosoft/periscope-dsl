var _dec, _class;

import { DataService } from './data-service';
import * as _ from 'lodash';
import { inject, transient } from 'aurelia-framework';

export let JsonDataService = (_dec = transient(), _dec(_class = class JsonDataService extends DataService {

  constructor() {
    super();
    this._cache = {};
  }

  read(options) {
    let url = this.url;
    if (options.filter) url += this.filterParser ? this.filterParser.getFilter(options.filter) : options.filter;
    return this.httpClient.fetch(url).then(response => {
      return response.json();
    }).then(jsonData => {
      return {
        data: this.dataMapper ? this.dataMapper(jsonData) : jsonData,
        total: this.totalMapper ? this.totalMapper(jsonData) : jsonData.length
      };
    });
  }

}) || _class);