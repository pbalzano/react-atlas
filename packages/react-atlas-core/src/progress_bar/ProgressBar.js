import React from "react";
import { classNames } from "../utils";
import prefixer from "../utils/prefixer";
import themeable from "react-themeable";

//TODO Change this to a self contained component from the current version that requires too much logic in the parent component
class ProgressBar extends React.Component {
  calculateRatio(value) {
    if (value < this.props.min) {
      return 0;
    }
    if (value > this.props.max) {
      return 1;
    }
    return (value - this.props.min) / (this.props.max - this.props.min);
  }

  circularStyle() {
    if (this.props.mode !== "indeterminate") {
      return {
        "strokeDasharray": 
          `${2 * Math.PI * 25 * this.calculateRatio(this.props.value)}, 400`
        
      };
    }
  }

  linearStyle() {
    if (this.props.mode !== "indeterminate") {
      return {
        "buffer": prefixer({
          "transform": `scaleX(${this.calculateRatio(this.props.buffer)})`,
          "transitionDuration": this.props.transitionDuration
        }),
        "value": prefixer({
          "transform": `scaleX(${this.calculateRatio(this.props.value)})`,
          "transitionDuration": this.props.transitionDuration
        })
      };
    } else {
      return {};
    }
  }

  renderCircular(theme) {
    return (
      <svg {...theme(1, "circle")}>
        <circle
          {...theme(2, "path")}
          style={this.circularStyle()}
          cx="30"
          cy="30"
          r="25"
        />
      </svg>
    );
  }

  renderLinear(theme) {
    const { buffer, value } = this.linearStyle();
    return (
      <div>
        <span
          data-ref="buffer"
          {...theme(3, "buffer")}
          style={buffer}
        />
        <span
          data-ref="value"
          {...theme(4, "value")}
          style={value}
        />
      </div>
    );
  }
  renderRange(theme) {
    let rangeStyle = prefixer({
      "transform": 
        `translateX(${this.calculateRatio(this.props.value.from) * 100}%) 
                   scaleX(${this.calculateRatio(
          this.props.value.to - this.props.value.from
        )})`
      
    });
    const disabledStyles = this.props.disabled ? "disabled" : "value";
    return (
      <span
        data-ref="value"
        {...theme(5, disabledStyles)}
        style={rangeStyle}
      />
    );
  }

  renderInner(theme) {
    if (this.props.type === "circular") {
      return this.renderCircular(theme);
    }
    if (isNaN(this.props.value)) {
      return this.renderRange(theme);
    }
    return this.renderLinear(theme);
  }

  render() {
    const { type, mode, value, min, max, className, theme} = this.props;
    const themed = themeable(theme);
    const classes = [
      type,
      mode,
      className
    ];

    return (
      <div
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        {...themed(6, ...classes)}
      >
        {this.renderInner(themed)}
      </div>
    );
  }
}

ProgressBar.propTypes = {
  /**
   * The value of a second progress bar
   * @examples ''
   */
  "buffer": React.PropTypes.number,
  /**
   * Additional classname provided to component for further styling
   * @examples ''
   */
  "className": React.PropTypes.string,
  /**
   * Length of time in seconds for the transition (can use decimals)
   * @examples '35'
   */
  "transitionDuration": React.PropTypes.string,
  /**
   * The max value of the progress bar
   * @examples ''
   */
  "max": React.PropTypes.number,
  /**
   * The min value of the progress bar
   * @examples ''
   */
  "min": React.PropTypes.number,
  /**
   * Defines the type of Progress bar: 'determinate', 'indeterminate'
   * @examples 'circular'
   */
  "mode": React.PropTypes.string,
  /**
   * If true, progressbar will change colors during transition
   * @examples ''
   */
  "multicolor": React.PropTypes.bool,
  /**
   * Type of progress bar; 'circular' or 'linear'
   * @examples ''
   */
  "type": React.PropTypes.oneOf(["linear", "circular"]),
  /**
   * The default value(s) of the progress bar.  Can be a number, or an object containing keys of "from" and "to"
   * @examples '{"from": 10, "to": 80" }'
   */
  "value": React.PropTypes.oneOfType([
    React.PropTypes.number,
    React.PropTypes.shape({
      "from": React.PropTypes.number,
      "to": React.PropTypes.number
    })
  ])
};

ProgressBar.defaultProps = {
  "buffer": 0,
  "className": "",
  "max": 100,
  "min": 0,
  "transitionDuration": ".35s",
  "mode": "indeterminate",
  "multicolor": false,
  "type": "linear",
  "value": 0,
  "theme": {
     "buffer":"ra_progressBar__buffer",
    "circle":"ra_progressBar__circle",
    "circular":"ra_progressBar__circular",
  "circular-indeterminate-bar-dash":"ra_progressBar__circular-indeterminate-bar-dash",
  "circular-indeterminate-bar-rotate":"ra_progressBar__circular-indeterminate-bar-rotate",
  "colors":"ra_progressBar__colors",
  "indeterminate":"ra_progressBar__indeterminate",
  "linear":"ra_progressBar__linear",
  "lindear-indeterminate-bar":"ra_progressBar__linear-indeterminate-bar",
  "multicolor":"ra_progressBar__multicolor",
  "path":"ra_progressBar__path",
  "value": "ra_progressBar__value",
  }
};

ProgressBar.styleguide = {
  "category": "Form Components",
  "index": "3.7",
  "wrappedExample": true,
  "example": 
    `
// Internal Methods {
class ProgressBarExample extends React.Component {
  state = {
    progress: 0,
    buffer: 10
  };

  componentWillMount () {
    this.simulateProgress();
  }

  simulateProgress () {
    setTimeout(() => {
      if (this.state.progress < 100) {
        this.increaseProgress();
        if (this.state.progress > this.state.buffer) this.increaseBuffer();
      } else {
        this.setState(this.state);
      }
      this.simulateProgress();
    }, (Math.random() * 1 + 1) * 1000);
  }

  increaseProgress () {
    this.setState({
      progress: Math.random() * 30 + this.state.progress
    });
  }

  increaseBuffer () {
    this.setState({
      buffer: Math.random() * (100 - this.state.progress) + this.state.progress
    });
  }
// }
  render () {
    return (
      <section>
        <h5>Progress bars</h5>
        <p style={{margin: "10px auto"}}>Determinate</p>
        <ProgressBar mode="determinate" value={this.state.progress} buffer={this.state.buffer}/>
        <p style={{margin: "10px auto"}}>Indeterminate...</p>
        <ProgressBar mode="indeterminate"/>
        <p style={{margin: "10px auto"}}>Circular Indeterminate</p>
        <ProgressBar type="circular" mode="indeterminate"/>
        <p style={{margin: "10px auto"}}>Circular Determinate</p>
        <ProgressBar type="circular" mode="determinate" value={this.state.progress}/>
        <p style={{margin: '10px auto'}}>Range</p>
        <ProgressBar mode='determinate' value={{from: 10, to: 80}}/>
      </section>
    );
  }
// Mount Component {
}

ReactDOM.render(<ProgressBarExample/>, mountNode);
// }
`
  
};

export default ProgressBar;
