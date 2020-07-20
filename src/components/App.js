import React, { Component } from 'react';
import MainTable from "./Table";

class App extends Component {

    //Обработка нажатия кнопки добавления новой записи
    add() {

    }

    render() {
        return (
            <div className="container">
                {
                    <h1>Todos</h1>
                },
                {
                    <button id="AddButton" onClick={() => this.add()}>Add</button>
                },
                {
                    <MainTable/>
                }
            </div>
        );
    }
}

export default App;