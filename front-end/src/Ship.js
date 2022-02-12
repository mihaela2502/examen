import {Button, Form, Modal, Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";

const Ship = () => {
    const [ships,setShips]=useState([]);
    const [isModalOpened, setIsModalOpened] = useState(false);
    const [isEditing,setIsEditing]=useState(false);
    const [ship,setShip]=useState({name:'',displacement:''});
    const [count,setCount]=useState(0);

    const handleModalOpen = () => {
        setIsModalOpened(true);
    };

    const handleInputChange = (e) => {
        setShip({...ship, [e.target.name]:e.target.value});
    }

    const handleModalClose = () => {
        setIsModalOpened(false);
        setIsEditing(false);
    };
    const handleEditItem = (row) => {
        const item=(ships.find(row2=>row2.id===row.id));
        setShip({
            id:item.id,
            name:item.name,
            displacement:item.displacement
        })
        setIsEditing(true);
        handleModalOpen();
    }

    const handleDeleteItem = (row) => {
        const item=(ships.find(row2=>row2.id===row.id));
        axios.delete(`http://localhost:8080/ship/${item.id}`)
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
        axios.put(`http://localhost:8080/ship/${ship.id}`,ship)
            .then(() =>{
                setCount(count+1);

                handleModalClose();
            })
            .catch(error => {
                console.log('Error',error);
                alert(error.response.data.message);

            })

    }

    const handleShip = () => {
        axios.post('http://localhost:8080/ship',ship)
            .then(res => {
                setCount(count+1);
                console.log('Object:',ship);
                handleModalClose()
            })
            .catch(error => {
                console.log('Error',error);
                alert(error.response.data.message);

            })

    }

    const handleAddShip = () => {
        setShip({name:'',displacement:''});
        setIsEditing(false)
        handleModalOpen()
    }


    useEffect(() => {
        axios.get('http://localhost:8080/ship')
            .then(res => {
                setShips(res.data);
            })
    },[count])
    return (
        <div className={"container"}>
            <h1 className={"header"}>Ships</h1>
            <Button variant={"outline-primary"} onClick={handleAddShip}> Add Ship</Button>
            {ships && (
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Displacement</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {ships.map(ship => (
                        <tr>
                            <td>{ship.name}</td>
                            <td>{ship.displacement}</td>

                            <td> <Link to={`/crewmember/${ship.id}`}>
                                <Button style={{marginRight:'10px'}} variant={"primary"}>Crewmembers</Button>
                            </Link>

                                <Button style={{marginRight:'10px'}} variant={"primary"} onClick={() => handleEditItem(ship)}>Edit</Button>
                                <Button style={{marginRight:'10px'}} variant={"danger"} onClick={() => handleDeleteItem(ship)}>Delete</Button>
                            </td>
                        </tr>
                    ))}

                    </tbody>
                </Table>

            )}

            <Modal show={isModalOpened} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Ship</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Name </Form.Label>
                            <Form.Control type="text" placeholder="name" name={"name"} value={ship.name} onChange={handleInputChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Displacement</Form.Label>
                            <Form.Control type="text" placeholder="Displacement" name={"displacement"} value={ship.displacement} onChange={handleInputChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {isEditing ? <Button variant="primary" onClick={handleEdit}>
                        Edit ship
                    </Button> : <Button variant="primary" onClick={handleShip}>
                        Add ship
                    </Button>}

                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Ship