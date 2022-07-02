import './CategoriesView.css';
import { useState } from 'react';

export default function CategoriesView({
	categorization,
	selectedCategory,
	setSelectedCategory,
	glowFeedbacks,
	growFeedbacks,
}) {
	const [selectedSentiment, setSelectedSentiment] = useState('');

	return (
		<div className='categories-view'>
			<div className='category-buttons-field'>
				<div className='category-buttons'>
					{Object.keys(categorization).map((category) => {
						if (categorization[category].length > 0) {
							return (
								<button
									className={
										selectedCategory === category ? 'category-button' : 'active-category-button'
									}
									key={category}
									onClick={() => setSelectedCategory(category)}
								>
									{category}
								</button>
							);
						}
					})}
				</div>
				<div className='sentiment-buttons'>
					<span>Filter By: </span>
					<button className='glow-button' onClick={() => setSelectedSentiment('GLOW')}>
						GLOW
					</button>
					<button className='grow-button' onClick={() => setSelectedSentiment('GROW')}>
						GROW
					</button>
				</div>
			</div>
			<CategoryView
				category={selectedCategory}
				feedbacks={categorization[selectedCategory]}
				glowFeedbacks={glowFeedbacks}
				growFeedbacks={growFeedbacks}
				selectedSentiment={selectedSentiment}
			/>
		</div>
	);
}

export function CategoryView({ feedbacks, selectedSentiment, glowFeedbacks, growFeedbacks }) {
	let dumbBool = true;
	let filtered = [...growFeedbacks, ...glowFeedbacks];
	if (feedbacks) {
		filtered = feedbacks;
		dumbBool = false;
	}
	if (selectedSentiment.length > 0) {
		dumbBool = false;
		filtered =
			selectedSentiment == 'GROW'
				? filtered.filter((item) => growFeedbacks.includes(item))
				: filtered.filter((item) => glowFeedbacks.includes(item));
	}

	return !dumbBool ? (
		<div className='category-view'>
			{filtered &&
				filtered.map((feedback) => {
					return <li key={feedback}>{feedback}</li>;
				})}
		</div>
	) : null;
}
