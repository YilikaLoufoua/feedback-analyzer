import './CategorizationBox.css';
import Dropdown from '../Dropdown/Dropdown';

export default function CategorizationBox({
  selectedColumn,
  data,
  categorization,
  handleAddCategory,

  setSelectedColumn,
  addGlow,
  addGrow,
}) {
  let idx;
  if (data) {
    data[0].forEach((item, index) => {
      if (item == selectedColumn) idx = index;
    });
  }
  const getColumnData = (item, index) => {
    if (index == 0 || item[idx] == '') return;
    return (
      <li key={item}>
        <Dropdown
          selectedColumn={selectedColumn}
          categorization={categorization}
          handleAddCategory={handleAddCategory}
          feedback={item[idx]}
        />
        <p className="feedback">{item[idx]}</p>
        <div className="sentiment-buttons-field">
          <button
            className="glow-button"
            onClick={() => {
              addGlow(item[idx]);
            }}
          >
            GLOW
          </button>
          <button className="grow-button" onClick={() => addGrow(item[idx])}>
            GROW
          </button>
        </div>
      </li>
    );
  };
  return (
    <div id="categorization-box">
      <div className="head">
        <button className="close" onClick={() => setSelectedColumn('')}>
          X
        </button>
        <h2>Categorize {selectedColumn}</h2>
      </div>

      <div className="info">{data.map(getColumnData)}</div>
    </div>
  );
}
