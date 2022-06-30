import "./Dropdown.css";
import { React, useEffect, useState } from "react";

export default function Dropdown({
  categorization,
  handleAddCategory,
  feedback,
  selectedColumn,
}) {
  const categories = Object.keys(categorization);

  let [selectedCategory, setSelectedCategory] = useState("");

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    if (selectedCategory) {
      handleAddCategory(selectedCategory, feedback);
    }
  }, [selectedCategory]);
  useEffect(() => {
    setSelectedCategory("");
  }, [selectedColumn]);

  return (
    <div className="dropdown">
      <button
        className="dropbtn"
        style={{
          backgroundColor: selectedCategory != "" ? "#c9daf8" : "white",
        }}
      >
        {selectedCategory || "Category"}
      </button>
      <div className="dropdown-content">
        {categories &&
          categories.map((category) => (
            <a key={category} onClick={() => handleSelectCategory(category)}>
              {category}
            </a>
          ))}
      </div>
    </div>
  );
}
