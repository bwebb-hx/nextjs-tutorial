import React from 'react';

import styles from '@/app/page.module.css';
import { Item } from '@hexabase/hexabase-js';

interface TodoItemProps {
  todo: Item;
  index: number;
  onRemove: (index: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, index, onRemove }) => {
  const title = todo.get<string>("Title");
  return (
    <li className={styles.todoItem}>
      {title}
      <button className={styles.removeButton} onClick={() => onRemove(index)}>Remove</button>
    </li>
  );
};

export default TodoItem;
