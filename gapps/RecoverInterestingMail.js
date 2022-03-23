class RecoverInterestingMail {
  constructor(gmailApp, properties){
    this.BATCH_LIMIT = properties?.limit ?? 100;
    this.gmailApp = gmailApp;
  }

  run() {

  }
  mailSearch(search_string, properties) {
    const threads = this.gmailApp.search(this.buildQuery(search_string,properties), 0, properties.limit ?? this.BATCH_LIMIT);
    return threads;
  }
  
  buildQuery(search_string,properties) {
    return search_string;
  }

}

class RecoverInterestingMailTest {
  constructor() {
    this.gmailApp = {};
  }
  before() {
    this.gmailApp = {};
    this.service = new RecoverInterestingMail(this.gmailApp, { limit: 99 });
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
