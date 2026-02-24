export interface Task{
    id :string
    title: string
    discription?:string
    priority: "Low" | "Medium" | "High"
    dueDate?:string
    status: "todo" | "in-progress" | "completed"
    createdAt: number
}