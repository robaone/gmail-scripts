const BATCH_LIMIT = 100;

function mailSearch(search_string, properties) {
  const threads = GmailApp.search(buildQuery(search_string,properties), 0, properties.limit ?? BATCH_LIMIT);
  return threads;
}

function buildQuery(search_string,properties) {
  return search_string;
}

function test_mailSearch() {
  const search_string = 'test';
  const properties = {
    after: Utilities.formatDate(new Date(), Session.getTimeZone(), "yyyy-MM-dd"),
    before: Utilities.formatDate(new Date(), Session.getTimeZone(), "yyyy-MM-dd"),
    label: "unread",
    limit: 10
  };
  const result = mailSearch(search_string,properties);
  console.log(result.length);
}
