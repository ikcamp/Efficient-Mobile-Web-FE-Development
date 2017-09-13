import React,{ Component } from 'react';
import ReactDOM from 'react-dom';
import hello from "hello.js";
import toast from "toast/index";
import dialog from "dialog";

class App extends Component {
	render() {
		return (
			<div>
				{dialog}
			</div>
		)
	}
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);