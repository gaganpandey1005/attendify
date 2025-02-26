import { useState } from "react";

const CreateSheet = () => {
  const [batch, setBatch] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Sheet Created for ${batch} on ${date}`);
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Create Attendance Sheet</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">Batch:</label>
        <select
          className="w-full p-2 border rounded mb-4"
          onChange={(e) => setBatch(e.target.value)}
        >
          <option value="">Select Batch</option>
          <option value="Batch A">Batch A</option>
          <option value="Batch B">Batch B</option>
        </select>
        <label className="block mb-2">Date:</label>
        <input
          type="date"
          className="w-full p-2 border rounded mb-4"
          onChange={(e) => setDate(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Sheet
        </button>
      </form>
    </div>
  );
};

export default CreateSheet;
