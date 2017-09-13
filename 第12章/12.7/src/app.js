const React = require("react")
const ReactDOM = require("react-dom")
const {loadData, saveData, sortArrayByProp, fillZero} = require("./util")
const Header = require("./header")
const TodoList = require("./todoList")

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
		}, () => saveData(this.state));
	}
	/* 切换备忘状态的处理函数 */
	handleToggleState(memo) {
		memo.done = !memo.done;
		this.setState({}, () => saveData(this.state))
	}
	/* 切换备忘颜色的处理函数 */
	handleChangeColor(memo, color) {
		memo.color = color;
		this.setState({}, () => saveData(this.state))
	}
	/* 删除备忘的处理函数，将备忘从todos中移除 */
	handleDelete(memo) {
		let todos = this.state.todos;
		todos.splice(todos.indexOf(memo), 1);
		this.setState({ todos: todos }, () => saveData(this.state));
	}
	/* 根据指定字段对列表进行排序 */
	handleChangeOrder(field) {
		this.setState({ order: field }, () => saveData(this.state));
	}
	/** 根据备忘状态对列表进行过滤 */
	handleChangeFilter(filter) { this.setState({ filter }, () => saveData(this.state)); }
	render() {
		let filter = this.state.filter;
		// 先对列表进行过滤，再进行排序
		let items = sortArrayByProp(this.state.todos.filter(memo => {
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

module.exports = TodoApp