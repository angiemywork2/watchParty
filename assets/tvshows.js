    // Initialize Firebase
    var config = {

    apiKey: "AIzaSyBazdBYpQeMv8fiKWqMHAML593iRvUENNA",
    authDomain: "mywatchparty-94719.firebaseapp.com",
    databaseURL: "https://mywatchparty-94719.firebaseio.com",
    projectId: "mywatchparty-94719",
    storageBucket: "mywatchparty-94719.appspot.com",
    messagingSenderId: "847390956477"
    
    };

    firebase.initializeApp(config);

    var database = firebase.database();

    var showTitle = "";
    var showRating ="";
    var showPlot ="";
    var showNetwork = "";
    var showDay = "";
    var showTime = "";
    var showDuration = "";

    // day converting array 
    var showDOW = {
              Sunday: 0,
              Monday: 1,
              Tuesday: 2,
              Wednesday: 3,
              Thursday: 4,
              Friday: 5,
              Saturday: 6
            };
    
      // This .on("click") function will trigger the AJAX Call
      $("#find-tvShow").on("click", function(event) {

        // event.preventDefault() can be used to prevent an event's default behavior.
        // Here, it prevents the submit button from trying to submit a form when clicked
        event.preventDefault();

        // Here we grab the text from the input box
        var showTitle = $("#tvShow-input").val();

        var key = "40e9cece";
        var queryURL = "https://api.tvmaze.com/search/shows?q="+showTitle;
        var queryURLOMDB = "https://www.omdbapi.com/?t="+showTitle+"&y=&plot=short&apikey="+key;
        // http://api.tvmaze.com/search/shows?q=psych
        // http://www.omdbapi.com/?t=psych&y=&plot=short&apikey=40e9cece

        var ajaxResults;

        $.ajax({
            url: queryURL,
            method: "GET"
        })
          // After the data comes back from the API
          .then(function(response) {

              ajaxResults = response;

              return $.ajax({
                url: queryURLOMDB,
                method: "GET"
              })
          }) 
          .then(function(response){
            //console.log(ajaxResults);
            console.log(response);

            // Storing an array of results in the results variable
            var results = ajaxResults.data;

            var showTitle = ajaxResults[0].show.name;
            console.log("Show: "+showTitle);
            
            var showNetwork = ajaxResults[0].show.network.name;
            console.log("Network: " +showNetwork);
            
            var showDay = ajaxResults[0].show.schedule.days;
            console.log("Days: " +showDay);
            
            var showTime = ajaxResults[0].show.schedule.time;
            console.log("Time: " +showTime);
            
            var showTime2 = moment(showTime, 'LT').format('LT');
            
            console.log("Time 2: " +showTime2); 
            console.log("Time: "+ moment(showTime, 'LT').format('LT'));

            var title=response.Title;
            console.log("Title: "+title);

            var showRating = response.Rated;
            console.log("Rated: "+ showRating);

            var showPlot = response.Plot;
            console.log("Summary: "+ showPlot);
            

            var showDuration = response.Runtime;
            console.log("show Runtime : " + showDuration);

            //push to the database
            database.ref().push({
            showTitle:showTitle,
            showNetwork: showNetwork,
            showDay: showDay,
            showTime2: showTime2,
            showRating: showRating,
            showPlot: showPlot,
            dateAdded: firebase.database.ServerValue.TIMESTAMP   
            });

            //object that changes the Shows Run Day into numeral form
            var showDOW = {
              Sunday: 0,
              Monday: 1,
              Tuesday: 2,
              Wednesday: 3,
              Thursday: 4,
              Friday: 5,
              Saturday: 6
            };

            //variables storing data for Calendar Library input

            var showDayConverted = showDOW[showDay];
            console.log('showday converted:' + showDayConverted);

            var dayOfTheWeek = moment().format("d");
            console.log('current day of the week : ' + dayOfTheWeek); 

            var currentYear = moment().format('YYYY');
            console.log("current year is :" + currentYear);

            var currentDayOfMonth = moment().format("D");
            console.log("Day of the Month: " + currentDayOfMonth);

            var currentMonth =  moment().format("M");
            console.log("Current Month: " + currentMonth);

            var showHourConverted = showTime.substring(0,2);
            console.log("Start hour of show : " + showHourConverted)
            
            var showMinConverted = showTime.substring(3,5);
            console.log("Start min of show : " + showMinConverted);

            var currenthour= moment().format("H")
            console.log("current hour is: " + currenthour);

            var calendarMonth = currentMonth - 1;

            var nextEpisodeDay;

            var endOfShowMin;

            var endOfShowHr;

            // function to calculate how long the show will last with commercials included
            function showRuntimeCalc (){
              if (showDuration < 30){
                showDuration= 30;
                console.log(endOfShowMin);
                if (endOfShowMin == 60){
                  showDuration = 1;
                  endOfShowHr = showHourConverted + showDuration;
                  console.log(endOfShowHr);
                  endOfShowMin= 00;
                  console.log(endOfShowMin);
                }else {
                  endOfShowMin = 30;
                  endOfShowHr = showHourConverted;
                  console.log(endOfShowHr);
                  console.log(endOfShowMin);
                }
              }else if(showDuration > 30 && showDuration < 60){
                showDuration=1;
                endOfShowHr = showHourConverted + showDuration;
                endOfShowMin = showMinConverted;
                console.log(endOfShowHr);
                console.log(endOfShowMin);
              }else if (showDuration > 60){
                showDuration = 2;
                endOfShowHr = showHourConverted + showDuration;
                endOfShowMin = showMinConverted;
                console.log(endOfShowHr);
                console.log(endOfShowMin);
              }
            };
            //function that takes in the variables to set up the time for the calendar
            function addCalendarButton (){
              showRuntimeCalc ();

              $(".calendar").icalendar({start:
                new Date(currentYear,calendarMonth,nextEpisodeDay,showHourConverted,showMinConverted,00),
                end: new Date(currentYear,calendarMonth,nextEpisodeDay,endOfShowHr,endOfShowMin,00),
                title: showTitle,
                description: showPlot,
                location: "a planet near you"
              });

            };
            
            if (showDayConverted == dayOfTheWeek){
                console.log("show is today")
                if (currenthour < showHourConverted){
                  console.log("Make schedule for today");

                  showRuntimeCalc ();
                  
                  console.log("end of show hour: " + endOfShowHr);
                  console.log("end of show minutes: " + endOfShowMin);

                  $(".calendar").icalendar({start:
                    new Date(currentYear,calendarMonth,currentDayOfMonth,showHourConverted,showMinConverted,00),
                    end: new Date(currentYear,calendarMonth,currentDayOfMonth,endOfShowHr,endOfShowMin,00),
                    title: showTitle,
                    description: showPlot,
                    location: "a planet near you"
                  });

                }else{
                  console.log("Make show schedule for 7 days from now.")

                  nextEpisodeDay = moment().add(7,"days").format("D");
                  console.log(nextEpisodeDay);

                  addCalendarButton ();
                }
            }else {
              for (i=0; i<8; i++){

                var nextEpisodeDay = moment().add(i,"days").format("D");
                console.log("next Episode day: " + nextEpisodeDay);

                dayOfTheWeek++;
                if (dayOfTheWeek > 6){
                  dayOfTheWeek = -1;
                  dayOfTheWeek++;
                }

                console.log("current day = " + dayOfTheWeek);
                
                if(dayOfTheWeek == showDayConverted){
                  console.log("make show schedule");
                  break;

                  addCalendarButton ();

                }
              }
            }
            
          //clear input box
           $("#tvShow-input").val('');

        });
          database.ref().on("child_added", function(snapshot) {
          // Store everything into a variable.
          var showTitle = snapshot.val().showTitle;
          var showRating =snapshot.val().showRating;
          var showNetwork2 = snapshot.val().showNetwork;
          var showTime = snapshot.val().showTime2;
          var showPlot = snapshot.val().showPlot;
          var showDay = snapshot.val().showDay;

          // Add each tv show's data into the table
          $("#show-table > tbody").append("<tr><td>" + showTitle +"</td><td>" +showRating + "</td><td>" +showPlot+ "</td><td>" +showNetwork2+ "</td><td>" + showDay + "</td><td>" +showTime+"</td></tr>");

          $(".calendar").icalendar({start:
                new Date(2017,7,16,20,00,00),
                end: new Date(2017,7,16,22,00,00),
                title: "Show Title Here",
                description: "Show Plot Here",
                location: "A couch near you"
              });

          });

      });
