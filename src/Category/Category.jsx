import "./Category.css";

export default function Category({ category, data }) {
  let idx;
  data[0].forEach((item, index) => {
    if (item == category) idx = index;
  });
  console.log(idx);
  return (
    <div id="category">
      <h1>{category}</h1>
      <div class="info">
        {data.map((item, i) => {
          return i == 0 ? null : item[idx] == "" ? null : <li>{item[idx]}</li>;
        })}
      </div>
    </div>
  );
}
