/* 
  Display next meeting information, via Meetup API
  API Docs: http://www.meetup.com/meetup_api/docs/2/events/
*/
$.ajax({
    type: "POST",
    dataType: 'jsonp',
    url: 'https://api.meetup.com/2/events?status=upcoming&order=time&limited_events=False&group_urlname=Rhode-Island-Code-for-America-Brigade&desc=false&offset=0&photo-host=public&format=json&page=20&fields=rsvpable%2Cself&sig_id=182593829&sig=c59d1f16dccd434dd2b6b2fff959faabc53ec885',
    crossDomain : true,
    xhrFields: {
        withCredentials: true
    }
})
    .done(function( xhr, textStatus, response, data, responseJSON ) {

      
      if (xhr.results[0] == undefined) { // If there is no upcoming event posted on Meetup...

        document.getElementById("meetupDetails").innerHTML = 'TBD (check back soon)';                            // Meeting date & place
        document.getElementById("meetupRSVP").style.display = 'none';                                            // RSVP info
        document.getElementById("meetupCTA").innerHTML = 'Join Our Meetup';                                      // Call to Action text        
        document.getElementById("meetupCTA").href = 'http://meetup.com/Rhode-Island-Code-for-America-Brigade/';  // Call to Action link
      
      } else { // Otherwise...

        /*
         *  Gather the Variables
         */
        
          // Next Event
          var nextEvent = xhr.results[0] // First event in the array returned from API
            
            // Permalink
            var eventURL = nextEvent.event_url  // URL

            // Location
            if (nextEvent.venue != undefined) {
              var eventLocation = nextEvent.venue.name                                  // Location
              // Normal
              var eventAddress = nextEvent.venue.address_1                              // Address
              var eventLatitude = nextEvent.venue.lat                                   // Latitutde
              var eventLongitude = nextEvent.venue.lon                                  // Longitude
              var eventCity = nextEvent.venue.city                                      // City
              var eventState = nextEvent.venue.state                                    // State
              // Formatted for Gmaps
              var gmapAddress = eventAddress.split(' ').join('+').slice(0,-1)+','       // Address              
              var gmapLat = '@'+eventLatitude+','                                       // Latitude  
              var gmapLon = eventLongitude+',13z'                                       // Longitude  
              var gmapCity = '+'+eventCity+','                                          // City  
              var gmapState = '+'+eventState+'/'                                        // State  
              // Gmaps Link
              var gmapStart = 'https://www.google.com/maps/place/'                      // Beginning of URL
              var gmapLink = gmapStart+gmapAddress+gmapCity+gmapState+gmapLat+gmapLon;  // Complete URL
            } else {
              var eventAddress = 'TBD'   // Address
              var gmapLink = eventURL    // URL
            }

            // RSVP
            var headCount = nextEvent.yes_rsvp_count;                                           // Head Count (total number of 'yes' responses)
            if (nextEvent.self.rsvp != undefined) {
              var RSVPstatus = nextEvent.self.rsvp.response                                     // RSVP Response ("yes or no") of visitor, only if already RSVP'ed
              if (RSVPstatus == "yes") {
                RSVPMessage = headCount+" do-gooders will be there — including you. Yay!"       // "Yes" RSVP Message
                CTA = "View Details"                                                            // "Yes" Call to Action
              } else {
                RSVPMessage = headCount+" do-gooders will be there — and you will be missed."   // "No" RSVP Message
                CTA = "Change RSVP"                                                             // "No" Call to Action
              }
            } else {
              RSVPMessage = headCount+" do-gooders will be there — what about you?"             // (No Response) RSVP Message
              CTA = "RSVP on Meetup"                                                            // (No Response) Call to Action
            }

            // Date & Time

              // Now
              var now = new Date;                                                 // Get Today's Date  
              var todayMonth = now.getMonth()                                     // Month  
              var todayNumber = now.getDate()                                     // Number  
              var todayTime = formatAMPM(now)                                     // Time (formatted)

              // Next Event
              var date = new Date(nextEvent.time)                                 // Get Next Event's Date
              var dateYear = date.getFullYear()                                   // Year
              var dateMonth = date.getMonth()                                     // Month
              var dateDay = date.getDay()                                         // Day
              var dateNumber = date.getDate()                                     // Number
              var dateTime = formatAMPM(date)                                     // Time (formatted)

              // Formatting
              var m_names = new Array("January", "February", "March",             // Month
              "April", "May", "June", "July", "August", "September", 
              "October", "November", "December");
              var d_names = new Array("Sunday", "Monday", "Tuesday",              // Day
              "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"); 
              function formatAMPM(date) {                                         // Time
                var hours = date.getHours();  
                var minutes = date.getMinutes();
                var ampm = hours >= 12 ? 'pm' : 'am';
                hours = hours % 12;
                hours = hours ? hours : 12; // the hour '0' should be '12'
                minutes = minutes < 10 ? '0' + minutes : minutes;
                var strTime = hours + ':' + minutes + ' ' + ampm;
                return strTime;
              }

              // Final Variables
              if ( (todayNumber == dateNumber) && (todayMonth == dateMonth) ) { 
                var prettyDate = 'Tonight at ' + dateTime;                        // If today
              } else { 
                var prettyDate = d_names[dateDay]+', '+m_names[dateMonth]+' '
                +dateNumber+', '+dateYear+' at '+ dateTime;                       // Otherwise
              }

        /*
         *  Do Stuff with the Variables
         */

          // Date & Time 
          document.getElementById("meetupDate").innerHTML = prettyDate;        // Date & Time

          // Location 
          document.getElementById("meetupLocation").innerHTML = eventAddress;  // Location name
          document.getElementById("meetupLocation").href = gmapLink;           // Location link (gmaps)

          // RSVP 
          document.getElementById("meetupRSVP").innerHTML = RSVPMessage;       // RSVP Total + Visitor's Status       
          
          // Button          
          document.getElementById("meetupCTA").innerHTML = CTA;                // Call to Action Text
          document.getElementById("meetupCTA").href = eventURL;                // Call to Action Link
        
      }

    })

    .fail( function(xhr, textStatus, errorThrown) {
      alert(xhr.responseText);
      alert(textStatus);
    });