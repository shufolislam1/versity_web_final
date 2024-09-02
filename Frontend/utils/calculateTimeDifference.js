function timeDifference(dateTimeString) {
    const now = new Date();
    const past = new Date(dateTimeString);
  
    let timediff = Math.floor((now - past) / 1000);
  
    const days = Math.floor(timediff / (60*60*24));
    timediff -= days * 24 * 3600;
  
    const hours = Math.floor(timediff / 3600);
    timediff -= hours * 3600;
  
    const minutes = Math.floor(timediff / 60);
    const seconds = timediff - minutes*60;
  
    let result = "";
    if (days > 0) {
      result = result + `${days} days`;
    } else if (hours > 0) {
      result = result + `${hours} hours`;
    } else if (minutes > 0) {
      result = result +`${minutes} minutes`;
    } else {
      result = result +`${seconds} seconds`;
    }
  
    return result;
  }
