export let ExpressionParser = class ExpressionParser {

  constructor(pegParser) {
    this.parser = pegParser;
  }

  parse(searchString) {
    return this.parser.parse(searchString);
  }

  validate(searchString) {
    try {
      this.parser.parse(searchString);
      return true;
    } catch (ex) {
      return false;
    }
  }

};