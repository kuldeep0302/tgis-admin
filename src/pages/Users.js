import react, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { NotificationContainer, NotificationManager } from 'react-notifications';


import Header from '../global/Header';
import Sidebar from '../global/Sidebar';

import Breadcrumb from '../global/Breadcrumb.js';
import { url } from '../env'



function Home() {
  let navigate = useNavigate();
  let [state, setState] = useState({});

  useEffect(() => {
    axios.post(url + 'admin/users', {}).then(resp => {
      setState({ ...state, users: resp?.data?.data })
    })
  }, [])

  const deleteItem = (i) => {
    setState({ ...state, showDeleteModal: true, deleteRef: i })
  }

  const handleClose = (i) => {
    setState({ ...state, showDeleteModal: false, deleteRef: null })
  }

  const deleteItemConfirm = (i) => {
    setState({ ...state, showDeleteModal: false })
    axios.post(url + 'admin/delete/' + state.deleteRef._id, {}, {
      headers: {
        'x-access-token': localStorage.getItem('token')
      }
    }).then(resp => {
      if (resp.data.status != 'error') {
        axios.post(url + 'admin/users', {}).then(resp => {
          setState({ ...state, users: resp?.data?.data, deleteRef: null, showDeleteModal: false, })
          NotificationManager.success('Successfully Deleted', 'Success');
        })
      } else {
        if (resp.data.error == 999) {
          NotificationManager.error('Session Expired', 'Error');
          setTimeout(() => {
            navigate('/login');
          }, 3000)
        } else {
          NotificationManager.error(resp.data.message, 'Error');
        }
      }
    })
  }

  return (
    <>
      <Header />
      <NotificationContainer />
      <main>
        <Sidebar />
        <section id='page-content'>
          
          <div className='main-area'>
            <div id='page-title'>
              <h1>Users</h1>
            </div>
            <div className='working-area'>
              <br /><br />
              {/*  <!-- Working area start--> */}
              <div className='row'>
                <div className='col-12'>
                </div>
                {state.users && state.users.length ? <div class="table-responsive">

                   <table class="table table-hover table-bordered table table-striped">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Number</th>
                        <th>Budget</th>
                        <th>City</th>
                        <th>Person Relation</th>
                        <th>Wedding Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        state.users.map((item, index) => {
                          return (
                            <tr>
                              <td>{item.name}</td>
                              <td>{item.email}</td>
                              <td>{item.number}</td>
                              <td>{item.budget}</td>
                              <td>{item.city}</td>
                              <td>{item.personType}</td>
                              <td>{item.weddingDate}</td>
                              <td>
                                <button className='btn btn-danger  btn-sm' onClick={(e) => {
                                  e.preventDefault();
                                  deleteItem(item)
                                }}>Delete</button>
                              </td>
                            </tr>
                          )
                        })
                      }

                    </tbody>
                  </table> 
                </div> :
                  <div className='col'>
                    <div className='alert alert-info'>No Result Found</div>
                  </div>
                }
              </div>
              {/*  <!-- Working area end--> */}
            </div>
          </div>
        </section>
        <Modal show={state.showDeleteModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>Hey, Are you sure you want to delete this User!</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="danger" onClick={deleteItemConfirm}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </main>
    </>
  );
}

export default Home;
