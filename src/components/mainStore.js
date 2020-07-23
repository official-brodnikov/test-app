import {observable, action, computed, autorun} from "mobx";

class mainStore
{
    constructor() {
        autorun(() =>{
            console.log(this.flagEditing)
            this.updateTodos()
        })
    }
    //Локальная модель
    @observable todos = [];

    //Флаг, меняется при запросах на сервер на изменение
    @observable flagEditing = false;

    //id редактируемой записи
    @observable idEditable = null;

    //title редактируемой записи
    @observable titleEditable = '';

    //completed редактируемой записи
    @observable completedEditable = '';

    //Находится ли таблица в состоянии добавления новой записи
    @observable isAdded = false;

    //Значение userId для новой записи
    @observable userIdAdded = '1'

    //Обновление модели
    @action updateTodos () {
        //Выбранная модель данных, 4 поля для каждой записи, уникальное только id
        const url = `https://jsonplaceholder.typicode.com/todos`

        //Запрос к ресурсу, изменения состояния компонента ()
        fetch(url, {
            method: "GET"
        }).then(response => response.json()).then(todos => {
            this.todos = todos})
        console.log("Данные обновлены ")
    }

    //Получение записи из локальной модели
    getTodo = (e) => {
        //Копируем массив данных в текущем состоянии компонента
        const newTodos = this.todos

        //Так как уникальный id, формируем список всех id
        const ids = this.todos.map(item => item.id)

        //Ищем нужный элемент, это необходимо,
        // т.к. некоторые id могут остутствовать поссле удаления записей
        const todo = newTodos[ids.indexOf(Number(e.target.name))]

        return todo
    }

    @action async deleteRequest(todo){
        try {


            //Формируем url для удаление записи из ресурса
            const url = `https://jsonplaceholder.typicode.com/todos/${todo.userId}`

            //Выполняем запрос DELETE к ресурсу, имитирует удаление
            await fetch(url, {
                method: 'DELETE',
                body: JSON.stringify({
                    userId: todo.userId,
                    id: todo.id,
                    title: todo.title,
                    completed: todo.completed
                }),
            }).catch(console.log("Успешно удалено"))

            //Произошло изменение в модели
            this.flagEditing = !this.flagEditing
        }
        catch (e) {
            console.log(e)
        }
    }

    //Listener для кнопки удаления
    @action async deleteTodo(e) {
        const todo = this.getTodo(e)
        this.isAdded ? this.removeLast() : this.deleteRequest(todo)

    }

    //Удаление последнего элемента
    @action removeLast(){
        this.todos.splice(this.todos.length - 1, 1)
        this.isAdded = false
    }

    //Listener для кнопки редактирования
    @action editTodo(e) {
        this.idEditable = Number(e.target.name)
        this.titleEditable = this.getTodo(e).title
        this.completedEditable = this.getTodo(e).completed
        this.isAdded ? this.removeLast() : this.isAdded = false
    }

    //Очищение редактируемых полей
    @action clearEditValues(){
        this.idEditable = null
        this.titleEditable = ''
        this.completedEditable = ''
        this.isAdded = false
    }

    async putRequest(newTodo){
        try {


            //Формируем url для изменения записи в ресуре
            const url = `https://jsonplaceholder.typicode.com/todos/${newTodo.userId}`

            //Выполняем запрос к ресурсу на изменение обьекта todo
            await fetch(url, {
                method: 'PUT',
                body: JSON.stringify({
                    newTodo
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
                .then(response => response.json())
                .then(json => console.log("Успешно изменено ", json))
            return true
        }
        catch (e) {
            console.log(e)
            return false
        }
    }

    async postRequest(newTodo){
        //Формируем url для изменения записи в ресуре
        const url = `https://jsonplaceholder.typicode.com/todos`

        try {

            //Выполняем запрос к ресурсу на добавление новой записи
            await fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    userId: this.userIdAdded,
                    title: newTodo.title,
                    completed: newTodo.completed
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
                .then(response => response.json())
                .then(todo => console.log("Успешно добавлено ", todo))
            return true
        }
        catch (e) {
            console.log(e)
            return false
        }
    }

    //Listener кнопки сохраенния
    @action saveTodo(e) {
        let newTodo = this.getTodo(e)
        console.log(newTodo.completed)
        newTodo.completed = this.completedEditable
        newTodo.title = this.titleEditable

        //Успешно ли был выполнен запрос
        let success = false
        //Изменяем обьект в модели или добавляем, если создавали новый
        this.isAdded ? success = this.postRequest(newTodo) :
            success = this.putRequest(newTodo)

        success ? this.flagEditing = !this.flagEditing : console.log(success)
        //Очищаем значения
        this.clearEditValues()
    }

    //Listener кнопки добавления
    @action addTodo(e) {
        let newTodo = {
            userId: this.userIdAdded,
            id: '',
            title: '',
            completed: 'false'
        }

        this.isAdded = true

        this.completedEditable = false

        //Добавляем запись в локальную модель для дальнейшего редактирования
        this.todos.push(newTodo)

        this.idEditable = ''
    }

    //Обработчик input при редактировании
    @action setValueInput(e) {
        const target = e.target;
        const checkBox = target.name === 'completedEditable'
        const value = checkBox ? target.checked : target.value;
        checkBox ? this.completedEditable = value : this.titleEditable = value
        console.log(this.completedEditable)
    }

    //Изменение userId при добавлении
    @action changeUserIdAdded(value) {
        this.userIdAdded = value
    }
}

export default new mainStore()