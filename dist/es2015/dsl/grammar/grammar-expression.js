import { Grammar } from './grammar';
import { DataHelper } from './../../helpers/data-helper';

const DSL_GRAMMAR_EXPRESSION = `
{
function createStringExpression(fieldname, value){
 		var prefix = "record.";
 		var result = "";
 		var v = value.trim().toLowerCase();
        if (v.length>=2){
          if ((v.indexOf("%")===0)&&(v.lastIndexOf("%")===(v.length-1)))
              result = prefix + fieldname + ".toLowerCase().includes('" + v.substring(1,value.length-1) + "')"
          else if (v.indexOf("%")===0)
              result = prefix + fieldname + ".toLowerCase().endsWith('" + v.substring(1,value.length) + "')"
          else if (v.lastIndexOf("%")===(value.length-1))
              result = prefix + fieldname + ".toLowerCase().startsWith('" + v.substring(0,value.length-1) + "')"
        }
        if (result == "")
          result = prefix + fieldname + ".toLowerCase() == '" + v + "'";

        result="(" + prefix + fieldname + "!=null && " + result + ")"

        return result;
 }
  function createInExpression (fieldname, value) {
    var result = "";
    var values = value.split(',');
    for (var i=0;i<values.length;i++)
    {
      var find = '[\\"\\']';
      var re = new RegExp(find, 'g');
      var v = values[i].replace(new RegExp(find, 'g'), "");
      //result += "record." + fieldname + ".toLowerCase() ==" + v.trim().toLowerCase();
      result += createStringExpression(fieldname, v)
      if (i<(values.length-1))
        result += " || ";
    }
    if (result.length>0)
      result = "(" + result + ")"
    return result;
  }
}

start = expression

expression = c:condition j:join e:expression space? {return c+j+e;}
           / c:condition space? {return c;}

join "LOGIC_OPERATOR"
     = and
     / or

and = space* "and"i space* {return " && ";}

or = space* "or"i space* {return " || ";}


condition = space? f:stringField o:op_eq v:stringValue {return createStringExpression(f,v);}
          / space? f:stringField o:op_in a:valuesArray {return createInExpression(f,a);}
          / space? f:numericField o:op v:numericValue {return "record." + f + o + v;}
          / space? f:dateField o:op v:dateValue {return "record." + f + o + v;}
          / "(" space? e:expression space* ")" space* {return "(" + e +")";}



valuesArray "STRING_VALUES_ARRAY"
      = parentheses_l va:$(v:stringValue space* nextValue*)+ parentheses_r {return  va }

nextValue = nv:(space* "," space* v:stringValue) {return  nv}



dateValue "DATE_VALUE"
        = quote? dt:$(date+) quote? {return "'" + dt + "'";}


stringValue  "STRING_VALUE"
	  = quote w:$(char+) quote {return  w }
      / quote quote {return "";}


numericValue  "NUMERIC_VALUE"
       = $(numeric+)


op "OPERATOR"
   = op_eq
   / ge
   / gt
   / le
   / lt

op_eq "STRING_OPERATOR_EQUAL"
  = eq
  / not_eq

op_in "STRING_OPERATOR_IN"
  = in

eq = space* "=" space* {return "==";}

not_eq = space* "!=" space* {return "!=";}

gt = space* v:">" space* {return v;}

ge = space* v:">=" space* {return v;}

lt = space* v:"<" space* {return v;}

le = space* v:"<=" space* {return v;}

in = space* v:"in" space* {return v;}


date = [0-9 \\:\\/]

char = [a-z0-9 \\%\\$\\_\\-\\:\\,\\.\\/]i

numeric = [0-9-\\.]

space = [ \\t\\n\\r]+

parentheses_l = [\\(] space*

parentheses_r = space* [\\)]

field "FIELD_NAME"
      = stringField
     / numericField
     / dateField

stringField "STRING_FIELD_NAME"
     = @S@

numericField "NUMERIC_FIELD_NAME"
     = @N@

dateField "DATE_FIELD_NAME"
     = @D@

quote = [\\'\\"]


`;

export let GrammarExpression = class GrammarExpression extends Grammar {
  constructor(dataFields) {
    super();
    this.text = DSL_GRAMMAR_EXPRESSION;
    this.dataFields = dataFields;
  }

  getGrammar() {
    let stringFieldList = _.map(DataHelper.getStringFields(this.dataFields), "field");
    let numericFieldList = _.map(DataHelper.getNumericFields(this.dataFields), "field");
    let dateFieldList = _.map(DataHelper.getDateFields(this.dataFields), "field");
    let parserText = this.text.replace('@S@', this._concatenateFields(stringFieldList)).replace('@N@', this._concatenateFields(numericFieldList)).replace('@D@', this._concatenateFields(dateFieldList));
    return parserText;
  }

  _concatenateFields(fieldList) {
    for (var i = 0; i < fieldList.length; i++) {
      fieldList[i] = '\'' + fieldList[i] + '\'i';
    }
    if (fieldList.length > 0) return fieldList.join('/ ');else return "'unknown_field'";
  }
};