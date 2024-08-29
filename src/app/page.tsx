"use client";

import TodoList from '@/components/todoList/TodoList';
import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { useAuthRedirect } from '@/hexabase/hexabase';
import DigitalRain from '@/components/effects/DigitalRain';
import { loadTodosFromDatabase } from '@/hexabase/todo-db';
import Cookies from 'js-cookie';
import { Item } from '@hexabase/hexabase-js';

const Home: React.FC = () => {
  const router = useRouter();

  const [todos, setTodos] = useState<Item[]>();
  const [newTodo, setNewTodo] = useState<string>('');

  const token = Cookies.get("tokenHxb");
  
  useEffect(() => {
    if (token && !todos) {
      (async () => {
        const todoItems = await loadTodosFromDatabase(token);
        setTodos(todoItems);
      })();
    }
  }, [token, todos]);

  const handleAddTodo = () => {
  };

  const handleRemoveTodo = (index: number) => {
  };

  useAuthRedirect();

  return (
    <div className={styles.container}>
      <DigitalRain />
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
        { todos && <TodoList todos={todos} onRemove={handleRemoveTodo} /> }
      </div>
    </div>
  );
};

export default Home;