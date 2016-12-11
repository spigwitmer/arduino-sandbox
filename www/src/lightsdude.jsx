import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'react-bootstrap';
import { SketchPicker } from 'react-color';
import Slider from 'rc-slider';
import ReactSwipe from 'react-swipe';

class SingleLightsPane extends React.Component {
    constructor(props) {
        super(props);
        this.mode = 1;
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
        return (
            <div style={{textAlign: 'center'}}>
                <div style={{width: 400, display: 'inline-block'}}>
                    <SketchPicker disableAlpha={true} color={this.getColorHex()}
                                  onChangeComplete={this.handleColorChange}
                                  width={400} />
                </div>
                <br /><br />
                <div>
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
        this.handleDelayChange = this.handleDelayChange.bind(this);
        this.getDispDelay = this.getDispDelay.bind(this);
    }

    getColorHex() {
        var r = (this.state.r < 16 ? "0" : "") + this.state.r.toString(16),
            g = (this.state.g < 16 ? "0" : "") + this.state.g.toString(16),
            b = (this.state.b < 16 ? "0" : "") + this.state.b.toString(16);
        return '#' + r + g + b;
    }

    handleSubmit(event) {
        var curstate = this.state;
        alert('clicked submit for blink (color: '+this.getColorHex()+', delay: '+this.state.delay+')');
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

    getDispDelay(val) {
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
                        <h3 style={{textAlign: 'left'}}>Delay (shorter means faster):</h3>
                        <div style={{width: 400, margin: '0 auto'}}>
                            <Slider value={this.state.delay} step={100}
                                    min={100} max={10000}
                                    onChange={this.handleDelayChange}
                                    tipFormatter={this.getDispDelay} />
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
                            draggable={true} key={3}>
                    <div className="pane" key={1}>
                        <h2>Single color</h2>
                        <SingleLightsPane />
                    </div>
                    <div className="pane" key={2}>
                        <h2>Blink</h2>
                        <BlinkLightsPane />
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
