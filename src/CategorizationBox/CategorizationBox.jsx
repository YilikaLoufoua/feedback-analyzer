import './CategorizationBox.css';
import Dropdown from '../Dropdown/Dropdown';

export default function CategorizationBox({
	selectedColumn,
	data,
	categorization,
	handleAddCategory,
	setGlowFeedbacks,
	setGrowFeedbacks,
}) {
	let idx;
	if (data) {
		data[0].forEach((item, index) => {
			if (item == selectedColumn) idx = index;
		});
	}
	return (
		<div id='categorization-box'>
			<h2>Categorize {selectedColumn}</h2>
			<div className='info'>
				{data.map((item, i) =>
					i == 0 ? null : item[idx] == '' ? null : (
						<li key={item}>
							<Dropdown
								categorization={categorization}
								handleAddCategory={handleAddCategory}
								feedback={item[idx]}
							/>
							<p className='feedback'>{item[idx]}</p>
							<div className='sentiment-buttons-field'>
								<button
									className='glow-button'
									onClick={() => setGlowFeedbacks((glowFeedbacks) => [...glowFeedbacks, item[idx]])}
								>
									GLOW
								</button>
								<button
									className='grow-button'
									onClick={() => setGrowFeedbacks((growFeedbacks) => [...growFeedbacks, item[idx]])}
								>
									GROW
								</button>
							</div>
						</li>
					)
				)}
			</div>
		</div>
	);
}
