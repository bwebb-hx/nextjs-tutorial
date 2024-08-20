import React from 'react';
import TodoItem from './TodoItem';
import styles from '@/app/page.module.css';

interface TodoListProps {
  todos: string[];
  onRemove: (index: number) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onRemove }) => {
  return (
    <ul className={styles.todoList}>
      {todos.map((todo, index) => (
        <TodoItem key={index} todo={todo} index={index} onRemove={onRemove} />
      ))}
    </ul>
  );
};

export default TodoList;
