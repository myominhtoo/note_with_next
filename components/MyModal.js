import { useRef , useState } from "react"
import { Button, Form, Modal  } from "react-bootstrap"
import swal from "sweetalert"

export default function MyModal( { show , handleClose , isCreate , target  , categories = [] , formType , handleSubmit , updateTask  }){


    const title = useRef();
    const description = useRef();
    const [ categoryId , setCategoryId ] = useState(() => {
        return updateTask ? updateTask.categoryId : ''
    });
    const category = useRef();


    const FormGroups = {
        createTask : <>
                <Form.Group className="my-3">
                    <Form.Label>Task's Title</Form.Label>
                    <Form.Control type="text" ref={title}  placeholder="Enter task's title " required/>
                </Form.Group>
                <Form.Group className="my-3">
                    <Form.Label>Task's Description</Form.Label>
                    <Form.Control as='textarea' ref={description}  placeholder="Enter task's description"  style={{ height : '150px'}} required />
                </Form.Group>
                    { 
                        categories && 
                        <Form.Group>
                                <Form.Label>Tasks' Category</Form.Label>
                                <div className="d-flex flex-wrap gap-4 align-items-center">
                                    {categories.map( category => {
                                        return (<div key={category.id} className="d-flex gap-2 align-items-center">
                                            <Form.Label htmlFor={category.id}>{category.name}</Form.Label>
                                            <Form.Check type="radio" 
                                             id={category.id}  
                                             name='category' 
                                             value={category.id}
                                             onChange={ e => setCategoryId(e.target.value) }
                                           />
                                        </div>)
                                    })}
                                </div>
                        </Form.Group>
                    }
        </>,
        createCategory :<>
                <Form.Group className="my-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Control type="text" ref={category} placeholder="Enter Category" required/>
                </Form.Group>
        </>,
        updateTask :  <>
                <Form.Group className="my-3">
                    <Form.Label>Task's Title</Form.Label>
                    <Form.Control type="text" ref={title} defaultValue={ updateTask && updateTask.title}  placeholder="Enter task's title " required/>
                </Form.Group>
                <Form.Group className="my-3">
                    <Form.Label>Task's Description</Form.Label>
                    <Form.Control as='textarea' ref={description} defaultValue={ updateTask && updateTask.description }  placeholder="Enter task's description" style={{ height : '150px'}} required />
                </Form.Group>
                    { 
                        categories && 
                        <Form.Group>
                                <Form.Label>Tasks' Category</Form.Label>
                                <div className="d-flex flex-wrap gap-4 align-items-center">
                                    {categories.map( category => {
                                        return (<div key={category.id} className="d-flex gap-2 align-items-center">
                                            <Form.Label htmlFor={category.id}>{category.name}</Form.Label>
                                            <Form.Check type="radio" 
                                            id={category.id}  
                                            name='category' 
                                            value={category.id}
                                            defaultChecked={updateTask && category.id == updateTask.categoryId}
                                            onChange={ e => setCategoryId(e.target.value) }
                                        />
                                        </div>)
                                    })}
                                </div>
                        </Form.Group>
            }
        </>
    }

    function handleConfirmCancel(){
        swal({
            text : 'Are you sure to cancel?',
            icon : 'warning',
            buttons : [ 'No' , 'Yes' ]
        }).then( isYes => {
            if( isYes ){
                handleClose();
            }
        })
    }

    function handleCreateCategory( ){
        let id = categories.length == 0 ? 1 : categories[ categories.length - 1 ].id + 1;
        handleSubmit({ id  , name : category.current.value });
        category.current.value = '';
        handleClose();
    }

    function handleCreateTask(){
        handleSubmit({ title : title.current.value , description : description.current.value , categoryId });
        title.current.value = '';
        description.current.value = '';
        setCategoryId('');
        handleClose();
    }

    function handleUpdateTask(){

        swal({
            text : 'Are you sure to update?',
            icon : "warning",
            buttons : [ 'No' , 'Yes' ]
           }).then( isYes =>{
            if(isYes){
                handleSubmit({ id : updateTask.id ,  title : title.current.value , description : description.current.value , categoryId : categoryId ? categoryId : updateTask.categoryId });
                title.current.value = '';
                description.current.value = '';
                setCategoryId('');
                handleClose();
            }
           })
    }

    function handleFormSubmit( e , target ){
        e.preventDefault();
        switch( target ){
            case 'createTask' : 
                handleCreateTask();
                break;
            case 'createCategory' : 
                handleCreateCategory();
                break;
            case  'updateTask' : 
                handleUpdateTask();
                break;
        }
    }

    return (
        <Modal show={show} onHide={handleClose} centered size="md">
                <Modal.Header>
                    <Modal.Title className="text-muted">
                        { (isCreate ? 'Create' : 'Update') + ' ' + target}
                    </Modal.Title>
                    <Button className="btn-close" variant="none" onClick={() => handleClose()}></Button>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={ e => handleFormSubmit(e,formType)} className="w-100">
                        { FormGroups[formType] }
                        <Form.Group className="d-flex justify-content-end gap-2 my-3">
                            <Button onClick={() => handleConfirmCancel() } className='btn-sm' variant="none">Cancel</Button>
                            <Button type='submit' variant='primary' className='btn-sm'>Create</Button>
                        </Form.Group>
                    </Form>
                </Modal.Body>
        </Modal>
    )
}