import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });

  // Load todos from API
  useEffect(() => {
    axios.get('http://localhost:8000/api/v1/todos/')
      .then(response => {
        setTodos(response.data);
      });
  }, []);

  // Add new todo
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/v1/todos/', newTodo)
      .then(response => {
        setTodos([...todos, response.data]);
        setNewTodo({ title: '', description: '' });
      });
  };

  return (
    <div>
      <h1>TODO Application</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={newTodo.title}
          onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={newTodo.description}
          onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
        />
        <button type="submit">Add Todo</button>
      </form>

      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <h3>{todo.title}</h3>
            <p>{todo.description}</p>
            <p>Status: {todo.completed ? 'Completed' : 'Pending'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
