const react = require("react")
const reactDom = require("react-dom")
const chai = require("chai")
const testUtil = require("react-addons-test-utils")
const App = require("../src/app.js")

let items = {}

describe("test app", () => {
    before("render the dom", () => {
        const app = testUtil.renderIntoDocument(<App />)
        this.app = app
        this.header = testUtil.findRenderedDOMComponentWithClass(app, "header")
        this.todoList = testUtil.findRenderedDOMComponentWithClass(app, "todo-list")
        this.addBtn = this.header.querySelector("button")
    })
    describe("app rendered", () => {
        it("header rendered", () => {
            chai.expect(this.header, 'the header element has rendered')
            chai.expect(this.addBtn, 'the button has rendered')
            chai.expect(this.header.querySelector(".input-wrapper"), 'the input element has rendered')
            chai.expect(this.header.querySelector(".bar"), 'the bar has rendered')
        })
    })

    const addItem = (item, date, time) => {
        let inputText = this.inputWrapper.querySelector("input")
        let inputDate = this.inputWrapper.querySelector(".date")
        let inputTime = this.inputWrapper.querySelector(".time")
        inputText.value = item
        inputDate.value = date
        inputTime.value = time
        testUtil.Simulate.change(inputText)
        testUtil.Simulate.change(inputDate)
        testUtil.Simulate.change(inputTime)
        testUtil.Simulate.click(this.addBtn)
    }

    describe("add an item", () => {
        before("get item", () => {
            this.inputWrapper = this.header.querySelector(".input-wrapper")
        })
        it("the input elements rendered", () => {
            chai.expect(this.inputText, 'the text rendered')
            chai.expect(this.inputDate, 'the date element has rendered')
            chai.expect(this.inputTime, 'the time input has rendered')
        })

        it("add", () => {
            let items = this.todoList.querySelectorAll(".todo-item")
            let length = items.length
            addItem.bind(this)('test', new Date().toDateString(), new Date().toTimeString())
            items = this.todoList.querySelectorAll(".todo-item")
            chai.expect(items.length === length + 1, 'an item has been added')
            let item = items[items.length-1]
            chai.should().equal(item.querySelector(".text").textContent, 'test', 'the item has added')
        })

        it("delete", ()=>{
            addItem.bind(this)('test1', '2017/1/13', '12:00')
            let items = this.todoList.querySelectorAll(".todo-item")
            let item = items[items.length-1]
            let length = items.length
            chai.should().equal(item.querySelector(".text").textContent, 'test1', 'the item has added')
            let checkbox = item.querySelector(".del")
            testUtil.Simulate.click(checkbox)
            items = this.todoList.querySelectorAll(".todo-item")
            chai.should().equal(items.length , length-1, 'the item has removed')
        })

        it("item operation", ()=>{
            addItem.bind(this)('test1', '2017/1/13', '12:00')
            let items = this.todoList.querySelectorAll(".todo-item")
            let item = items[items.length-1]
            chai.should().equal(item.querySelector(".text").textContent, 'test1', 'the item has added')
            let checkbox = item.querySelector("input[type=checkbox]")
            checkbox.checked = !checkbox.checked
            testUtil.Simulate.change(checkbox)
        })
    })

})