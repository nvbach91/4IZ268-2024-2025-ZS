import { TodoistApi } from "@doist/todoist-api-typescript"

const api = new TodoistApi("0123456789abcdef0123456789")

api.addProject({ name: "To-do list" })
    .then((project) => console.log(project))
    .catch((error) => console.log(error))

    [
        {
            id: "220474322",
            parentId: null,
            order: 0,
            color: "grey",
            name: "Inbox",
            commentCount: 10,
            isShared: false,
            isFavorite: false,
            isInboxProject: true,
            isTeamInbox: false,
            url: "https://todoist.com/showProject?id=220474322",
            viewStyle: "list"
        }
    ]
