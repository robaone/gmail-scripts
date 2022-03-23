class RecoverInterestingMail {
  constructor(gmailApp, properties){
    this.BATCH_LIMIT = properties?.limit ?? 100;
    this.gmailApp = gmailApp;
    this.searches = properties?.searches ?? [];
  }

  run() {
    const searches = this.getSearches();
    const recovered = new Array();
    searches.forEach(search =>{
      const {search_string, search_properties} = search;
      const threads = this.mailSearch(search_string, search_properties);
      threads.forEach(thread => thread.moveToInbox());
      recovered[0] = recovered[0] ? recovered[0] + threads.length : threads.length;
    });
    return recovered[0];
  }

  recoverEmail(thread) {
    thread.moveToInbox();
  }

  mailSearch(search_string, properties) {
    const threads = this.gmailApp.search(this.buildQuery(search_string,properties), 0, properties?.limit ?? this.BATCH_LIMIT);
    return threads;
  }

  getSearches() {
    return this.searches;
  }
  
  buildQuery(search_string,properties) {
    const queryArray = new Array();
    queryArray.push(search_string);
    ["after","before","label"].forEach(propertyName => {
      if(properties && properties[propertyName]) {
        queryArray.push(`${propertyName}:${properties[propertyName]}`);
      }
    });
    return queryArray.join(' ');
  }

}

class RecoverInterestingMailTest {
  constructor() {
    this.gmailApp = {};
  }
  before() {
    this.gmailApp = {};
    this.service = new RecoverInterestingMail(this.gmailApp, { 
      limit: 99, 
      searches: [
        {
          search_string: 'test',
          search_properties: undefined
        }
      ] 
    });
  }
  test_run() {
    const calls = { moveToInbox: 0};
    // GIVEN
    this.gmailApp.search = (_) => {
      const results = new Array(1);
      results.fill({
        moveToInbox: function () {
          console.log('moveToInbox()');
          calls.moveToInbox++;
        }
      })
      return results;
    };
    // WHEN
    const result = this.service.run();

    // THEN
    console.log(result);
    Assert(calls.moveToInbox).equals(1);
  }
  test_buildQuery() {
    // GIVEN
    const scenarios = [
      {
        properties: {
          after: '2022-01-01',
          before: '2022-03-01',
          label: "unread"
        },
        query: 'test after:2022-01-01 before:2022-03-01 label:unread'
      },
      {
        properties: {
          after: '2022-01-01',
          label: "unread"
        },
        query: 'test after:2022-01-01 label:unread'
      },
      {
        properties: {
          before: '2022-03-01',
          label: "unread"
        },
        query: 'test before:2022-03-01 label:unread'
      },
      {
        properties: {
          label: "unread"
        },
        query: 'test label:unread'
      },
      {
        properties: {
          after: '2022-01-01',
          before: '2022-03-01'
        },
        query: 'test after:2022-01-01 before:2022-03-01'
      },
      {
        properties: {
        },
        query: 'test'
      },
      {
        properties: undefined,
        query: 'test'
      }
    ];

    scenarios.forEach(scenario => {
      // WHEN
      const query = this.service.buildQuery('test',scenario.properties);

      // THEN
      Assert(query).equals(scenario.query);
    })
    

  }
  test_mailSearchWithoutLimit() {
    // GIVEN
    this.gmailApp.search = (_) => new Array(99);
    const search_string = 'test';
    const properties = {
      after: Utilities.formatDate(new Date(), Session.getTimeZone(), "yyyy-MM-dd"),
      before: Utilities.formatDate(new Date(), Session.getTimeZone(), "yyyy-MM-dd"),
      label: "unread"
    };

    // WHEN
    const result = this.service.mailSearch(search_string,properties);

    // THEN
    console.log(result.length);
    Assert(result.length).equals(99);
  }
  test_mailSearch() {
    // GIVEN
    this.gmailApp.search = (_) => new Array(10);
    const search_string = 'test';
    const properties = {
      after: Utilities.formatDate(new Date(), Session.getTimeZone(), "yyyy-MM-dd"),
      before: Utilities.formatDate(new Date(), Session.getTimeZone(), "yyyy-MM-dd"),
      label: "unread",
      limit: 10
    };

    // WHEN
    const result = this.service.mailSearch(search_string,properties);

    // THEN
    console.log(result.length);
    Assert(result.length).equals(10);
  }
}

function test_recoverInterestingMail() {
  new Test(new RecoverInterestingMailTest()).run();
}
