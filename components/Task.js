import { Card } from "react-bootstrap"

export default function Task( { task , handleDelete ,handleEdit } ){

    return (
        <Card id="task" className="col-lg-3 col-none-12 p-3 my-3 ">
            <Card.Header>
                <h5 className="text-muted text-capitalize">{task.title}</h5>
            </Card.Header>
            <Card.Body>
                <h6 className="text-muted text-capitalize">{task.description}</h6>
            </Card.Body>
            <div className="d-flex justify-content-between ">
                <span className="badge bg-primary">{task.category}</span>
                <div className="d-flex gap-3 opacity-75">
                    <i onClick={() => handleEdit(task.id)} className="fa-solid fa-pencil"></i>
                    <i onClick={() => handleDelete(task.id)} className="fa-solid fa-trash-can"></i>
                </div>
            </div>
        </Card>
    )
}