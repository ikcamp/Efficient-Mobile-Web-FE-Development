const react = require("react")
const reactDom = require("react-dom")
const chai = require("chai")
const should = chai.should()
const testUtil = require("react-addons-test-utils")
const Memo = require("../src/memo")

let memo = {
    done: false,
    delete: 0
}

describe("memo", () => {
    const onToggleState = (data) => {
        data.done = !data.done
    }

    const onChangeColor = (data, color) => {
        data.color = color
    }

    const onDelete = (e) => {
        memo.delete++
    }

    describe("render", () => {
        it("render with done", () => {
            let data = {
                done: true
            }
            let app = testUtil.renderIntoDocument(<div><Memo memo={data} /></div>)
            let item = app.querySelector(".todo-item")
            should.exist(item, 'item rendered')
            should.equal(item.className, 'todo-item done', 'the done class has added')
        })

        it("render without done", () => {
            let data = {
                done: false
            }
            let app = testUtil.renderIntoDocument(<div><Memo memo={data} /></div>)
            let item = app.querySelector(".todo-item")
            should.equal(item.className, 'todo-item', 'the done class has added')
        })


    })

    describe("state", () => {
        this.app = testUtil.renderIntoDocument(<div><Memo onToggleState={onToggleState} onChangeColor={onChangeColor} onDelete={onDelete} memo={memo} /></div>)
        it("toggleState", () => {
            let state = this.app.querySelector("input[type=checkbox]")
            should.exist(state, 'the element has rendered')
            state.checked = true
            testUtil.Simulate.change(state)
            should.equal(memo.done, true, 'the state has changed')
        })
        it("toggleColor", () => {
            let color = this.app.querySelector(".color")
            should.exist(color, 'the element has rendered')
            color.value = '#ff0000'
            testUtil.Simulate.change(color)
            should.equal(memo.color, '#ff0000', 'the state has changed')
        })
        it("delete", () => {
            let del = this.app.querySelector(".del")
            testUtil.Simulate.click(del)
            should.equal(memo.delete, 1, 'item clicked')
        })
    })

})
