document.addEventListener('DOMContentLoaded', function () {

var calendarEl = document.getElementById('calendar');

if(calendarEl){

var calendar = new FullCalendar.Calendar(calendarEl, {

initialView: 'dayGridMonth',

events: [
{
title: 'Inspección - Finca El Progreso',
start: '2026-03-22'
},
{
title: 'Inspección - Hacienda San José',
start: '2026-03-25'
}
]

});

calendar.render();

}

});