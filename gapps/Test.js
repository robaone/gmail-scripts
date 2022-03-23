class Test {
  constructor(testClass) {
    this.tests=testClass;
  }
  run() {
    const testingClass = this.tests;
    var methods=this.getAllMethodNames(testingClass).filter(method => method.startsWith('test_') || method === 'before');
    methods.filter(method => method.startsWith('test_')).forEach(method => {
      if( methods.includes('before') ) {
        testingClass.before();
      }
      testingClass[method]()
    });
  }

  getAllMethodNames(obj) {
    const methods = new Set();
    while(obj = Reflect.getPrototypeOf(obj)) {
      const keys = Reflect.ownKeys(obj);
      keys.forEach(k => methods.add(k));
    }
    return [...methods];
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
