class App {
    constructor() {        
        this.initialTaskRender();
        this.creatButtonListener();
        this.creatStatusFilterListener();
        this.creatPriorFilterListener();
        this.creatSearchFilterListener();
    }

    initialTaskRender() {
        let fragment = new DocumentFragment;
        
        arrayOfTasksObjects.length = 0;

        arrayOfTasksData.forEach(taskObj => {
            if (taskObj.status != 'deleted') {
                let host = document.createElement('div');
                arrayOfTasksObjects.push(new Task(taskObj, host));
                fragment.append(host);
            }
        });

        document.querySelector('.tasks-section').append(fragment);
    }

    creatSearchFilterListener() {
        document.querySelector('.search-input').addEventListener('input', () => {
            let tasks = document.querySelectorAll('.task-block');
            let searchInput = document.querySelector('.search-input').value.trim().toLowerCase();
            if (searchInput) {
                tasks.forEach(task => {
                    if(task.querySelector('.task-title').innerHTML.trim().toLowerCase().includes(searchInput)) {
                        task.classList.remove('hidden-search');
                    } else {
                        task.classList.add('hidden-search');
                    }
                });
            } else {
                tasks.forEach(task => task.classList.remove('hidden-search'));
            }
        });
    }

    creatStatusFilterListener() {
        document.querySelector('.status-filter').addEventListener('change', () => {
            let tasks = document.querySelectorAll('.task-block');
            if (event.target.value != 'all') {
                tasks.forEach(task => {
                    if(!task.classList.contains(event.target.value)) {
                        task.classList.add('hidden-status');
                    } else {
                        task.classList.remove('hidden-status');
                    }
                });
            } else {
                tasks.forEach(task => task.classList.remove('hidden-status'));
            }
        });
    }

    creatPriorFilterListener() {
        document.querySelector('.prior-filter').addEventListener('change', () => {            
            let tasks = document.querySelectorAll('.task-block');
            console.log(tasks);
            if (event.target.value != 'all') {
                tasks.forEach(task => {
                    if(task.querySelector('.priority-mark').innerHTML != event.target.value) {
                        task.classList.add('hidden-prior');
                    } else {
                        task.classList.remove('hidden-prior');
                    }
                });
            } else {
                tasks.forEach(task => task.classList.remove('hidden-prior'));
            }
        });
    }

    creatButtonListener() {
        document.querySelector('.creat-button').addEventListener('click', () => this.creatTask());
    }

    creatTask() {
        let createBlock = document.querySelector('.create-block');
        createBlock.classList.remove('hidden');
        createBlock.querySelector('.new-task-prior').value = '';

        let listenerCancel = function() {
            createBlock.querySelector('.new-task-title').value = '';
            createBlock.querySelector('.new-task-description').value = '';
            createBlock.classList.add('hidden');
            createBlock.querySelector('.cancel').removeEventListener('click', listenerCancel);
            createBlock.querySelector('.new-task-form').removeEventListener('submit', listenerSubmit);
        }

        let listenerSubmit = function() {
            let newData = {};
            newData.title = createBlock.querySelector('.new-task-title').value;
            newData.desc = createBlock.querySelector('.new-task-description').value;
            newData.prior = createBlock.querySelector('.new-task-prior').value;
            newData.status = 'open';
            createBlock.querySelector('.new-task-title').value = '';
            createBlock.querySelector('.new-task-description').value = '';
            createBlock.querySelector('.new-task-prior').value = '';
            createBlock.querySelector('.new-task-form').removeEventListener('submit', listenerSubmit);
            createBlock.querySelector('.cancel').removeEventListener('click', listenerCancel);
            createBlock.classList.add('hidden');

            let host = document.createElement('div');
            arrayOfTasksObjects.push(new Task(newData, host));
            document.querySelector('.tasks-section').append(host);
        }
        
        createBlock.querySelector('.cancel').addEventListener('click', listenerCancel, false);
        createBlock.querySelector('.new-task-form').addEventListener('submit', listenerSubmit, false);
    }    
}


class Task {
    constructor(taskData, container) {
        this.title = taskData.title;
        this.desc = taskData.desc;
        this.prior = taskData.prior;
        this.status = taskData.status;
        this.container = container;        
        this.render(container, this.status);
    }

    editTask(newData) {
        for (let key in newData) {
            this[key] = newData[key];
        }
        this.render(this.container, this.status);
    }

    doneTask() {
        this.status = 'done';
        this.render(this.container, this.status);
    }

    doneListener() {
        this.container.querySelector('.done-btn').addEventListener('click', () => this.doneTask());
    }

    editListener() {
        this.container.querySelector('.edit-btn').addEventListener('click', () => this.handleEdition());
    }

    deleteListener() {
        this.container.querySelector('.delete-btn').addEventListener('click', () => {
            this.status = 'deleted';
            setTimeout(updateArrayOfTasksObjects, 50);
            this.container.remove(); 
        });
    }

    handleEdition() {
        let createBlock = document.querySelector('.create-block');
        createBlock.classList.remove('hidden');
        let taskThis = this;
        createBlock.querySelector('.new-task-title').value = this.title;        
        createBlock.querySelector('.new-task-description').value = this.desc;
        createBlock.querySelector('.new-task-prior').value = this.prior;

        let onCancel = function() {
            createBlock.querySelector('.new-task-title').value = '';
            createBlock.querySelector('.new-task-description').value = '';
            createBlock.classList.add('hidden');
            createBlock.querySelector('.cancel').removeEventListener('click', onCancel);
            createBlock.querySelector('.new-task-form').removeEventListener('submit', onSubmit);
        }

        let onSubmit = function() {
            let newData = {};
            newData.title = createBlock.querySelector('.new-task-title').value;
            newData.desc = createBlock.querySelector('.new-task-description').value;
            newData.prior = createBlock.querySelector('.new-task-prior').value;
            createBlock.querySelector('.new-task-title').value = '';
            createBlock.querySelector('.new-task-description').value = '';
            createBlock.querySelector('.new-task-prior').value = '';
            createBlock.querySelector('.cancel').removeEventListener('click', onCancel);
            createBlock.querySelector('.new-task-form').removeEventListener('submit', onSubmit);
            createBlock.classList.add('hidden');
            taskThis.editTask(newData);
        }

        createBlock.querySelector('.cancel').addEventListener('click', onCancel, false);
        createBlock.querySelector('.new-task-form').addEventListener('submit', onSubmit, false);
    }

    render(container, status) {
        setTimeout(updateArrayOfTasksObjects, 50);
        container.innerHTML = '';

        let article = document.createElement('article');
        article.classList.add('task-block');
        if (status == 'done') {
            article.classList.add('done');
            article.classList.remove('open');
        } else {
            article.classList.add('open');
            article.classList.remove('done');
        }

        let taskTextInfo = document.createElement('div');
        taskTextInfo.classList.add('task-text');

        let p1 = document.createElement('p');
        p1.classList.add('task-title');
        p1.innerHTML = this.title;

        let p2 = document.createElement('p');
        p2.classList.add('task-desc');
        p2.innerHTML = this.desc;

        taskTextInfo.append(p1);
        taskTextInfo.append(p2);
        article.append(taskTextInfo);
        
        let taskMenu = document.createElement('div');
        taskMenu.classList.add('task-bottom-menu-wrapper');

        let prior = document.createElement('span');
        prior.classList.add('priority-mark');
        let markColor = (this.prior == 'high') ? 'high' : (this.prior == 'low') ? 'low' : 'normal';
        prior.classList.add(markColor);
        prior.innerHTML = this.prior;
        taskMenu.append(prior);

        let editTaskBlock = document.createElement('div');
        editTaskBlock.classList.add('edit-task');
        editTaskBlock.setAttribute('tabindex', 0);

        let editTaskList = document.createElement('ul');
        editTaskList.classList.add('edition-menu');

        for (let i = 0; i < 3; i++) {
            let editTaskItem = document.createElement('li');
            editTaskItem.classList.add('edition-item');
            let editTaskBtn = document.createElement('button');
            editTaskBtn.classList.add('edition-item-btn');
            editTaskBtn.innerHTML = (i == 0) ? 'done' : (i == 1) ? 'edit' : 'delete';
            let additionalClass = (i == 0) ? 'done-btn' : (i == 1) ? 'edit-btn' : 'delete-btn';
            editTaskBtn.classList.add(additionalClass);
            editTaskBtn.setAttribute('tabindex', 0);
            editTaskItem.append(editTaskBtn);
            editTaskList.append(editTaskItem);
        }
        editTaskBlock.append(editTaskList);
        taskMenu.append(editTaskBlock);
        article.append(taskMenu);
        container.append(article);

        this.doneListener();
        this.editListener();
        this.deleteListener();
    }
}

let arrayOfTasksData = JSON.parse(localStorage.getItem("arrayOfTasks")) || [];
let arrayOfTasksObjects = [];
function updateArrayOfTasksObjects() {
    localStorage.setItem("arrayOfTasks", JSON.stringify(arrayOfTasksObjects));
}

new App();
