import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {Button, Form, Modal, Table} from "react-bootstrap";

const Crewmember = () => {
    const {id}=useParams();
    const [crewmembers,setCrewmembers]=useState([]);
    const [isModalOpened, setIsModalOpened] = useState(false);
    const [isEditing,setIsEditing]=useState(false);
    const [crewmember,setCrewmember]=useState({name:'',role:'',shipId:id});
    const [count,setCount]=useState(0);

    const handleModalOpen = () => {
        setIsModalOpened(true);
    };

    const handleInputChange = (e) => {
        setCrewmember({...crewmember, [e.target.name]:e.target.value});
    }

    const handleModalClose = () => {
        setIsModalOpened(false);
        setIsEditing(false);
    };
    const handleEditItem = (row) => {
        const item=(crewmembers.find(row2=>row2.id===row.id));
        setCrewmember({
            id:item.id,
            name:item.name,
            role:item.role,
            shipId: id
        })
        setIsEditing(true);
        handleModalOpen();
    }

    const handleDeleteItem = (row) => {
        const item=(crewmembers.find(row2=>row2.id===row.id));
        axios.delete(`http://localhost:8080/crewmember/${item.id}`)
            .then(() => {
                console.log('Deleted item!');
                setCount(count+1);

            })
            .catch((error) => {
                console.log('Error:',error);
                alert(error.response.data.message);

            })
    }

    const handleEdit = () => {
        axios.put(`http://localhost:8080/crewmember/${crewmember.id}`,crewmember)
            .then(() =>{
                setCount(count+1);

                handleModalClose();
            })
            .catch(error => {
                console.log('Error',error);
                alert(error.response.data.message);

            })

    }

    const hndleCrewmember = () => {
        axios.post('http://localhost:8080/crewmember',crewmember)
            .then(res => {
                setCount(count+1);
                console.log('Object:',crewmember);
                handleModalClose()
            })
            .catch(error => {
                console.log('Error',error);
                alert(error.response.data.message);
            })

    }

    const handleAddCrewmember = () => {
        setCrewmember({name:'',role:'',shipId: id});
        setIsEditing(false)
        handleModalOpen()
    }


    useEffect(() => {
        axios.get(`http://localhost:8080/crewmember/${id}`)
            .then(res => {
                setCrewmembers(res.data);
            })
    },[count])
    return (
        <div className={"container"}>
            <h1 className={"header"}>Crewmembers</h1>
            <Button variant={"outline-primary"} onClick={handleAddCrewmember}> Add Crewmembers</Button>
            {crewmembers && (
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {crewmembers.map(row => (
                        <tr>
                            <td>{row.name}</td>
                            <td>{row.role}</td>
                            <td>
                                <Button style={{marginRight:'10px'}} variant={"primary"} onClick={() => handleEditItem(row)}>Edit</Button>
                                <Button style={{marginRight:'10px'}} variant={"danger"} onClick={() => handleDeleteItem(row)}>Delete</Button>
                            </td>
                        </tr>

                    ))}
                    </tbody>
                </Table>
            )}

            <Modal show={isModalOpened} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Crewmembers</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="name" name={"name"} value={crewmember.name} onChange={handleInputChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Role</Form.Label>
                            <Form.Control type="text" placeholder="role" name={"role"} value={crewmember.role} onChange={handleInputChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {isEditing ? <Button variant="primary" onClick={handleEdit}>
                        Edit Crewmember
                    </Button> : <Button variant="primary" onClick={hndleCrewmember}>
                        Add Crewmember
                    </Button>}

                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Crewmember