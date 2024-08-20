import React from 'react';

import styles from '@/app/page.module.css';

interface TodoItemProps {
  todo: string;
  index: number;
  onRemove: (index: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, index, onRemove }) => {
  return (
    <li className={styles.todoItem}>
      {todo} 
      <button className={styles.removeButton} onClick={() => onRemove(index)}>Remove</button>
    </li>
  );
};

export default TodoItem;
