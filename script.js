let doses = JSON.parse(localStorage.getItem("doses")) || []
let timelineData = JSON.parse(localStorage.getItem("timeline")) || []

function createSchedule(){

let drug=document.getElementById("drug").value
let doseAmount=document.getElementById("dose").value
let frequency=parseInt(document.getElementById("frequency").value)
let duration=parseInt(document.getElementById("duration").value)
let start=document.getElementById("startTime").value

doses=[]

let startHour=parseInt(start.split(":")[0])
let startMin=parseInt(start.split(":")[1])

let id=1

for(let d=0; d<duration; d++){

for(let f=0; f<frequency; f++){

let hour=startHour + (24/frequency)*f

doses.push({
id:id++,
drug:drug,
dose:doseAmount,
status:"pending",
time:`Day ${d+1} - ${Math.floor(hour)}:${startMin}`
})

}

}

saveData()
render()

}

function render(){

let schedule=document.getElementById("schedule")
schedule.innerHTML=""

doses.forEach(d=>{

let div=document.createElement("div")
div.className="doseCard"

div.innerHTML=`
<b>${d.time}</b> - ${d.drug} (${d.dose} mg)
<br>

<button onclick="logDose(${d.id},'taken')">Taken</button>
<button onclick="logDose(${d.id},'late')">Late</button>
<button onclick="logDose(${d.id},'missed')">Missed</button>

<p class="${d.status}">${d.status}</p>
`

schedule.appendChild(div)

})

renderTimeline()
updateDashboard()

}

function logDose(id,status){

let dose=doses.find(d=>d.id===id)

dose.status=status

timelineData.unshift(`${dose.time} - ${dose.drug} - ${status}`)

saveData()
render()

}

function updateDashboard(){

let taken=doses.filter(d=>d.status==="taken").length
let missed=doses.filter(d=>d.status==="missed").length
let late=doses.filter(d=>d.status==="late").length

let total=doses.length

document.getElementById("total").innerText=total
document.getElementById("taken").innerText=taken
document.getElementById("missed").innerText=missed
document.getElementById("late").innerText=late

let adherence=((taken+late)/total*100)||0

document.getElementById("adherence").innerText=adherence.toFixed(1)+"%"

safetyCheck()

}

function renderTimeline(){

let list=document.getElementById("timeline")

list.innerHTML=""

timelineData.forEach(t=>{

let li=document.createElement("li")

li.innerText=t

list.appendChild(li)

})

}

function safetyCheck(){

let alertBox=document.getElementById("alerts")

let missedStreak=0
let maxStreak=0

doses.forEach(d=>{

if(d.status==="missed"){
missedStreak++
}else{
missedStreak=0
}

if(missedStreak>maxStreak){
maxStreak=missedStreak
}

})

if(maxStreak>=3){

alertBox.innerText="⚠ Safety Warning: Multiple doses missed consecutively."

}else{

alertBox.innerText=""

}

}

function saveData(){

localStorage.setItem("doses",JSON.stringify(doses))
localStorage.setItem("timeline",JSON.stringify(timelineData))

}

render()