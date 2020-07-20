import React, {Component} from 'react';
import './Table.css';

class MainTable extends Component {
    constructor() {
        super();
        this.state ={
            //Список данных, т.к. была выбрана модель todos с ресурса
            todos: [],

            //Находится ли таблица в состоянии измнения элемента
            isEditing: false,
        }
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

    //Удаление записи
    delete(user){
        //Формируем url для удаление записи из ресура
        let url = `https://jsonplaceholder.typicode.com/todos/${user.userId}/${user.id}`

        //Выполняем запрос DELETE к ресурсу
        fetch(url, {
            method: 'DELETE',
        }).catch(console.log)

        //Копируем массив данных в текущем состоянии компонента
        let newData = this.state.todos;

        //Так как уникальный id, удаляем по id, формируем список всех id
        let ids = this.state.todos.map(item => item.id);

        //console.log(ids)

        //Удаляем из массива нужную запись
        newData.splice(ids.indexOf(user.id), 1)

        //Обновляем данные в таблице
        this.setState({newData})
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
                </tr>
                </thead>
                <tbody>
                {this.state.todos.map(item => (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.userId}</td>
                        <td>{item.title}</td>
                        <td>{item.completed.toString()}</td>
                        <button id="DeleteButton" onClick={(e) => this.delete(item)}>Delete</button>
                        <button id="EditButton">Edit</button>
                    </tr>
                ))}
                </tbody>
            </table>
        )
    }
}

export default MainTable;
