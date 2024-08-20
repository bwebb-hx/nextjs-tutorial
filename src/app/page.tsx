"use client";

import TodoList from '@/components/todoList/TodoList';
import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    const canvas = document.getElementById('matrix-canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    const columns = Math.floor(width / 20) + 1;
    const yPositions = Array(columns).fill(0);

    const matrix = () => {
      if (!ctx) return;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';  // Slightly increase the transparency for a dimmer effect
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = 'rgba(0, 255, 204, 0.4)';  // Dim the brightness slightly
      ctx.font = '18px monospace';

      yPositions.forEach((y, index) => {
        const text = String.fromCharCode(Math.random() * 128);
        const x = index * 20;
        ctx.fillText(text, x, y);
        yPositions[index] = y > height ? 0 : y + 15;
      });
    };

    const interval = setInterval(matrix, 60);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      <canvas id="matrix-canvas" className={styles.matrixRain}></canvas>
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