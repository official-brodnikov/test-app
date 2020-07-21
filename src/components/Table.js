import React, {Component} from 'react';
import './Table.css';

export default class MainTable extends Component {
    constructor() {
        super();
        this.state ={
            //Список данных, т.к. была выбрана модель todos с ресурса
            todos: [],

            //Индекс редактируемого обьекта todo
            indexEditable: null,

            //Поле id редактируемого обьекта
            idEditable: '',

            //Поле userId редактируемого обьекта
            userIdEditable: '',

            //Поле title редактируемого обьекта
            titleEditable: '',

            //Поле completed редактируемого обьекта
            completedEditable: null,

            value: '',
        }

        this.handleInputChange = this.handleInputChange.bind(this);
    }


    componentDidMount() {
        //Выбранная модель данных, 4 поля для каждой записи, уникальное только id
        const url = `https://jsonplaceholder.typicode.com/todos`

        //Запрос к ресурсу, изменения состояния компонента ()
        fetch(url, {
            method: "GET"
        }).then(response => response.json()).then(todos => {
            this.setState({todos: todos})
        })

        /*return fetch(url, {
            method: "GET"
        }).then(response => response.json()).then(todos => {
            console.log(todos)
        })*/
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.name === 'completedEditable' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }


    //Обработка кнопки удаления записи
    delete(todo){
        //Формируем url для удаление записи из ресура
        let url = `https://jsonplaceholder.typicode.com/todos/${todo.userId}/${todo.id}`

        //Выполняем запрос DELETE к ресурсу
        fetch(url, {
            method: 'DELETE',
        }).catch(console.log)

        //Копируем массив данных в текущем состоянии компонента
        let newTodos = this.state.todos

        //Так как уникальный id, формируем список всех id
        let ids = this.state.todos.map(item => item.id)

        //console.log(ids)

        //Удаляем из массива нужную запись
        newTodos.splice(ids.indexOf(todo.id), 1)

        //Обновляем данные в таблице
        this.setState({
            todos: newTodos,
            indexEditable: null,
            idEditable: '',
            userIdEditable: '',
            titleEditable: '',
            completedEditable: null
        })
    }

    //Обработка кнопки редактирования записи
    edit(e, todo){
        //Копируем массив данных в текущем состоянии компонента
        let newTodos = this.state.todos

        //Так как уникальный id, формируем список всех id
        let ids = this.state.todos.map(item => item.id)

        //Элемент todo, который выбран для редактирования
        let todoEditable = newTodos[ids.indexOf(todo.id)]

        //console.log(todoEditable)

        this.setState({
            indexEditable: todo.id,
            idEditable: todoEditable.id,
            userIdEditable: todoEditable.userId,
            titleEditable: todoEditable.title,
            completedEditable: todoEditable.completed
        })
    }

    //Обработка кнопки сохранения изменений в записи
    save(e, todo){
        //Формируем url для изменения записи в ресуре
        let url = `https://jsonplaceholder.typicode.com/todos/${todo.userId}/${todo.id}`

        //Измененный объект todo
        const newTodo = {
            id: this.state.idEditable,
            userID: this.state.userIdEditable,
            title: this.state.titleEditable,
            completed: this.state.completedEditable
        }

        //Выолняем запрос к ресурсу на изменение обьекта todo
        fetch(url, {
            method: 'PUT',
            body: JSON.stringify({
                newTodo
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(json => console.log(json))

        //Копируем массив данных в текущем состоянии компонента
        let newTodos = this.state.todos

        //Так как уникальный id, формируем список всех id
        let ids = this.state.todos.map(item => item.id)

        // Заменяем элемент в локальном массиве
        let newList = newTodos.splice (ids.indexOf(todo.id), 1, newTodo)

        console.log(this.state.title)
        console.log('обьект',newTodo)

        //Изменяем состояние компонента
        this.setState({
            todos: newTodos,
            indexEditable: null,
            idEditable: '',
            userIdEditable: '',
            titleEditable: '',
            completedEditable: null
        })
    }

    //Изменение поля id при редактировании
    idChange(e){
        this.setState({idEditable: e.target.value})
        //console.log(e.target.value)
    }

    //Изменение поля userId при редактировании
    userIdChange(e){
        this.setState({userIdEditable: e.target.value})
        //console.log(e.target.value)
    }

    //Изменение поля title при редактировании
    titleChange(e){
        this.setState({titleEditable: e.target.value})
        //console.log(e.target.value)
    }

    //Изменение поля completed при редактировании
    completedChange(e){
        this.setState({completedEditable: e.target.checked})
        //console.log(e.target.checked)
    }

    //Возвращает значение флага checkBox
    //Не обращаемся к локальным данным таблицы из состояния, если находимся в процессе изменения,
    // т.к. там данные до сохранения не обновляются
    isChecked(item){
        return this.state.indexEditable === item.id
            ? this.state.completedEditable
            : item.completed.toString() === 'true'
    }

    render()
    {
        return (
            <table className="table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>User ID</th>
                    <th>Title</th>
                    <th>Completed</th>
                    <th><button id="addButton">Add</button></th>
                </tr>
                </thead>
                <tbody>
                {this.state.todos.map(item => (
                    <tr key={item.id}>
                        <td>
                            <input
                                name = "idEditable"
                                readOnly={this.state.indexEditable !== item.id}
                                type="number"
                                value={this.state.indexEditable === item.id ? this.state.idEditable : item.id}
                                onChange={this.handleInputChange}
                            />
                        </td>

                        <td>
                            <input
                                name = "userIdEditable"
                                readOnly={this.state.indexEditable !== item.id}
                                type="number"
                                value={this.state.indexEditable === item.id ? this.state.userIdEditable : item.userId}
                                onChange={this.handleInputChange}
                            />
                        </td>

                        <td>
                            <input
                                name = "titleEditable"
                                readOnly={this.state.indexEditable !== item.id}
                                type="text"
                                value={this.state.indexEditable === item.id ? this.state.titleEditable : item.title}
                                onChange={this.handleInputChange}
                            />
                        </td>

                        <td>
                            <input
                                name = "completedEditable"
                                type = "checkbox"
                                readOnly={this.state.indexEditable !== item.id}
                                checked={this.state.indexEditable === item.id
                                    ? this.state.completedEditable
                                    : item.completed}
                                onChange={this.handleInputChange}
                            />
                        </td>

                        <td>
                            <button
                                id="deleteButton"
                                onClick={(e) => this.delete(item)}
                            >
                                Delete
                            </button>

                            {this.state.indexEditable === item.id
                                ?
                                <button
                                    id="saveButton"
                                    onClick={(e) => this.save(e, item)}
                                >
                                    Save
                                </button>
                                :
                                <button
                                    id="editButton"
                                    onClick={(e) => this.edit(e, item)}
                                >
                                    Edit
                                </button>}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        )
    }
}