ReactDOM.render(React.createElement(‘div’, null, ‘hello world!’), document.getElementById(‘app’));
var content = (
  <Nav>
    {/* child comment, put {} around */}
    <Person
      /* multi
         line
         comment */
      name={window.isLoggedIn ? window.name : ''} // end of line comment
    />
  </Nav>
);
<input type="button" disabled={false} />

ReactDOM.render(<div id={false} />, document.body);       // id="false"
ReactDOM.render(<input value={false} />, document.body);  // value="false"
ReactDOM.render(<div>{false}</div>, document.body);       // 没有子元素

<div>{'First &middot; Second'}</div>
<div>{'First · Second'}</div>
<div>{'First \u00b7 Second'}</div>
<div>{'First ' + String.fromCharCode(183) + ' Second'}</div>
<div dangerouslySetInnerHTML={{__html: 'First &middot; Second'}} />

