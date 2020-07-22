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

            //Индекс нового элемента
            indexAdded: null,

            //К какому пользователю добавить запись
            userIdAdded: '1',

            //Новый todo
            newTodo: null,
        }

        this.handleInputChange = this.handleInputChange.bind(this);
    }


    async componentDidMount() {

        //Выбранная модель данных, 4 поля для каждой записи, уникальное только id
        const url = `https://jsonplaceholder.typicode.com/todos`

        //Запрос к ресурсу, изменения состояния компонента ()
        await fetch(url, {
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

    handleInputChange(e) {
        const target = e.target;
        const value = target.name === 'completedEditable' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }


    //Обработка кнопки удаления записи
    async delete(todo){
        //Формируем url для удаление записи из ресура
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
    async save(e, todo){
        //Формируем url для изменения записи в ресуре
        const url = `https://jsonplaceholder.typicode.com/todos/${todo.userId}`

        //Измененный объект todo
        const newTodo = {
            userId: this.state.userIdEditable,
            id: this.state.idEditable,
            title: this.state.titleEditable,
            completed: this.state.completedEditable
        }

        console.log("Изменили",newTodo)

        //Выолняем запрос к ресурсу на изменение обьекта todo
        await fetch(url, {
            method: 'PUT',
            body: JSON.stringify({
                userId: this.state.userIdEditable,
                id: this.state.idEditable,
                title: this.state.titleEditable,
                completed: this.state.completedEditable
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
        newTodos.splice (ids.indexOf(todo.id), 1, newTodo)

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

    //Возвращает значение флага checkBox
    //Не обращаемся к локальным данным таблицы из состояния, если находимся в процессе изменения,
    // т.к. там данные до сохранения не обновляются
    isChecked(todo){
        return this.state.indexEditable === todo.id
            ? this.state.completedEditable
            : todo.completed.toString() === 'true'
    }

    //Обработка кнопки добавить новую запись
    async add(){
        //Выбранная модель данных, 4 поля для каждой записи, уникальное только id
        const url = `https://jsonplaceholder.typicode.com/todos`

        //Добавляем на ресурс новую запись
        await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                userId: this.state.userIdAdded,
                title: "",
                completed: false
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(todo => {this.setState({newTodo: todo})
            })

        //Изменяем данные todos локально
        //jsonplaceholder лишь имитирует добавление записи на ресурс
        let newTodos = this.state.todos
        newTodos.push(this.state.newTodo)

        //Добавленная запись в таблице
        const lastTodo = newTodos[newTodos.length - 1]

        //Изменяем состояния, при этом сразу же делаем редактируемой новую запись для удобства
        this.setState({
            indexEditable: newTodos.length,
            idEditable: lastTodo.id,
            userIdEditable: lastTodo.userId,
            titleEditable: lastTodo.title,
            completedEditable: lastTodo.completed,
            userIdAdded: '1',
            newTodo: null,
        })
    }

    render()
    {
        return (
            <table className="table">
                <thead>
                <tr className="titleTr">
                    <th>ID</th>
                    <th>User ID</th>
                    <th>Title</th>
                    <th>Completed</th>
                    <th>
                        <label>
                            Enter User ID to add
                        </label>
                        <input
                            name = "userIdAdded"
                            className="newTodoUserId"
                            type="number"
                            min={1}
                            value={this.state.userIdAdded}
                            onChange={this.handleInputChange}
                        />
                        <button
                            className="addButton"
                            onClick={(e) => this.add()}
                        >
                            Add
                        </button>
                    </th>
                </tr>
                </thead>
                <tbody>
                {this.state.todos.map(item => (
                    <tr key={item.id}>
                        <td>
                            <input
                                name = "idEditable"
                                readOnly={true}
                                type="number"
                                value={this.state.indexEditable === item.id ? this.state.idEditable : item.id}
                                onChange={this.handleInputChange}
                            />
                        </td>

                        <td>
                            <input
                                name = "userIdEditable"
                                readOnly={true}
                                type="number"
                                value={this.state.indexEditable === item.id ? this.state.userIdEditable : item.userId}
                                onChange={this.handleInputChange}
                            />
                        </td>

                        <td>
                            <textarea
                                name = "titleEditable"
                                readOnly={this.state.indexEditable !== item.id}
                                className={this.state.indexEditable === item.id ? "editInput" : null}
                                value={this.state.indexEditable === item.id ? this.state.titleEditable : item.title}
                                onChange={this.handleInputChange}
                                autoFocus={this.state.indexEditable === item.id}
                            />
                        </td>

                        <td>
                            <input
                                name = "completedEditable"
                                className={this.state.indexEditable === item.id ? "editInput" : null}
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
                                className="deleteButton"
                                onClick={(e) => this.delete(item)}
                            >
                                Delete
                            </button>

                            {this.state.indexEditable === item.id
                                ?
                                <button
                                    className="saveButton"
                                    onClick={(e) => this.save(e, item)}
                                >
                                    Save
                                </button>
                                :
                                <button
                                    className="editButton"
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