const Memo = require("./memo")
/** 备忘列表组件 */
const TodoList = props => {
	// 遍历props中的列表数据，生成备忘组件列表
	let todolist = props.items.map(memo => (
		<Memo memo={memo} onToggleState={props.onToggleState}
			onChangeColor={props.onChangeColor} onDelete={props.onDelete} />
	));
	return (
		<div className="todo-list-wrapper">
			<div>{`${props.title} (${props.items.length})`}</div>
			<div className="todo-list">{todolist}</div>
		</div>
	);
}

module.exports = TodoList