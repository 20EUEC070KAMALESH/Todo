import react from 'react';
import './App.scss';
import React, { useState, useEffect } from 'react';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    checkDueTasks();
  }, []);

  const checkDueTasks = () => {
    const now = new Date();
    const updatedTodos = todos.map((todo) => {
      if (todo.dueDate && now > new Date(todo.dueDate) && todo.status !== 'Overdue') {
        return { ...todo, status: 'Overdue' };
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddTodo = () => {
    if (inputValue.trim() !== '') {
      if (editId !== null) {
        const updatedTodos = todos.map((todo) =>
          todo.id === editId ? { ...todo, text: inputValue } : todo
        );
        setTodos(updatedTodos);
        setEditId(null);
      } else {
        setTodos([...todos, { id: Date.now(), text: inputValue, status: 'Pending', dueDate: null }]);
      }
      setInputValue('');
    }
  };

  const handleEditTodo = (id, text) => {
    setInputValue(text);
    setEditId(id);
  };

  const handleToggleComplete = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, status: todo.status === 'Completed' ? 'Pending' : 'Completed' } : todo
    );
    setTodos(updatedTodos);
  };

  const handleRemoveTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  const handleClearCompleted = () => {
    const updatedTodos = todos.filter((todo) => todo.status !== 'Completed');
    setTodos(updatedTodos);
  };

  const handleSetDueDate = (id, dueDate) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, dueDate } : todo
    );
    setTodos(updatedTodos);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'All') return true;
    if (filter === 'Pending') return todo.status !== 'Completed';
    if (filter === 'Completed') return todo.status === 'Completed';
    return true;
  });

  // Sort tasks based on due time
  filteredTodos.sort((a, b) => {
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    return 0;
  });

  return (
    <div className="todo-container">
      <h1 className="todo-title">To-Do List</h1>
      <div className="todo-input">
        <input
          type="text"
          placeholder="Enter your to-do"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button className="add-button" onClick={handleAddTodo}>
          {editId !== null ? 'Save' : 'Add'}
        </button>
      </div>
      <div className="todo-filters">
        <button className={filter === 'All' ? 'active-filter' : ''} onClick={() => setFilter('All')}>
          All
        </button>
        <button className={filter === 'Pending' ? 'active-filter' : ''} onClick={() => setFilter('Pending')}>
          Pending
        </button>
        <button className={filter === 'Completed' ? 'active-filter' : ''} onClick={() => setFilter('Completed')}>
          Completed
        </button>
      </div>
      <ul className="todo-list">
        {filteredTodos.map((todo) => (
          <li key={todo.id} className={`${todo.status === 'Completed' ? 'completed' : ''} ${todo.status === 'Overdue' ? 'overdue' : ''}`}>
            <span className="todo-text">{todo.text}</span>
            <div className="todo-info">
              <span>{`Status: ${todo.status}`}</span>
              {todo.dueDate && <span>{`Due: ${new Date(todo.dueDate).toLocaleString()}`}</span>}
            </div>
            <div className="todo-actions">
              <button
                className="edit-button"
                onClick={() => handleEditTodo(todo.id, todo.text)}
              >
                Edit
              </button>
              <button
                className="complete-button"
                onClick={() => handleToggleComplete(todo.id)}
              >
                {todo.status === 'Completed' ? 'Undo' : 'Complete'}
              </button>
              <button
                className="remove-button"
                onClick={() => handleRemoveTodo(todo.id)}
              >
                Remove
              </button>
              <input
                type="datetime-local"
                value={todo.dueDate || ''}
                onChange={(e) => handleSetDueDate(todo.id, e.target.value)}
              />
            </div>
          </li>
        ))}
      </ul>
      <button className="clear-button" onClick={handleClearCompleted}>
        Clear Completed
      </button>
    </div>
  );
};

export default TodoList;
