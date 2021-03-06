import queryString from 'query-string';
import * as todoService from '../services/todo'

export default {
  namespace: 'todos',
  state: {todoList: []},
  reducers: {
    save(state, {payload: {todoList}}) {
      return {...state, todoList}
    }
  },
  effects: {
    * addTodo({payload: value}, {call, put, select}) {
      // 模拟网络请求
      const data = yield call(todoService.query, value);
      let tempList = yield select(state => state.todos.todoList);
      let todoList = [];
      todoList = todoList.concat(tempList);
      const tempObj = {};
      tempObj.value = value;
      tempObj.id = todoList.length;
      tempObj.finished = false;
      todoList.push(tempObj);
      yield put({type: 'save', payload: {todoList}})
    },
    * deleteTodo({payload: index}, {call, put, select}) {
      const data = yield call(todoService.query, index);
      let tempList = yield select(state => state.todos.todoList);
      let todoList = [];
      todoList = todoList.concat(tempList);
      todoList.splice(index, 1);
      yield put({type: 'save', payload: {todoList}})
    },
    * toggle({payload: index}, {call, put, select}) {
      const data = yield call(todoService.query, index);
      let tempList = yield select(state => state.todos.todoList);
      let todoList = [];
      todoList = todoList.concat(tempList);
      let obj = todoList[index];
      obj.finished = !obj.finished;
      yield put({type: 'save', payload: {todoList}})
    },
    * modifyTodo({payload: {index, todo}}, {call, put, select}) {
      const data = yield call(todoService.query, {index, todo});
      let tempList = yield select(state => state.todos.todoList);
      let todoList = [];
      todoList = todoList.concat(tempList);
      let obj = todoList[index];
      obj.value = todo;
      yield put({type: 'save', payload: {todoList}})
    },
  },
  subscriptions: {
    setup({dispatch, history}) {
      // 监听路由的变化，请求页面数据
      return history.listen(({pathname, search}) => {
        const query = queryString.parse(search);
        let todoList = [];

        if (pathname === 'todos') {
          dispatch({type: 'save', payload: {todoList}})
        }
      })
    }
  }
};
