import {observable, action, computed, autorun} from "mobx";
import Request from './Request'

class mainStore
{
    constructor() {
        autorun(() =>{
            console.log(this.flagEditing)
            this.updateTodos()
        })
        this.Request = new Request()
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



    //Listener для кнопки удаления
    @action async deleteTodo(e) {
        const todo = this.getTodo(e)
        this.isAdded ? this.removeLast() : await this.Request.deleteTodo(todo)
            ? this.flagEditing = !this.flagEditing : console.log()

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

    //Listener кнопки сохраенния
    @action async saveTodo(e) {
        let newTodo = null
        this.isAdded ? newTodo = {
                userId: this.userIdAdded,
                id: '',
                title: '',
                completed: false
            } :
            newTodo = this.getTodo(e)
        newTodo.completed = this.completedEditable
        newTodo.title = this.titleEditable

        //Успешно ли был выполнен запрос
        let success = false
        //Изменяем обьект в модели или добавляем, если создавали новый
        this.isAdded ? success = await this.Request.postTodo(newTodo)
            : success = await this.Request.putTodo(newTodo)

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