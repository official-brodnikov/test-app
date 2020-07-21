import React, { Component } from 'react';
import MainTable from "./Table";

class App extends Component {

    render() {
        return (
            <div className="container">
                {
                    <h1>Todos</h1>
                },
                {
                    <MainTable/>
                }
            </div>
        );
    }
}

export default App;