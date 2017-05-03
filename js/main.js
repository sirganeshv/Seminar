/* Global constants required for Code */
const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

currSelectedDateID = "date-1";
currSelectedHallID = "cse";
selectedHours = [];

/************** Helper Functions *********************/

function getValues() {
  var dateIndex = parseInt(currSelectedDateID.slice(5,6));
  var dateValue = new Date();
  dateValue.setDate(dateValue.getDate()+dateIndex-1);  //Today's date + offset
  var hallValue = $(document.getElementById(currSelectedHallID)).val();
  return [dateValue, hallValue]
}

function showTableAndButton() {
    document.getElementById("button-container").style.display = "block";
    document.getElementById("status-table-container").style.display = "block";
}

function registerCheckBoxHandler() {
  function checkBoxChangeHandler() {
    if ($(this).prop('checked'))
      selectedHours.push($(this).val());
    else
      for(var i = 0; i < selectedHours.length; i++)
        if ($(this).val() == selectedHours[i]) {
          selectedHours.splice(i,1);
          break;
        }
  }

  /* TODO : This should be more specific as checkbox type is too broad */
  $(':checkbox').change(checkBoxChangeHandler);
}

function invokeDataHandler(handlerLocation, paramsObj, callBack) {
    $.post(handlerLocation, paramsObj, callBack);
}

function displaySchedule() {
  const [dateValue, hallValue] = getValues();
  invokeDataHandler(
                     "jsp/display.jsp",
                     {
                       date  : dateValue.getDate(),
                       month : months[dateValue.getMonth()],
                       year  : dateValue.getFullYear()-2000,
                       hall  : hallValue
                     },
                     (data,status) => {
                       var splitIndex = data.indexOf("stop");
                       var table1Contents = data.slice(0,splitIndex);
                       var table2Contents = data.slice(splitIndex+4,-1);
                       document.getElementById("status-table-1").rows[1].innerHTML = table1Contents;
                       document.getElementById("status-table-2").rows[1].innerHTML = table2Contents;
                       showTableAndButton();
                       registerCheckBoxHandler();
                     }
                   );
}

/************** Event Listeners **********************/
// NOTE : Check box handler is found above separately

function dateChangeListener() {
  currSelectedDateID = $(this).attr('id');
}

function hallChangeListener() {
  currSelectedHallID = $(this).attr('id');
  displaySchedule();
}

function bookHallListener() {
  const [dateValue, hallValue] = getValues();
  if(selectedHours.length === 0) {
    confirm("Please select an hour");
  }
  else {
    var staffId = prompt("Enter the your id:");
    selectedHours.forEach(
                          (hour) => {
                                      invokeDataHandler(
                                                        "jsp/book.jsp",
                                                        {
                                                          period   : hour,
                                                          date     : dateValue.getDate(),
                                                          month    : months[dateValue.getMonth()],
                                                          year     : dateValue.getFullYear()-2000,
                                                          hall     : hallValue,
                                                          staff_id : staffId
                                                        },
                                                        (data,status) => {
                                                          alert(data);
                                                        }
                                                      );
                                    }
                          );
    alert("The End !!!");
  }
  selectedHours = [];     //For testing
}

/************** Functions invoked during page load ********************/
function registerEvents() {
  $('#date-select').change(dateChangeListener);        // For date chosen through select (small screens)
  for (var i = 1; i <= 5; i++)
    $(`#date-${i}`).change(dateChangeListener);        // For date chose through radio (bigger screens)

  $('#halls-select').change(hallChangeListener);       // For halls chosen through select (small screens)
  for (var i = 1; i <= 7; i++)
    $(`#hall-${i}`).change(hallChangeListener);        // For halls chose through radio (bigger screens)

  $('#book').click(bookHallListener);
}

/*
    TODO: Dates to be loaded for select
*/
function loadDates() {
  currDate = new Date();
  for (var i = 1; i <= 5; i++) {
    var dateAndDay = currDate.getDate() + " " + days[currDate.getDay()];
    var dateAndDayText = document.createTextNode(dateAndDay)
    document.getElementById("date-"+i).setAttribute("value", dateAndDay);
    document.getElementById("date-label-"+i).appendChild(dateAndDayText);
    currDate.setDate(currDate.getDate()+1);
  }
}
