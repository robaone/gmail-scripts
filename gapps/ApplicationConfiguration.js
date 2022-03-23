function configure() {
  const age = new Date();
  age.setDate(age.getDate() - 14);
  var startDate = Utilities.formatDate(age, Session.getTimeZone(), "yyyy-MM-dd");
  const searches = [
    {
      search_string: 'label:Other sunrun',
      search_properties: {
        after: startDate,
        label: "unread"
      }
    }
  ];
  const mailRecovery = new MailRecovery(GmailApp,{
    limit: 10,
    searches
  });
  return {
    mailRecovery: mailRecovery
  };
}
