"use client";

import TodoList from '@/components/todoList/TodoList';
import React, { useState } from 'react';
import styles from './page.module.css';


const Home: React.FC = () => {
  const [todos, setTodos] = useState<string[]>([]);
  const [newTodo, setNewTodo] = useState<string>('');

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, newTodo]);
      setNewTodo('');
    }
  };

  const handleRemoveTodo = (index: number) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  return (
    <div className={styles.container}>
      <div className={styles.todoApp}>
        <h1>Todo List</h1>
        <div>
          <input
            type="text"
            className={styles.inputField}
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button className={styles.addButton} onClick={handleAddTodo}>
            Add Todo
          </button>
        </div>
        <TodoList todos={todos} onRemove={handleRemoveTodo} />
      </div>
    </div>
  );
};

export default Home;