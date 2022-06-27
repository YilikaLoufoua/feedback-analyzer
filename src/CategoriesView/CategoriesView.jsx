import { useState } from "react";
import "./CategoriesView.css";

export default function CategoriesView({ categorization }) {
	let [selectedCategory, setSelectedCategory] = useState("");

	return (
		<div className="categories-view">
			<div className="category-buttons">
				{Object.keys(categorization).map((category) => {
					if (categorization[category].length > 0) {
						return (
							<button key={category} onClick={() => setSelectedCategory(category)}>
								{category}
							</button>
						);
					}
				})}
			</div>
			<CategoryView category={selectedCategory} className="category-view" feedbacks={categorization[selectedCategory]} />
		</div>
	);
}

export function CategoryView({ category, feedbacks }) {
	return (
		<div className="category-view">
			{feedbacks &&
				feedbacks.map((feedback) => {
					return <li key={feedback}>{feedback}</li>;
				})}
		</div>
	);
}
