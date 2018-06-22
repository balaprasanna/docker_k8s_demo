import React, { Component } from 'react';
import logo from './logo.svg';
import { ListGroup, ListGroupItem, Grid, Row, Col, Panel  } from 'react-bootstrap/lib';

import './App.css';

class App extends Component {

  state = {
    notes : [{
      id:"1",
      name: "No data yet",
      content: "No data yet"
    }],

    selectedId : 0
  }
  componentWillMount() {

    const API_ENDPOINT = "http://localhost:3000"

    fetch(`${API_ENDPOINT}` + "/api/notes")
      .then((res) => res.json())
      .then((notes) => {
        console.log(notes)
        this.setState( { notes: notes } )
      }) 
      .catch((error) => {
        console.log("Error, ", error)
      })
  }

  renderListGroupItems = () => {
    console.log(this.state)

    
  
  }

  itemClick = (index) => {
    
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">
            Welcome to Todo List App
          </h1>
        </header>

        <p>  </p>
        
        <Grid>
          <Row className="show-grid">
            <Col md={4} >
              
              <ListGroup>
              { 
                this.state.notes.map((note, index) => {
                  return <ListGroupItem href="#" key= {index}  onClick={() => { this.setState( { selectedId: index }) } }  > { note.title } </ListGroupItem>;
                })
              }
              </ListGroup> 

            </Col>

            <Col md={8} >
            
              <Panel>
                <Panel.Heading>
                  <Panel.Title componentClass="h3"> { this.state.notes[this.state.selectedId].title } </Panel.Title>
                </Panel.Heading>
                <Panel.Body> { this.state.notes[this.state.selectedId].content } </Panel.Body>
              </Panel>

            </Col>
          </Row>
        </Grid>
        
         
      </div>
    );
  }
}

export default App;
