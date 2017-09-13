import React,{ Component } from 'react';
import ReactDOM from 'react-dom';

class App extends Component {
	render() {
		throw "test";
		return (
			<div>
				Hello World
			</div>
		)
	}
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);