function loadData() {
	try {
		return JSON.parse(window.localStorage.getItem('todos'));
	} catch(e) {
		// 浏览器不支持localStorage
		return null
	}
}
function saveData(data) {
	try {
		window.localStorage.setItem('todos', JSON.stringify(data));
	} catch(e) {
		// 浏览器不支持localStorage
	}
}
/** 根据数据元素的某个属性对数级进行排序 */
function sortArrayByProp(arr, prop, reverse = false) {
	return arr.sort((a, b) => reverse ? a[prop] > b[prop] : a[prop] < b[prop]);
}
/** 当日期、时间单位字符串长度为一位时，前面补充0至两位 */
function fillZero(str) {
	return ('' + str).length === 1 ? '0' + str : str;
}
/* 头部组件，包含新建备忘及排序和过滤功能 */
class Header extends React.Component {
	/* 构造函数， */
	constructor() {
		super();
		this.state = this.getInitialValues();
	}
	/* 获取输入项的默认值 */
	getInitialValues() {
		let now = new Date();
		// 当前日期
		let dateStr = `${now.getFullYear()}-${fillZero(now.getMonth() + 1)}-${fillZero(now.getDate())}`;
		// 当前时间
		let timeStr = `${fillZero(now.getHours())}:${fillZero(now.getMinutes())}`;
		return { value: '', date: dateStr, time: timeStr };
	}
	/* 备忘内容变更时的处理函数 */
	handleTextChange(e) { this.setState({ value: e.target.value }); }
	/* 备忘日期变更时的处理函数 */
	handleDateChange(e) { this.setState({ date: e.target.value }); }
	/* 备忘时间变更时的处理函数 */
	handleTimeChange(e) { this.setState({ time: e.target.value }); }
	/* 点击添加时的处理函数 */
	handleAdd() {
		this.props.onClickAdd(this.state.value, this.state.date, this.state.time);
		this.setState(this.getInitialValues());
	}
	render() {
		return (
			<div className="header">
				<h3 className="title">备忘录</h3>
				<button type="button" disabled={!this.state.value}
					onClick={this.handleAdd.bind(this)}>添加</button>
				<div className="input-wrapper">
					<input value={this.state.value} placeholder="备忘内容"
						onChange={this.handleTextChange.bind(this)} />
					<input className="date" type="date" value={this.state.date}
						onChange={this.handleDateChange.bind(this)} />
					<input className="time" type="time" value= {this.state.time}
						onChange={this.handleTimeChange.bind(this)} />
				</div>
				<div className="bar">
					<strong>排序</strong>
					<span onClick={()=>this.props.onChangeOrder('color')}>颜色</span>
					<span onClick={()=>this.props.onChangeOrder('time')}>时间</span>
					<strong style={{ marginLeft: 20 /* 行内样式 */ }}>过滤</strong>
					<span onClick={()=>this.props.onChangeFilter('全部')}>全部</span>
					<span onClick={()=>this.props.onChangeFilter('待做')}>待做</span>
					<span onClick={()=>this.props.onChangeFilter('已完成')}>已完成</span>
				</div>
			</div>
		);
	}
}

/** 备忘事项组件 */
const Memo = props => {
	let memo = props.memo;
	// 根据备忘的状态设置样式
	let classNames = 'todo-item' + (memo.done ? ' done' : '');
	return (
		<div className={classNames}>
			<input type="checkbox" checked={memo.done}
				onChange={()=>props.onToggleState(memo)} />
			<input className="color" type="color" value={memo.color}
				onChange={(e)=>props.onChangeColor(memo, e.target.value)} />
			<span className="text">{memo.text}</span>
			<span className="pull-right del"
				onClick={()=>props.onDelete(memo)}>X</span>
			<a className="pull-right">{new Date(memo.time).toLocaleString()}</a>
		</div>
	);
}
/** 备忘列表组件 */
const TodoList = props => {
	// 遍历props中的列表数据，生成备忘组件列表
	let todolist = props.items.map(memo=>(
		<Memo memo={memo} onToggleState={props.onToggleState}
			onChangeColor={props.onChangeColor} onDelete={props.onDelete} />
	));
	return (
		<div className="todo-list-wrapper">
			<div>{ `${props.title} (${props.items.length})`}</div>
			<div className="todo-list">{ todolist }</div>
		</div>
	);
}

/** 备忘录组件 */
class TodoApp extends React.Component {
	/** 构造函数，this.state = {...} 相当于getInitialState() */
	constructor() {
		super();
		// 设置初始状态
		this.state = loadData() || {
			todos: [],				// 储存备忘列表
			filter: '全部',		// 储存当前的过滤字段
			order: 'time'		// 储存当前的排序字段
		};
	}
/* 添加新备忘的处理函数，向todos列表中插入新数据 */
handleAdd(text, date, time) {
	// setState是异步的，在设置state完成后存储当前的state
	this.setState({
		todos: this.state.todos.concat([{
			color: '#ffffff',
			text,
			time: date + ' ' + time,
			done: false
		}])
	}, ()=>saveData(this.state));
}
/* 切换备忘状态的处理函数 */
handleToggleState(memo) {
	memo.done = !memo.done;
	this.setState({}, ()=>saveData(this.state))
}
/* 切换备忘颜色的处理函数 */
handleChangeColor(memo, color) {
	memo.color = color;
	this.setState({}, ()=>saveData(this.state))
}
/* 删除备忘的处理函数，将备忘从todos中移除 */
handleDelete(memo) {
	let todos = this.state.todos;
	todos.splice(todos.indexOf(memo), 1);
	this.setState({ todos: todos }, ()=>saveData(this.state));
}
/* 根据指定字段对列表进行排序 */
handleChangeOrder(field) {
	this.setState({ order: field }, ()=>saveData(this.state));
}
/** 根据备忘状态对列表进行过滤 */
handleChangeFilter(filter) { this.setState({ filter }, ()=>saveData(this.state)); }
	render() {
		let filter = this.state.filter;
		// 先对列表进行过滤，再进行排序
		let items = sortArrayByProp(this.state.todos.filter(memo=>{
			return filter === '全部' ? true : filter === '已完成' ? memo.done : !memo.done;
		}), this.state.order);
		return (
			<div className="todo-app">
				<Header onClickAdd={this.handleAdd.bind(this)}
					onChangeOrder={this.handleChangeOrder.bind(this)}
					onChangeFilter={this.handleChangeFilter.bind(this)} />
				<TodoList title={filter} items={items}
					onToggleState={this.handleToggleState.bind(this)}
					onChangeColor={this.handleChangeColor.bind(this)}
					onDelete={this.handleDelete.bind(this)} />
			</div>
		);
	}
}

ReactDOM.render(<TodoApp/>, document.querySelector('#root'));