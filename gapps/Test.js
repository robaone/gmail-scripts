function Test(testClass) {
  this.tests = testClass;
  this.run = function(){
    var keys = Object.keys(this.tests);
    keys.forEach(k => k.startsWith('test_') ? this.tests[k]() : null);
  }
};

function Assert(value) {
  return {
    value: value,
    equals: function(expectedValue) {
      if(this.value != expectedValue){
        throw new Error(`Expected ${expectedValue} but got ${this.value}`);
      }
    }
  }
}
