import React from 'react';
import MainTable from "./Table";
import { Provider } from 'mobx-react';
import mainStore from "./mainStore";

const stores = {mainStore}

function App() {
    return (
        <div className="App">
            <Provider {...stores}>
                <MainTable />
            </Provider>
        </div>
    );
}

export default App;
