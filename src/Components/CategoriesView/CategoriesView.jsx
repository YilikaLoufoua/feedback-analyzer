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
				className='category-view'
				feedbacks={categorization[selectedCategory]}
				glowFeedbacks={glowFeedbacks}
				growFeedbacks={growFeedbacks}
				selectedSentiment={selectedSentiment}
			/>
		</div>
	);
}

export function CategoryView({ feedbacks, selectedSentiment, glowFeedbacks }) {
	console.log('glowFeedbacks: ', glowFeedbacks);
	console.log('selectedSentiment: ', selectedSentiment);
	console.log('feedbacks: ', feedbacks);
	if (selectedSentiment) {
		return (
			<div>
				{feedbacks &&
					glowFeedbacks &&
					selectedSentiment === 'GLOW' &&
					feedbacks.map((feedback) => {
						if (glowFeedbacks.includes(feedback)) {
							return <li key={feedback}>{feedback}</li>;
						}
					})}
			</div>
		);
	}
	return (
		<div className='category-view'>
			{feedbacks &&
				feedbacks.map((feedback) => {
					return <li key={feedback}>{feedback}</li>;
				})}
		</div>
	);
}
