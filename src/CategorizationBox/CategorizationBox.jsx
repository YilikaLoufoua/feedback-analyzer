import "./CategorizationBox.css";
import Dropdown from "../Dropdown/Dropdown";

export default function Category({ selectedColumn, data, categorization, handleAddCategory }) {
  let idx;

  data[0].forEach((item, index) => {
    if (item == selectedColumn) idx = index;
  });

  return (
    <div id="categorization-box">
      <h2>Categorize {selectedColumn}</h2>
      <div className="info">
        {data.map((item, i) => {
          return i == 0 ? null : item[idx] == "" ? null : 
          <li key={item}>
            <Dropdown categorization={categorization} handleAddCategory={handleAddCategory} feedback={item[idx]}/><p>{item[idx]}</p>
          </li>;
        })}
      </div>
    </div>
  );
}
