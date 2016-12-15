import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'react-bootstrap';
import { SketchPicker } from 'react-color';
import Slider from 'rc-slider';
import ReactSwipe from 'react-swipe';
import 'whatwg-fetch';

var g_app;

class LightsModePane extends React.Component {
    handleSubmit(event) {
        g_app.updateLightsState(this.state);
    }
}

class SingleLightsPane extends LightsModePane {
    constructor(props) {
        super(props);
        this.state = {
            r: 155,
            g: 155,
            b: 155,
            delay: 60000,
            mode: 1
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

class RandomXmasPane extends LightsModePane {
    constructor(props) {
        super(props);
        this.state = {
            r: 155,
            g: 155,
            b: 155,
            delay: 1000,
            mode: 3
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelayChange = this.handleDelayChange.bind(this);
        this.getDispDelay = this.getDispDelay.bind(this);
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
                <div style={{width: 400, height: 55, margin: '0 auto'}}>
                    <h3 style={{textAlign: 'left'}}>Interval:</h3>
                    <div style={{width: 400, margin: '0 auto'}}>
                        <Slider value={this.state.delay} step={100}
                                min={100} max={30000}
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
        );
    }
}

class BlinkLightsPane extends LightsModePane {
    constructor(props) {
        super(props);
        this.state = {
            r: 155,
            g: 155,
            b: 155,
            delay: 1000,
            mode: 2
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
                        <h3 style={{textAlign: 'left'}}>Interval:</h3>
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
        console.log(props);
        this.lightsmgr_endpoint = props.endpoint;
        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
        this.fetchLightsState = this.fetchLightsState.bind(this);
        this.handleStateResponse = this.handleStateResponse.bind(this);
        g_app = this;
    }

    next() {
        this.refs.lightmodes.next();
    }

    prev() {
        this.refs.lightmodes.prev();
    }

    handleStateResponse(resp) {
        if (resp.mode != 0) {
            this.refs.lightmodes.slide(resp.mode-1, 200);
        }
        const state = {
            r: resp.r,
            g: resp.g,
            b: resp.b,
            delay: resp.delay
        };
        this.refs.mode_single.setState(state);
        this.refs.mode_blink.setState(state);
        this.refs.mode_xmas.setState(state);
    }

    fetchLightsState() {
        fetch(this.lightsmgr_endpoint).then(function(resp) {
            if (!resp.ok) {
                throw new Error("Server error when contacting backend");
            }
            return resp.json();
        }).then(this.handleStateResponse).catch(function (ex) {
            console.log(ex);
        });
    }

    updateLightsState(new_state) {
        fetch(this.lightsmgr_endpoint, {
            method: "POST",
            body: JSON.stringify(new_state),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function(resp) {
            if (!resp.ok) {
                throw new Error("Server error when contacting backend");
            }
            return resp.json();
        }).then(this.handleStateResponse).catch(function (ex) {
            console.log(ex);
        });
    }

    render() {
        return (
            <div>
                <ReactSwipe ref="lightmodes" className="carousel"
                            draggable={true} key={3}>
                    <div className="pane" key={1}>
                        <h2>Single color</h2>
                        <SingleLightsPane ref="mode_single" />
                    </div>
                    <div className="pane" key={2}>
                        <h2>Blink</h2>
                        <BlinkLightsPane ref="mode_blink" />
                    </div>
                    <div className="pane" key={3}>
                        <h2>Random Christmas Lights</h2>
                        <RandomXmasPane ref="mode_xmas" />
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

ReactDOM.render(<App endpoint="/ctl/lights" />, document.getElementById('app'));
g_app.fetchLightsState();
