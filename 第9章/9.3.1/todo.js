(function(exports) {
  'use strict';
	
  exports.app = new Vue({
    // the root element that will be compiled
    el: '.todoapp',

    // app initial state
    data: {
      todos: [],
      newTodo: '',
    },
    // methods that implement data logic.
    // note there's no DOM manipulation here at all.
    methods: {
      addTodo: function() {
        var value = this.newTodo && this.newTodo.trim();
        if (!value) {
          return;
        }
        this.todos.push({
          id: this.todos.length ? this.todos[this.todos.length - 1].id++ : 1,
          title: value,
          completed: false
        });
        this.newTodo = '';
      },

      removeTodo: function(todo) {
        this.todos.splice(this.todos.indexOf(todo), 1);
      }
    }
  });
})(window);
