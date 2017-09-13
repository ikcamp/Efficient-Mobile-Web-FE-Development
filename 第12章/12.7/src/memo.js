/** 备忘事项组件 */
const Memo = props => {
	let memo = props.memo;
	// 根据备忘的状态设置样式
	let classNames = 'todo-item' + (memo.done ? ' done' : '');
	return (
		<div className={classNames}>
			<input type="checkbox" checked={memo.done}
				onChange={() => props.onToggleState(memo)} />
			<input className="color" type="color" value={memo.color}
				onChange={(e) => props.onChangeColor(memo, e.target.value)} />
			<span className="text">{memo.text}</span>
			<span className="pull-right del"
				onClick={() => props.onDelete(memo)}>X</span>
			<a className="pull-right">{new Date(memo.time).toLocaleString()}</a>
		</div>
	);
}

module.exports = Memo