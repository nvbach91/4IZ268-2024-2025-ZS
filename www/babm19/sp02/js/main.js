import { TodoistApi } from "@doist/todoist-api-typescript"

const api = new TodoistApi("0123456789abcdef0123456789")

api.addProject({ name: "To-do list" })
    .then((project) => console.log(project))
    .catch((error) => console.log(error))