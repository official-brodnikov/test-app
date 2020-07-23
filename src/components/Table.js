import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import './Table.css';
import './Button.css';


@inject("mainStore")
@observer class MainTable extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const mainStore = this.props.mainStore
        const todos = mainStore.todos
        const indexEditable = mainStore.idEditable
        const title = mainStore.titleEditable
        const completed = mainStore.completedEditable
        const userIdAdded = mainStore.userIdAdded

        return (
            <table className="table">
                <thead>
                <tr className="tableHeader">
                    <th>ID</th>
                    <th>User ID</th>
                    <th>Title</th>
                    <th>Completed</th>
                    <th>
                        <label>
                            Enter User ID to add
                        </label>
                        <br/>
                        <input
                            name = "userIdAdded"
                            className="newTodoUserId"
                            type="number"
                            min={1}
                            value={userIdAdded}
                            onChange={e => mainStore.changeUserIdAdded(e.target.value)}
                        />
                        <button
                            className="addButton"
                            onClick={e => mainStore.addTodo(e)}
                        >
                            Add
                        </button>
                    </th>
                </tr>
                </thead>
                <tbody>
                {todos.map(item => (
                    <tr key={item.id}>
                        <td>
                            <input
                                name = "idEditable"
                                readOnly={true}
                                type="number"
                                value={item.id}
                            />
                        </td>

                        <td>
                            <input
                                name = "userIdEditable"
                                readOnly={true}
                                type="number"
                                value={item.userId}
                            />
                        </td>

                        <td>
                            <textarea
                                name = "titleEditable"
                                readOnly={indexEditable !== item.id}
                                className={indexEditable === item.id ? "editInput" : null}
                                value={indexEditable === item.id ? title : item.title}
                                onChange={e => mainStore.setValueInput(e)}
                                autoFocus={indexEditable === item.id}
                            />
                        </td>

                        <td>
                            <input
                                name = "completedEditable"
                                id = {item.id}
                                className={indexEditable === item.id ? "editInput" : null}
                                type = "checkbox"
                                readOnly={indexEditable !== item.id}
                                checked={indexEditable === item.id
                                    ? completed
                                    : item.completed}
                                onChange={e => mainStore.setValueInput(e)}
                            />
                        </td>
                        <td>
                            <button
                                className="deleteButton"
                                name={item.id}
                                onClick={(e) => mainStore.deleteTodo(e)}
                            >
                                Delete
                            </button>

                            {indexEditable === item.id
                                ?
                                <button
                                    className="saveButton"
                                    name={item.id}
                                    onClick={(e) => mainStore.saveTodo(e)}
                                >
                                    Save
                                </button>
                                :
                                <button
                                    className="editButton"
                                    name={item.id}
                                    onClick={(e) => mainStore.editTodo(e)}
                                >
                                    Edit
                                </button>
                            }
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        )
    }
}

export default MainTable