// debugger;
class App {
    constructor() {
        this.arrayOfTasksObjects = [];
        this.initialTasks();
        this.creatButtonListener();
    }

    // updateArrayOfTasksObjects() {
    //     let arrayOfTasks = JSON.parse(localStorage.getItem("arrayOfTasks")) || [];
    //     arrayOfTasks.push(this);
    //     localStorage.setItem("arrayOfTasks", JSON.stringify(arrayOfTasks));
    // }

    initialTasks() {
        let fragment = new DocumentFragment;
        let arrayOfTasks = JSON.parse(localStorage.getItem("arrayOfTasks")) || [];

        arrayOfTasks.forEach(taskObj => {
            let host = document.createElement('div');
            let newTask = new Task(taskObj, host);
            fragment.append(host);
        });
        document.querySelector('.tasks-section').append(fragment);
    }

    creatButtonListener() {
        document.querySelector('.creat-button').addEventListener('click', () => this.creatTask());
    }

    creatTask() {
        let createBlock = document.querySelector('.create-block');
        createBlock.classList.remove('hidden');
        createBlock.querySelector('.cancel').addEventListener('click', () => createBlock.classList.add('hidden'));
        createBlock.querySelector('.new-task-form').addEventListener('submit', () => {
            let newData = {};
            newData.title = createBlock.querySelector('.new-task-title').value;
            newData.desc = createBlock.querySelector('.new-task-description').value;
            newData.prior = createBlock.querySelector('.new-task-prior').value;
            createBlock.classList.add('hidden');
            console.log(newData);
            let host = document.createElement('div');
            new Task(newData, host);
            document.querySelector('.tasks-section').append(host);
        });
    }    
}


class Task {
    constructor(taskData, container) {
        this.title = taskData.title;
        this.desc = taskData.desc;
        this.prior = taskData.prior;
        this.status = 'open';
        this.container = container;
        this.render(container, this.status);
        this.doneListener();
        this.editListener();
        this.deleteListener();
    }

    editTask(newData) {
        for (let key in newData) {
            let name = `old${key}`;            
            this[name] = this[key];
            this[key] = newData[key];
        }
        
        this.render(this.container, this.status);

        // let tasks = document.querySelectorAll('.task-text');
        
        // tasks.forEach(node => {
        //     if (node.querySelector('.task-title').innerHTML == this.oldtitle && 
        //         node.querySelector('.task-desc').innerHTML == this.olddesc &&
        //         node.querySelector('.task-prior').innerHTML == this.oldprior) {
        //             node.querySelector('.task-title').innerHTML = this.title; 
        //             node.querySelector('.task-desc').innerHTML = this.desc;
        //             node.querySelector('.task-prior').innerHTML = this.prior;
        //         }
        // });
    }

    doneTask() {
        this.status = 'done';
        this.render(this.container, this.status);
        // let tasks = document.querySelectorAll('.task-block');
        
        // tasks.forEach(node => {
        //     if (node.querySelector('.task-title').innerHTML == this.title && 
        //         node.querySelector('.task-desc').innerHTML == this.desc &&
        //         node.querySelector('.task-prior').innerHTML == this.dprior) {
        //             node.classList.add('done');
        //         }
        // });
    }

    doneListener() {
        this.container.querySelector('.done-btn').addEventListener('click', () => this.doneTask());
    }

    editListener() {
        this.container.querySelector('.edit-btn').addEventListener('click', () => this.handleEdition());
    }

    deleteListener() {
        this.container.querySelector('.delete-btn').addEventListener('click', () => {
            //this.container.innerHTML = '';
            this.container.remove();
            this.status = 'deleted';
        });
    }

    handleEdition() {
        let createBlock = document.querySelector('.create-block');
        createBlock.classList.remove('hidden');
        createBlock.querySelector('.cancel').addEventListener('click', () => createBlock.classList.add('hidden'));
        createBlock.querySelector('.new-task-form').addEventListener('submit', () => {
            let newData = {};
            newData.title = createBlock.querySelector('.new-task-title').value;
            newData.desc = createBlock.querySelector('.new-task-description').value;
            newData.prior = createBlock.querySelector('.new-task-prior').value;
            createBlock.classList.add('hidden');
            this.editTask(newData);
        });
    }

    render(container, status) {
        container.innerHTML = '';

        let article = document.createElement('article');
        article.classList.add('task-block');
        if (status == 'done') article.classList.add('done');

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
    }
}

new App();













// renderTasks(arrayOfTasks) {
//         let tasksContainer =  new DocumentFragment();
    
//         arrayOfTasks.forEach(task => {
//             let article = document.createElement('article').classList.add('task-block');
//             let taskTextInfo = document.createElement('div').classList.add('task-text');
    
//             taskTextInfo.append(document.createElement('p').classList.add('task-title').innerHTML = task.title);
//             taskTextInfo.append(document.createElement('p').classList.add('task-desc').innerHTML = task.desc);
            
//             let taskMenu = document.createElement('div').classList.add('task-bottom-menu-wrapper');
//             taskMenu.append(document.createElement('span').classList.add('priority-mark').innerHTML = task.prior);
    
//             let editTaskBlock = document.createElement('div').classList.add('edit-task');
//             editTaskBlock.setAttribute('tabindex', 0);
//             let editTaskList = document.createElement('ul').classList.add('edition-menu');
    
//             for (let i = 0; i < 3; i++) {
//                 let editTaskItem = document.createElement('li').classList.add('edition-item');
//                 let editTaskBtn = document.createElement('button').classList.add('edition-item-btn').innerHTML = (i == 0) ? 'done' : (i == 1) ? 'edit' : 'delete';
//                 editTaskBtn.setAttribute('tabindex', 0);
//                 editTaskList.append(editTaskItem.append(editTaskBtn));
//             }
    
//             article.append(taskMenu.append(editTaskBlock.append(editTaskList)));
//             tasksContainer.append(article);
//         });
    
//         document.querySelector('.tasks-section').append(tasksContainer);
//     }
