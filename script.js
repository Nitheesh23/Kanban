const addBtn = document.querySelector(".add-btn");
const modelBox = document.querySelector(".modal-cont");
const submitBtn = document.querySelector(".submit-btn");
const allPriorityColors = document.querySelectorAll(".priority-color");
const deleteBtn = document.querySelector(".remove-btn");
const textArea = document.querySelector(".textArea-cont");
const ColorChange = ['lightpink', 'lightgreen', 'lightblue', 'black'];
const toolBoxPriorityColors = document.querySelectorAll('.color-box');
const showAllButton = document.querySelector('.show-all-btn');


let storingAllTheTickets = [];

try {
    const getFromLocalStorage = localStorage.getItem("storingAllTheTickets");
    if (getFromLocalStorage) {
        storingAllTheTickets = JSON.parse(getFromLocalStorage);
        storingAllTheTickets.forEach(function (ticket) {
            createTicket(ticket.id, ticket.ticketTaskValue, ticket.ticketColor);
        });
    }
} catch (error) {
    console.error("Error parsing localStorage data:", error);
}


let openLock = "fa-lock-open";
let closeLock = "fa-lock";
let modelPriorityColor = "lightpink";
modelBox.style.display = "none";
let addTaskFlag = false;
let removeTaskFlag = false;

// Toggle modal display
addBtn.addEventListener("click", function () {
    addTaskFlag = !addTaskFlag;
    modelBox.style.display = addTaskFlag ? "flex" : "none";
});

// Toggle delete button activation
deleteBtn.addEventListener("click", function () {
    removeTaskFlag = !removeTaskFlag;
    deleteBtn.style.color = removeTaskFlag ? "red" : "white";
    alert(removeTaskFlag ? "Trash Button is Activated" : "Trash Button is Deactivated");
});

submitBtn.addEventListener("click", function () {
    let taskValue = textArea.value;
    createTicket(null, taskValue, modelPriorityColor);
    textArea.value = "";
});

function createTicket(ticketId, ticketTaskValue, ticketColor) {
    let id = ticketId || shortid();
    let ticketCont = document.createElement("div");
    ticketCont.setAttribute("class", "ticket-cont");
    ticketCont.setAttribute("data-locked", "true"); // Initial state is locked
    ticketCont.innerHTML = `
        <div class="ticket-color ${ticketColor}"></div>
        <div class="ticket-id">${id}</div>
        <div class="ticket-task">${ticketTaskValue}</div>
        <div class="ticket-lock">
            <i class="fa-solid fa-lock"></i>
        </div>`;
    let mainCont = document.querySelector(".main-cont");
    mainCont.appendChild(ticketCont);
    modelBox.style.display = "none";
    handleLock(id, ticketCont);
    ticketRemoval(id, ticketCont);
    handlePriorityColor(id, ticketCont);
    if (ticketId === null) {
        storingAllTheTickets.push({ id, ticketTaskValue, ticketColor });
        localStorage.setItem("storingAllTheTickets", JSON.stringify(storingAllTheTickets))
    }
}

// Handle color selection
allPriorityColors.forEach(function (colorElement) {
    colorElement.addEventListener("click", function () {
        allPriorityColors.forEach(function (priorityColorEle) {
            priorityColorEle.classList.remove("active");
        });
        colorElement.classList.add("active");
        modelPriorityColor = colorElement.classList[1];
    });
});

function handleLock(id, ticket) {
    let ticketLockElement = ticket.querySelector(".ticket-lock");
    let ticketLockIcon = ticketLockElement.children[0];
    let ticketTaskArea = ticket.querySelector(".ticket-task");

    ticketLockIcon.addEventListener("click", function () {
        if (ticketLockIcon.classList.contains(closeLock)) {
            ticketLockIcon.classList.remove(closeLock);
            ticketLockIcon.classList.add(openLock);
            ticketTaskArea.setAttribute("contenteditable", "true");
            ticket.setAttribute("data-locked", "false"); // Set unlock state
        } else {
            ticketLockIcon.classList.remove(openLock);
            ticketLockIcon.classList.add(closeLock);
            ticketTaskArea.setAttribute("contenteditable", "false");
            ticket.setAttribute("data-locked", "true"); // Set lock state
            let idx = storingAllTheTickets.findIndex(function(ticket){
                return ticket.id === id
            })

            storingAllTheTickets[idx].ticketTaskValue = ticketTaskArea.textContent;
            localStorage.setItem("storingAllTheTickets", JSON.stringify(storingAllTheTickets))
        }
    });
}

function ticketRemoval(id, ticket) {
    ticket.addEventListener("click", function () {
        if (removeTaskFlag) {
            ticket.remove();
            storingAllTheTickets = storingAllTheTickets.filter(function(ticket){
                return ticket.id !== id
            })
            localStorage.setItem("storingAllTheTickets", JSON.stringify(storingAllTheTickets))
        }
        
    });
}

function handlePriorityColor(id, ticket) {
    const ticketColorBand = ticket.querySelector('.ticket-color');
    ticketColorBand.addEventListener('click', function () {
        // Check if ticket is unlocked before allowing color change
        if (ticket.getAttribute("data-locked") === "false") {
            let currentColor = ticketColorBand.classList[1];
            let currentColorIdx = ColorChange.findIndex(color => color === currentColor);
            currentColorIdx++;
            let newTicketColorIdx = currentColorIdx % ColorChange.length;
            let newTicketColor = ColorChange[newTicketColorIdx];
            ticketColorBand.classList.remove(currentColor);
            ticketColorBand.classList.add(newTicketColor);

            let idx = storingAllTheTickets.findIndex(function(ticket){
                return ticket.id === id
            })

            storingAllTheTickets[idx].ticketColor = newTicketColor

            localStorage.setItem("storingAllTheTickets", JSON.stringify(storingAllTheTickets))

        } else {
            alert("Unlock the ticket to change color");
        }
    });
}

toolBoxPriorityColors.forEach(function (colorFilterBox, i) {
    colorFilterBox.addEventListener('click', function () {
        let filteredColor = toolBoxPriorityColors[i].classList[0];
        let filteredTickets = storingAllTheTickets.filter(ticket => filteredColor === ticket.ticketColor);
        let mainCont = document.querySelector(".main-cont");
        if (filteredTickets.length > 0) {
            mainCont.innerHTML = "";
            filteredTickets.forEach(function (filteredTicket) {
                createTicket(filteredTicket.id, filteredTicket.ticketTaskValue, filteredTicket.ticketColor);
            });
        } else {
            alert("No tickets found with the selected color.");
        }
    });
});

showAllButton.addEventListener('click', function () {
    let mainCont = document.querySelector(".main-cont");
    mainCont.innerHTML = "";
    storingAllTheTickets.forEach(function (ticket) {
        createTicket(ticket.id, ticket.ticketTaskValue, ticket.ticketColor);
    });
});





