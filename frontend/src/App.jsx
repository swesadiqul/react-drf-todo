import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });
  const [selectedTodos, setSelectedTodos] = useState([]);

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

  // Handle edit field
  const handleEdit = (id, field, value) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, [field]: value } : todo
    );
    setTodos(updatedTodos);
  };

  // Save updated todo
  const handleSave = (id, updatedTodo) => {
    axios.put(`http://localhost:8000/api/v1/todos/${id}/`, updatedTodo)
      .then(response => {
        const updatedTodos = todos.map(todo =>
          todo.id === id ? response.data : todo
        );
        setTodos(updatedTodos);
      });
  };

  // Delete a single todo
  const handleDelete = (id) => {
    axios.delete(`http://localhost:8000/api/v1/todos/${id}/`)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
      });
  };

  // Handle select/deselect todos
  const handleSelect = (id) => {
    setSelectedTodos((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter(selectedId => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  // Delete selected todos
  const handleDeleteSelected = () => {
    axios
      .all(selectedTodos.map(id => axios.delete(`http://localhost:8000/api/v1/todos/${id}/`)))
      .then(() => {
        setTodos(todos.filter(todo => !selectedTodos.includes(todo.id)));
        setSelectedTodos([]);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center space-y-6 w-full max-w-4xl">
        {/* Form Section */}
        <h1 className="text-2xl font-bold">TODO Application</h1>
        <form onSubmit={handleSubmit} className="w-full border-2 border-blue-300 p-4 rounded-md bg-white">
          <input
            type="text"
            placeholder="Title"
            value={newTodo.title}
            onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
            className="mb-4 block w-full border border-gray-300 rounded p-2"
          />
          <textarea
            placeholder="Description"
            value={newTodo.description}
            onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
            className="mb-4 block w-full border border-gray-300 rounded p-2"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
          >
            Add Todo
          </button>
        </form>

        {/* Table Section */}
        <div className="overflow-x-auto w-full">
          <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead className="ltr:text-left rtl:text-right">
              <tr>
                <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTodos(todos.map(todo => todo.id));
                      } else {
                        setSelectedTodos([]);
                      }
                    }}
                    checked={selectedTodos.length === todos.length && todos.length > 0}
                  />
                </th>
                <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">ID</th>
                <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">Title</th>
                <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">Description</th>
                <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">Status</th>
                <th className="whitespace-nowrap text-left px-4 py-2 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {todos.map(todo => (
                <tr key={todo.id}>
                  <td className="whitespace-nowrap px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectedTodos.includes(todo.id)}
                      onChange={() => handleSelect(todo.id)}
                    />
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{todo.id}</td>
                  <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    <input
                      type="text"
                      value={todo.title}
                      onChange={(e) => handleEdit(todo.id, 'title', e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1"
                    />
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    <input
                      type="text"
                      value={todo.description}
                      onChange={(e) => handleEdit(todo.id, 'description', e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1"
                    />
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    <select
                      value={todo.completed ? 'Completed' : 'Pending'}
                      onChange={(e) => handleEdit(todo.id, 'completed', e.target.value === 'Completed')}
                      className="border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2">
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 mr-2"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleSave(todo.id, {
                        title: todo.title,
                        description: todo.description,
                        completed: todo.completed,
                      })}
                      className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Delete Selected Button */}
          {selectedTodos.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 mt-3"
            >
              Delete Selected
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
