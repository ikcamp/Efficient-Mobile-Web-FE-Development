var UserList = React.createClass({
	render: function() {	
		// 遍历列表数据，返回用户列表节点数组
		var userList = this.props.users.map(user=>(
			<div className="user-item">
				<img className="user-avatar" src={user.avatar} />
				<span>{user.name}</span>
			</div>
		));
		return (
			<ul>{userList}</ul>
		);
	}
});

// 约定props
UserList.propTypes = {
	users: React.PropTypes.array	// 数组类型
};

var FriendListContainer = React.createClass({
	getInitialState: function() {
		return {
			friendList: []
		}
	},
	componentWillMount: function() {
		// 通过fetch获取初始数据
		fetch('api/friends.json?id=' + this.props.userId)
		.then(res=>res.json())
		.then(data=>{
			this.setState({
				friendList: data.items
			})
		})
	},
	render: function() {
		return (
			<UserList users={this.state.friendList} />
		);
	}
});

ReactDOM.render(<FriendListContainer userId={123} />, document.querySelector('#root'));