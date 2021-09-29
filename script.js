const apikey = '1d1c676f-e13f-4aab-81ef-d6ee610de4bf';
const apihost = 'https://todo-api.coderslab.pl';

timeForm = time => {
    if (Math.floor(time / 60) === 0) {
        return `${time % 60}min`
    }
    return `${Math.floor(time / 60)}h ${time % 60}min`
}

apiListTasks = () => {
    return fetch(apihost + '/api/tasks', {
            headers: {Authorization: apikey}
        }
    ).then(resp => {
        if (!resp.ok) {
            alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
        }
        return resp.json();
    })
}

apiListOperationsForTask = taskId => {
    return fetch(apihost + '/api/tasks/' + taskId + '/operations', {
            headers: {Authorization: apikey}
        }
    ).then(resp => {
        if (!resp.ok) {
            alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
        }
        return resp.json();
    })
}

apiCreateTask = (title, description) => {
    return fetch(
        apihost + '/api/tasks',
        {
            headers: {Authorization: apikey, 'Content-Type': 'application/json'},
            body: JSON.stringify({title: title, description: description, status: 'open'}),
            method: 'POST'
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        })
}

apiDeleteTask = taskId => {
    return fetch(
        apihost + '/api/tasks/' + taskId,
        {
            headers: {Authorization: apikey},
            method: 'DELETE'
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        })
}

apiUpdateTask = (taskId, title, description, status) => {
    return fetch(
        apihost + '/api/tasks/' + taskId,
        {
            headers: {Authorization: apikey, 'Content-Type': 'application/json'},
            body: JSON.stringify({title: title, description: description, status: status}),
            method: 'PUT'
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        })
}

apiCreateOperationForTask = (taskId, description) => {
    return fetch(
        apihost + '/api/tasks/' + taskId + '/operations',
        {
            headers: {Authorization: apikey, 'Content-Type': 'application/json'},
            body: JSON.stringify({description: description, timeSpent: 0}),
            method: 'POST'
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        })
}

apiUpdateOperation = (operationId, description, timeSpent) => {
    return fetch(
        apihost + '/api/operations/' + operationId,
        {
            headers: {Authorization: apikey, 'Content-Type': 'application/json'},
            body: JSON.stringify({description: description, timeSpent: timeSpent}),
            method: 'PUT'
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        })
}

apiDeleteOperation = operationId => {
    return fetch(
        apihost + '/api/operations/' + operationId,
        {
            headers: {Authorization: apikey},
            method: 'DELETE'
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        })
}

renderTask = (taskId, title, description, status) => {

    const section = document.createElement("section");
    section.className = "card mt-5 shadow-sm";
    document.querySelector("main").appendChild(section);

    const headerDiv = document.createElement("div");
    headerDiv.className = 'card-header d-flex justify-content-between align-items-center';
    section.appendChild(headerDiv);

    const headerLeftDiv = document.createElement("div");
    headerDiv.appendChild(headerLeftDiv);

    const h5 = document.createElement("h5");
    h5.innerText = title;
    headerLeftDiv.appendChild(h5);

    const h6 = document.createElement("h6");
    h6.className = 'card-subtitle text-muted';
    h6.innerText = description;
    headerLeftDiv.appendChild(h6);

    const headerRightDiv = document.createElement("div");
    headerDiv.appendChild(headerRightDiv)

    if (status == "open") {
        const finishButton = document.createElement('button');
        finishButton.className = 'btn btn-dark btn-sm js-task-open-only js-task-open-only';
        finishButton.innerText = 'Finish';
        headerRightDiv.appendChild(finishButton);

        finishButton.addEventListener("click", evt => {
            let newStatus = "closed"
            apiUpdateTask(taskId,title,description,newStatus).then( res => {
            const toDeleteList = document.querySelectorAll(".js-task-open-only");
            toDeleteList.forEach( el => {
                el.remove()
            })
            })
        })

    }
    const deleteButton = document.createElement("button")
    deleteButton.className = 'btn btn-outline-danger btn-sm ml-2';
    deleteButton.innerText = "Delete";
    headerRightDiv.appendChild(deleteButton)

    deleteButton.addEventListener("click", ev => {
        apiDeleteTask(taskId).then( () => {
            section.remove()
        })
    } )

    const operationList = document.createElement("ul");
    operationList.className = "list-group list-group-flush";
    section.appendChild(operationList);
    apiListOperationsForTask(taskId).then(res => {
        res.data.forEach(el => {
            renderOperation(operationList, status, el.id, el.description, el.timeSpent);
        })
    })

    if (status == "open") {
        const addOperationDiv = document.createElement("div");
        addOperationDiv.className = "card-body js-task-open-only";
        section.appendChild(addOperationDiv);

        const addOperationForm = document.createElement("form");
        addOperationDiv.appendChild(addOperationForm);

        const addOperationFormDiv = document.createElement("div");
        addOperationFormDiv.className = "input-group";
        addOperationForm.appendChild(addOperationFormDiv);

        const addOperationInput = document.createElement("input");
        addOperationInput.type = "text";
        addOperationInput.placeholder = "Operation description";
        addOperationInput.className = "form-control";
        addOperationInput.minLength = "5";
        addOperationFormDiv.appendChild(addOperationInput);

        const addOperationButtonDiv = document.createElement("div");
        addOperationButtonDiv.className = "input-group-append";
        addOperationFormDiv.appendChild(addOperationButtonDiv);

        const addOperationButton = document.createElement("button");
        addOperationButton.className = "btn btn-info";
        addOperationButton.innerText = "Add";
        addOperationButtonDiv.appendChild(addOperationButton);

        addOperationForm.addEventListener("submit", evt => {
            evt.preventDefault()
            apiCreateOperationForTask(taskId, addOperationInput.value).then( res => {
                let operation = res.data
                renderOperation(operationList, status, operation.id, operation.description, operation.timeSpent)
            })
        } )
    }
}

renderOperation = (operationsList, status, operationId, operationDescription, timeSpent) => {

    let actualTime = timeSpent

    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    operationsList.appendChild(li);

    const descriptionDiv = document.createElement('div');
    descriptionDiv.innerText = operationDescription;
    li.appendChild(descriptionDiv);

    const time = document.createElement('span');
    time.className = 'badge badge-success badge-pill ml-2';
    time.innerText = timeForm(timeSpent);
    descriptionDiv.appendChild(time);

    if (status === "open") {

        const operationButtonDiv = document.createElement("div");
        operationButtonDiv.className = "js-task-open-only";
        li.appendChild(operationButtonDiv);
        const operationButton15m = document.createElement("button")
        operationButton15m.innerText = "+15m";
        operationButton15m.className = "btn btn-outline-success btn-sm mr-2";

        const operationButton1h = document.createElement("button")
        operationButton1h.innerText = "+1h";
        operationButton1h.className = "btn btn-outline-success btn-sm mr-2";

        const operationButtonDelete = document.createElement("button")
        operationButtonDelete.innerText = "Delete";
        operationButtonDelete.className = "btn btn-outline-danger btn-sm";

        operationButtonDiv.appendChild(operationButton15m);
        operationButtonDiv.appendChild(operationButton1h);
        operationButtonDiv.appendChild(operationButtonDelete);

        operationButton15m.addEventListener("click", evt => {
            actualTime = actualTime + 15
            apiUpdateOperation(operationId, operationDescription, actualTime).then( res => {
                time.innerText = timeForm(actualTime)
            })
        })

        operationButton1h.addEventListener("click", evt => {
            actualTime = actualTime + 60
            apiUpdateOperation(operationId, operationDescription, actualTime).then( res => {
                time.innerText = timeForm(actualTime)
            })
        })

        operationButtonDelete.addEventListener("click", evt => {
            apiDeleteOperation(operationId).then( res => {
                li.remove()
            })
        })
    }
}

const addTaskForm = document.querySelector(".js-task-adding-form");

addTaskForm.addEventListener("submit", evt => {
    evt.preventDefault()
    const titleInput = document.querySelector('[name="title"]')
    const descriptionInput = document.querySelector('[name="description"]')
    let title = titleInput.value
    let description = descriptionInput.value
    apiCreateTask(title, description).then(res => {
        let task = res.data
        renderTask(task.id, task.title, task.description, task.status)
    })
})


apiListTasks().then(response => {
        response.data.forEach(task => {
                renderTask(task.id, task.title, task.description, task.status);
            }
        );
    }
);

