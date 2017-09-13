import React,{ Component } from 'react';
import ReactDOM from 'react-dom';
import Hello from './hello';
import './index.css';

class App extends Component {
	render() {
		return (
			<div>
				<Hello />
			</div>
		)
	}
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);