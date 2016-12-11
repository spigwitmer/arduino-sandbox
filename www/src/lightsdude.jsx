import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Tab, MenuItem, Row, Col, Nav, NavItem, NavDropdown } from 'react-bootstrap';
import { SketchPicker } from 'react-color';
import ReactSlider from 'react-slider';
import ReactSwipe from 'react-swipe';

class SingleLightsPane extends React.Component {
    constructor(props) {
        super(props);
        this.mode = 1;
        this.state = {
            r: 155,
            g: 155,
            b: 155,
            delay: 60000
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleColorChange = this.handleColorChange.bind(this);
        this.handleDelayChange = this.handleDelayChange.bind(this);
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

    handleDelayChange(value) {
        this.setState({delay: value});
    }

    getDispDelay() {
        if (this.state.delay < 1000) {
            return "" + this.state.delay + "ms";
        } else {
            return "" + (this.state.delay / 1000) + "s";
        }
    }

    render() {
        return (
            <div style={{textAlign: 'center'}}>
                <div style={{width: 400, display: 'inline-block'}}>
                    <SketchPicker disableAlpha={true} color={this.getColorHex()}
                                  onChangeComplete={this.handleColorChange}
                                  width={400} />
                </div>
                <br /><br />
                <div>
                    <div style={{width: 400, height: 55, margin: '0 auto'}}>
                        <h3 style={{float: 'left'}}>Delay (shorter means faster): {this.getDispDelay()}</h3>
                        <div style={{width: 400, margin: '0 auto', float: 'left'}}>
                            <ReactSlider value={this.state.delay} step={100}
                                         min={100} max={60000} orientation="horizontal"
                                         onChange={this.handleDelayChange}
                                         className="horizontal-slider"
                                         withBars />
                        </div>
                    </div>
                    <br /><br />
                    <div style={{width: 400, margin: '0 auto'}}>
                        <Button type="button" bsSize="large"
                                bsStyle="success" onClick={this.handleSubmit}>
                                Change
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

class BlinkLightsPane extends React.Component {
    constructor(props) {
        super(props);
        this.mode = 2;
        this.state = {
            r: 155,
            g: 155,
            b: 155,
            delay: 1000
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
    constructor(props) {
        super(props);
        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
    }

    next() {
        this.refs.lightmodes.next();
    }

    prev() {
        this.refs.lightmodes.prev();
    }

    render() {
        return (
            <div>
                <ReactSwipe ref="lightmodes" className="carousel"
                            draggable={true}>
                    <div className="pane" key={1}>
                        <h2>Single color</h2>
                        <SingleLightsPane />
                    </div>
                    <div className="pane" key={2}>
                        <h2>Blink</h2>
                        <div>todo (blink)</div>
                    </div>
                    <div className="pane" key={3}>
                        <h2>Random Christmas lights</h2>
                        <div>todo (christmas)</div>
                    </div>
                </ReactSwipe>
                <br/>
                <div style={{textAlign: 'center'}}>
                    <button type="button" onClick={this.prev}>Prev</button>
                    <button type="button" onClick={this.next}>Next</button>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById('app'));
