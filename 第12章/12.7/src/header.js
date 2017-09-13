const React = require("react")
const {loadData, saveData, sortArrayByProp, fillZero} = require("./util")
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
					<input className="time" type="time" value={this.state.time}
						onChange={this.handleTimeChange.bind(this)} />
				</div>
				<div className="bar">
					<strong>排序</strong>
					<span onClick={() => this.props.onChangeOrder('color')}>颜色</span>
					<span onClick={() => this.props.onChangeOrder('time')}>时间</span>
					<strong style={{ marginLeft: 20 /* 行内样式 */ }}>过滤</strong>
					<span onClick={() => this.props.onChangeFilter('全部')}>全部</span>
					<span onClick={() => this.props.onChangeFilter('待做')}>待做</span>
					<span onClick={() => this.props.onChangeFilter('已完成')}>已完成</span>
				</div>
			</div>
		);
	}
}
module.exports = Header