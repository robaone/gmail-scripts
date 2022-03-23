const BATCH_LIMIT = 100;

function mailSearch(search_string, properties) {
  const threads = GmailApp.search(buildQuery(search_string,properties), 0, properties.limit ?? BATCH_LIMIT);
  return threads;
}

function buildQuery(search_string,properties) {
  return search_string;
}

class RecoverInterestingMailTest {
  test_mailSearchWithoutLimit() {
    // GIVEN
    const search_string = 'test';
    const properties = {
      after: Utilities.formatDate(new Date(), Session.getTimeZone(), "yyyy-MM-dd"),
      before: Utilities.formatDate(new Date(), Session.getTimeZone(), "yyyy-MM-dd"),
      label: "unread"
    };

    // WHEN
    const result = mailSearch(search_string,properties);

    // THEN
    console.log(result.length);
    Assert(result.length).equals(100);
  }
  test_mailSearch() {
    // GIVEN
    const search_string = 'test';
    const properties = {
      after: Utilities.formatDate(new Date(), Session.getTimeZone(), "yyyy-MM-dd"),
      before: Utilities.formatDate(new Date(), Session.getTimeZone(), "yyyy-MM-dd"),
      label: "unread",
      limit: 10
    };

    // WHEN
    const result = mailSearch(search_string,properties);

    // THEN
    console.log(result.length);
    Assert(result.length).equals(10);
  }
}

function test_recoverInterestingMail() {
  new Test(new RecoverInterestingMailTest()).run();
}
