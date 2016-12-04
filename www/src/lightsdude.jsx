import React from 'react';
import ReactDOM from 'react-dom';
import { Tab, MenuItem, Row, Col, Nav, NavItem, NavDropdown } from 'react-bootstrap';


class App extends React.Component {
    render() {
        return (
            <Tab.Container id="ld-tabs">
                <Row className="clearfix">
                    <Col sm={12}>
                        <Nav bsStyle="tabs">
                            <NavItem eventKey="single">
                                Single color
                            </NavItem>
                            <NavItem eventKey="blink">
                                Blink
                            </NavItem>
                            <NavItem eventKey="christmas">
                                Random Christmas Colors
                            </NavItem>
                            <NavDropdown eventKey="3" title="Power" id="ld-tab-power">
                                <MenuItem eventKey="3.1">Power off</MenuItem>
                            </NavDropdown>
                        </Nav>
                    </Col>
                    <Col sm={12}>
                        <Tab.Content>
                            <Tab.Pane eventKey="single">todo (single)</Tab.Pane>
                            <Tab.Pane eventKey="blink">todo (blink)</Tab.Pane>
                            <Tab.Pane eventKey="christmas">todo (christmas)</Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById('app'));
