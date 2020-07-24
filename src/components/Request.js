export default class Request
{
    async deleteTodo(todo){
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
            return true
        }
        catch (e) {
            console.log(e)
            return false
        }
    }

    async putTodo(newTodo){
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

    async postTodo(newTodo){

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
}