import * as _ from 'lodash';
import {Query} from './../data/query';

export class IntellisenceManager {
  constructor(parser, dataSource, availableFields){
    this.dataSource = dataSource;
    this.fields = availableFields;
    this.parser = parser;
  }

  populate(searchStr, lastWord){
    let parserError = this._getParserError(searchStr);
    return this._getIntellisenseData(searchStr, lastWord, parserError);
  }


  _getParserError(searchStr) {
    let result = null;
    if (searchStr!="") {
      try {
        this.parser.parse(searchStr);
        try{
          this.parser.parse(searchStr + "^");
        }
        catch(ex2){
          result = ex2;
        }
      }
      catch (ex) {
        result = ex;
      }
    }
    return result;
  }



  _getLastFieldName(searchStr, fieldsArray, index) {
    var tmpArr = searchStr.substr(0, index).split(" ");
    for (let i=(tmpArr.length-1); i>=0; i--)  {
      let j = fieldsArray.findIndex(x=>x.toLowerCase() == tmpArr[i].trim().toLowerCase());
      if (j>=0)
        return fieldsArray[j];
      //return tmpArr[i].trim();
    }
    return "";
  }

  _interpreteParserError(ex){
    if (Object.prototype.toString.call(ex.expected) == "[object Array]") {
      for (let desc of ex.expected) {
        if ((desc.type == "other")||(desc.type == "end")) {//"FIELD_NAME" "OPERATOR" "FIELD_VALUE", "LOGIC_OPERATOR"
          return desc.description;
        }
      }
    }
    return "";
  }

  _getIntellisenseData (searchStr, lastWord, pegException) {
    let type='';
    let result = [];
    let lastFldName = '';

    if (!pegException)
      return new Promise((resolve, reject)=>{ resolve([])});

    let tokenName = this._interpreteParserError(pegException);
    return new Promise((resolve, reject)=>{
      switch (tokenName) {
        case "STRING_FIELD_NAME":
        case "NUMERIC_FIELD_NAME":
        case "DATE_FIELD_NAME":
          var filteredFields = lastWord? _.filter(this.fields,f=>{return f.toLowerCase().startsWith(lastWord.toLowerCase())}) : this.fields;
          resolve(this._normalizeData("field", filteredFields.sort()));
          break;
        case "STRING_OPERATOR_EQUAL":
        case "STRING_OPERATOR_IN":
          resolve(this._normalizeData("operator", this._getStringComparisonOperatorsArray()));
          break;
        case "STRING_VALUE":
        case "STRING_PATTERN":
          lastFldName = this._getLastFieldName(searchStr, this.fields, pegException.column);
          this._getFieldValuesArray(lastFldName, lastWord).then(data=>{
            resolve(this._normalizeData("string", data))
          });
          break;
        case "STRING_VALUES_ARRAY":
          lastFldName = this._getLastFieldName(searchStr, this.fields, pegException.column);
          this._getFieldValuesArray(lastFldName, lastWord).then(data=>{
            resolve(this._normalizeData("array_string", data))
          });
          break;
          resolve(this._normalizeData("array_string", []));
          break;
        case "OPERATOR":
          resolve(this._normalizeData("operator", this._getComparisonOperatorsArray()));
          break;
        case "LOGIC_OPERATOR":
        case "end of input":
          resolve(this._normalizeData("operator", this._getLogicalOperatorsArray()));
          break;
        default:
          resolve([]);
          break;
      }
    });
  }


  _getFieldValuesArray(fieldName, lastWord) {
    let query = new Query();
    query.take = 100;
    query.skip = 0;
    if (lastWord)
      query.filter = this.parser.parse(fieldName + " = '" + lastWord + "%'");
    query.fields = [fieldName];
    return this.dataSource.getData(query).then(dH=>{
      var result = _.map(dH.data,fieldName);
      return _.uniq(result).sort();
    })
  }

  _getStringComparisonOperatorsArray() {
    return (["=", "in"]);
  }

  _getLogicalOperatorsArray() {
    return (["and", "or"]);
  }

  _getComparisonOperatorsArray() {
    return (["!=", "=", ">", "<", ">=", "<="])
  }

  _normalizeData(type, dataArray) {
    return _.map(dataArray,d=>{ return { type: type, value: d }});
  }
}
