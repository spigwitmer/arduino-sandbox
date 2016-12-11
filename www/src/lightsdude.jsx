import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Tab, MenuItem, Row, Col, Nav, NavItem, NavDropdown } from 'react-bootstrap';
import { SketchPicker } from 'react-color';


class SingleLightsPane extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            r: 155,
            g: 155,
            b: 155
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleColorChange = this.handleColorChange.bind(this);
    }

    getColorHex() {
        var r = (this.state.r < 16 ? "0" : "") + this.state.r.toString(16),
            g = (this.state.g < 16 ? "0" : "") + this.state.g.toString(16),
            b = (this.state.b < 16 ? "0" : "") + this.state.b.toString(16);
        return '#' + r + g + b;
    }

    handleSubmit(event) {
        var curstate = this.state;
        alert('clicked submit for single lights (color: '+this.getColorHex()+')');
        event.preventDefault();
    }

    handleColorChange(color, event) {
        this.setState({
            r: color.rgb.r,
            g: color.rgb.g,
            b: color.rgb.b
        });
    }

    render() {
        const buttonStyle = {
            display: 'inline-block',
            marginLeft: 10,
            verticalAlign: 'top'
        }, pickerStyle = {
            display: 'inline-block'
        };

        return (
            <div>
                <SketchPicker disableAlpha={true} color={this.getColorHex()}
                              onChangeComplete={this.handleColorChange}
                              style={pickerStyle} width={400} />
                <Button type="button" bsSize="large"
                        bsStyle="success" onClick={this.handleSubmit}
                        style={buttonStyle}>Change</Button>
            </div>
        );
    }
}

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
                            <Tab.Pane eventKey="single">
                                <SingleLightsPane />
                            </Tab.Pane>
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
