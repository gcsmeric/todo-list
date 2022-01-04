//Days of the week
const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'wkd'];
//Add event listeners to 'add' buttons
var listInputs = document.getElementsByClassName("list-input");
for (var i=0; i<listInputs.length; i++) {
    listInputs[i].addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            var day = e.target.id.slice(0, 3);
            addToList(day);
        }
    });
}

//Reloads data into the list
window.onload = function() {
    var items = {};
    items = window.localStorage.getItem("item-data");
    items = JSON.parse(items);
    for (var i = 0; i < Object.keys(items).length; i++) {
        for (var j = 0; j < Object.keys(items[days[i]]).length; j++) {
            loadToList(days[i], items[days[i]][j]);
        }
    }

    //Changing background colour of current day's div on page load
    var currentDay = getDay();
    document.getElementById(currentDay).style.background = "#D6D6D6";
    document.getElementById(currentDay).getElementsByClassName("day-title")[0].textContent += "(Today)";
}

//Adds a new an element to a list when the plus button is clicked
function addToList(day) {

    //Creating a new text element to add to the list
    var newNode = document.createElement("li");
    var nodeValue = document.createTextNode(document.getElementById(day + "-input").value);
    newNode.appendChild(nodeValue);
    newNode.addEventListener('click', changeState);
    newNode.className = "list-item-text";

    console.log(nodeValue.textContent)
    //Making sure that there is something to add
    if (nodeValue.textContent === "") {
        throw "Each list item must contain text!";
    }

    //Creating a push button (push the item to the next day)
    var pushButtonContainer = document.createElement("div");
    var pushButton = document.createTextNode(">");
    pushButtonContainer.appendChild(pushButton);
    pushButtonContainer.addEventListener("click", pushToNextDay);
    pushButtonContainer.className = "push-btn";

    //Creating a close button and appending it to the item to be added
    var closeButtonContainer = document.createElement("div");
    var closeButton = document.createTextNode("×");
    closeButtonContainer.appendChild(closeButton);
    closeButtonContainer.addEventListener("click", removeItem);
    closeButtonContainer.className = "close-btn";

    //Creating a container for a list item
    var listItemContainer = document.createElement("div");
    listItemContainer.className = "list-item-container";
    listItemContainer.appendChild(newNode);
    listItemContainer.appendChild(pushButtonContainer);
    listItemContainer.appendChild(closeButtonContainer);
    listItemContainer.draggable = "true";
    listItemContainer.addEventListener('dragstart', drag);
    listItemContainer.addEventListener('dragend', removeDragged);

    //Appending the new element to the list
    document.getElementById(day + "-list").appendChild(listItemContainer);
    document.getElementById(day + '-input').value = null;

    saveItems();

}

//Same as add to list, but takes an input
function loadToList(day, text) {
    
    //Creating a new text element to add to the list
    var newNode = document.createElement("li");
    var nodeValue = document.createTextNode(text.slice(2, text.length));
    newNode.appendChild(nodeValue);
    newNode.addEventListener('click', changeState);
    newNode.className = "list-item-text";
    if (text.slice(0,2) === "y-") {
        newNode.classList.add("text-checked");
    }

    //Creating a push button (push the item to the next day)
    var pushButtonContainer = document.createElement("div");
    var pushButton = document.createTextNode(">");
    pushButtonContainer.appendChild(pushButton);
    pushButtonContainer.addEventListener("click", pushToNextDay);
    pushButtonContainer.className = "push-btn";

    //Creating a close button and appending it to the item to be added
    var closeButtonContainer = document.createElement("div");
    var closeButton = document.createTextNode("×");
    closeButtonContainer.appendChild(closeButton);
    closeButtonContainer.addEventListener("click", removeItem);
    closeButtonContainer.className = "close-btn";


    //Creating a container for a list item
    var listItemContainer = document.createElement("div");
    listItemContainer.className = "list-item-container";
    if (text.slice(0,2) === "y-") {
        listItemContainer.classList.add("div-checked");
    }
    listItemContainer.appendChild(newNode);
    listItemContainer.appendChild(pushButtonContainer);
    listItemContainer.appendChild(closeButtonContainer);
    listItemContainer.draggable = "true";
    listItemContainer.addEventListener('dragstart', drag);
    listItemContainer.addEventListener('dragend', removeDragged);

    //Appending the new element to the list
    document.getElementById(day + "-list").appendChild(listItemContainer);
    document.getElementById(day + '-input').value = null;

    saveItems();

}
//Changes the state of a list item to checked when it is clicked
function changeState() {
    this.parentElement.classList.toggle("div-checked");
    this.classList.toggle("text-checked");
    saveItems();
}

//Removes a list item
function removeItem() {
    this.parentElement.remove();
    saveItems();
}

/*
//Pushes the item to the previous day when the blue button is clicked
function pushToPrevDay() {
    var curDay = this.parentElement.parentElement.id.slice(0,3);
    var parcel = this.parentElement;
    this.parentElement.remove();
    if (curDay === "mon") {
        document.getElementById('wkd-list').appendChild(parcel);
    } else {
        var i;
        for (i = 0; i < days.length; i++) {
            if (days[i] === curDay) {
                document.getElementById(days[i - 1] + '-list').appendChild(parcel);
                break;
            }
        }
    }
    saveItems();
}
*/

//Pushes the item to the next day when the blue button is clicked
function pushToNextDay() {
    var curDay = this.parentElement.parentElement.id.slice(0,3);
    var parcel = this.parentElement;
    this.parentElement.remove();
    if (curDay === "wkd") {
        document.getElementById('mon-list').appendChild(parcel);
    } else {
        var i;
        for (i = 0; i < days.length; i++) {
            if (days[i] === curDay) {
                document.getElementById(days[i + 1] + '-list').appendChild(parcel);
                break;
            }
        }
    }
    saveItems();
}

//Saving items to the local storage
function saveItems() {
    var items = {};
    for (var i = 0; i < days.length; i++) {
        var listChildren = document.getElementById(days[i] + '-list').children;
        var textDict = {};
        for (var j = 0; j < listChildren.length; j++) {
            var text = listChildren[j].querySelector("li").textContent;
            if (listChildren[j].querySelector("li").classList.contains("text-checked")) {
                textDict[j] = "y-" + text;
            } else {
                textDict[j] = "n-" + text;
            }
        }
        items[days[i]] = textDict;
    }
    window.localStorage.setItem("item-data", JSON.stringify(items));
}

//Obtaining current day 
function getDay() {
    var currentDate = new Date();
    var day = currentDate.getDay();
    var dayIndices = [5, 0, 1, 2, 3, 4, 5];
    var dayIndex = dayIndices[day];
    return days[dayIndex];
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.getElementsByClassName("list-item-text")[0].innerHTML);
    console.log(ev.target.getElementsByClassName("list-item-text")[0].innerHTML);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    data = "  " + data;
    loadToList(ev.target.id, data);

}

function removeDragged(ev) {
    ev.target.remove();
    saveItems();
}


