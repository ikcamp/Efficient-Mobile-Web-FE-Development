var Search = React.createClass({
	getInitialState: function() {
		// 设置输入框默认值
		return { value: this.props.defaultValue };
	},
	handleChange: function() {
		// 当输入内容变化时，取得最新值并更新state
		this.setState({ value: ReactDOM.findDOMNode(this.refs.search).value });
	},
	handleSearch: function() {
		// 点击搜索时，调用父组件的回调函数，并传递当前输入的内容
		this.props.onSearch && this.props.onSearch(this.state.value);
	},
	render: function() {
		var isDisabled = this.state.value === '';	// 设置无内容时，搜索按钮不可点击
		return (
			<div>
				<input
					type="search"
					onChange={this.handleChange}
					value={this.state.value}
					ref="search"
				/>
				<button
					onClick={this.handleSearch}
					disabled={isDisabled}
				>搜索</button>
				<button onClick={()=>this.setState({value: ''})} >清除</button>
			</div>
		);
	}
});

var Page = React.createClass({
	handleSearch: function(value) {
		window.alert('搜索关键字：' + value);
	},
	render: function() {
		return (
			<div>
				<Search defaultValue="英语六级" onSearch={this.handleSearch} />
			</div>
		);
	}
});

ReactDOM.render(<Page/>, document.querySelector('#root'));
