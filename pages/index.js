import Head from 'next/head'
import { Container , Button } from 'react-bootstrap'
import MyModal from '../components/MyModal';
import Task from '../components/Task';
import {  useEffect , useState } from 'react';
import swal from 'sweetalert';

export default function Home() {

  const [ show , setShow ] = useState(() => {
    return {
      createTask : false,
      createCategory : false,
      updateTask : false
    }
  });
  const [ categories , setCategories ] = useState([]);
  const [ tasks , setTasks ] = useState([]);
  const [ cachTasks , setCachTasks ] = useState([]);
  const [ updateTask , setUpdateTask ] = useState({});

  function getCategories(){
    setCategories(() => {
      let storedCategories = localStorage.getItem('categories');
      return storedCategories ? JSON.parse(storedCategories) : [];
    });
  }

  function getTasks(){
    setTasks(() => {
      let storedTasks = localStorage.getItem('tasks');
      setCachTasks(storedTasks ? JSON.parse(storedTasks) : [] );
      return storedTasks ? JSON.parse(storedTasks) : [];
    });
  }

  function handleCreateCategory( payload ){
    setCategories( prevCategories => {
      let resultCategories = [ ...prevCategories , payload ];
      localStorage.setItem('categories',JSON.stringify(resultCategories)); 
      return resultCategories;
    });
  }

  function handleCreateTask( payload ){
    setTasks( prevTasks => {
      payload['id'] = tasks.length == 0 ? 1 : tasks[tasks.length - 1 ].id + 1; 
      let resultTasks = [ ...prevTasks , payload ];
      localStorage.setItem('tasks',JSON.stringify(resultTasks));
      setCachTasks( resultTasks );
      return resultTasks;
    })
  }

  function handleDeleteTask( target ){
    swal({
      text : 'Are you sure to delete?',
      icon : 'warning',
      buttons : [ 'No' , 'Yes' ]
    }).then( isYes => {
      if(isYes){
        setTasks( prevTasks => {
          let resultTasks = prevTasks.filter( task => task.id != target );
          localStorage.setItem('tasks',JSON.stringify(resultTasks));
          setCachTasks(resultTasks);
          return resultTasks;
        });
      }
    });
  }

  function handleFilterTask( target ){
    if( target ){
      setTasks(() => {
        return cachTasks.filter( task => task.categoryId == target );
      })
    }else{
      setTasks(cachTasks);
    }
  }

  function handleSetUpUpdateTask( target ){
    setUpdateTask(() => {
      return tasks.filter( task => task.id == target )[0]
    });
    setShow( prevShow => {
      return { ...prevShow  , updateTask : true }
    })
  }

  function handleUpdateTask( payload ){
    setTasks( prevTasks => {
      let resultTasks = prevTasks.map( task => {
        if( task.id == payload.id ){
          return payload;
        }
        return task;
      });
      setCachTasks(resultTasks);
      localStorage.setItem('tasks',JSON.stringify(resultTasks));
      return resultTasks;
    });
  }


  function handleDeleteCategory( target  ){
    if( tasks.some( task => task.categoryId == target ) ){
      swal({
        text : 'Unable to delete this category!',
        icon : 'warning'
      });
    }else{
      swal({
        text : 'Are you sure to delete?',
        icon : 'warning',
        buttons : [ 'No' , 'Yes' ]
      }).then( isYes => {
        if( isYes ){
          setCategories( prevCategories => {
            let resultCategories = prevCategories.filter( category => category.id != target );
            localStorage.setItem('categories',JSON.stringify(resultCategories));
            return resultCategories;
          })
        }
      })
    }
  }

  useEffect(() => {
    getCategories();
    getTasks();
  } , [] );

  return (
    <>
      <Head>
        <title>Note | Home</title>
      </Head>
      <Container id='main' className='my-5'>
        <div className='w-100 d-flex justify-content-between align-items-center'>
           <div className='d-flex gap-2 text-danger text-muted align-items-center  flex-wrap' style={{ width : '35%'}}>
             <span onClick={() => handleFilterTask('') } id='category' className='badge bg-primary'>All</span>
            {categories.map( category => {
              return <span id='category' onClick={() => handleFilterTask(category.id)} className='badge bg-danger' key={category.id} >{category.name}<i  onClick={() => handleDeleteCategory(category.id) } className="fa-solid fa-xmark mx-1"></i></span>
            })}
           </div>
           <div>
            <Button 
             onClick={() => setShow(() => {
              return { createCategory : true , createTask : false }
             })}
             variant='primary mx-1'><i className="fa-solid fa-plus mx-1"></i>Category</Button>
            <Button 
             onClick={() => setShow(() => {
              return { createCategory : false , createTask : true }
             })} 
             variant='success'><i className="fa-solid fa-plus mx-1"></i>Task</Button>
           </div>
        </div>
        <div className='row px-3 my-4 d-flex justify-content-start gap-2 flex-wrap'>
          {
            tasks.length == 0
            ? (
                <h3 className='text-center my-3 text-muted'>There is no task to show!</h3>
              )
            : tasks.map( task => {
              task['category'] = categories.filter( category => category.id == task.categoryId )[0].name;
              return ( <Task 
                      key={task.id} 
                      task={task} 
                      handleDelete={handleDeleteTask}
                      handleEdit={handleSetUpUpdateTask}
                     /> )
          })}
        </div>
        {/*  create task modal */}
        <MyModal 
         show={show.createTask}
         handleClose={() => {
          setShow( prevShow => {
            return { ...prevShow , createTask : false }
          })
         }}
         categories={categories}
         isCreate={true} 
         target='Task'
         formType='createTask'
         handleSubmit={handleCreateTask}
        />
        {/* create category modal */}
        <MyModal
          show={show.createCategory}
          handleClose={() => {
            setShow(( prevShow ) => {
              return { ...prevShow , createCategory : false   }
            })
          }}
          isCreate={true}
          categories={categories}
          target='Category'
          formType='createCategory'
          handleSubmit={handleCreateCategory}
        />
        <MyModal
          show={show.updateTask}
          isCreate={false}
          handleClose={() => {
            setShow((prevShow) => {
              return { ...prevShow , updateTask : false}
            });
          }}
          target='Task'
          categories={categories}
          formType='updateTask'
          updateTask={updateTask}
          handleSubmit={handleUpdateTask}
        />
      </Container>
    </>
  )
}
