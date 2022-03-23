// The name of the Gmail Label that is to be autopurged?
var GMAIL_SEARCHES = ["unsubscribe","category:updates","category:promotions","You got this update because you created this task","Opt-out","stop receiving future updates","If this wasn't you","You are receiving this email"];    

// Purge messages automatically after how many days?
var PURGE_AFTER = "90";

function purgeGmail() {
  for(var i = 0; i < GMAIL_SEARCHES.length;i++){
    purgeSearch(GMAIL_SEARCHES[i]);
  }
}


function purgeSearch(search_str){
  var age = new Date();  
  age.setDate(age.getDate() - PURGE_AFTER);   
  var purge  = Utilities.formatDate(age, Session.getTimeZone(), "yyyy-MM-dd");
  var search = search_str +" before:" + purge + " label:unread";

  // This will create a simple Gmail search 
  // query like label:Newsletters before:10/12/2012
  
  try {
    
    // We are processing 100 messages in a batch to prevent script errors.
    // Else it may throw Exceed Maximum Execution Time exception in Apps Script

    var threads = GmailApp.search(search, 0, 100);
    

    // For large batches, create another time-based trigger that will
    // activate the auto-purge process after 'n' minutes.
    /*
    try{
      if (threads.length == 100) {
        ScriptApp.newTrigger("purgeGmail")
        .timeBased()
        .at(new Date((new Date()).getTime() + 1000*60+10))
        .create();
      }else{
        ScriptApp.newTrigger("purgeGmail")
        .timeBased()
        .after(1000*60*60*24)
        .create()
      }
    }catch(e){
      console.log(e);
    }
    */

    // An email thread may have multiple messages and the timestamp of 
    // individual messages can be different.
    console.log("Deleting "+threads.length+" threads from search: " + search);
    for (var i=0; i<threads.length; i++) {
      var messages = GmailApp.getMessagesForThread(threads[i]);
      for (var j=0; j<messages.length; j++) {
        var email = messages[j];       
        if (email.getDate() < age) {
          email.moveToTrash();
        }
      }
    }
    console.log("Done");
    
  // If the script fails for some reason or catches an exception, 
  // it will simply defer auto-purge until the next day.
  } catch (e) {
    console.log(e);
  }
  
}
