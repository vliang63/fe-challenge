var React = require('react');

var NewsContainer = React.createClass({
	render: function(){
		return (
			<div>
				<header>
				    <h2 className="logo">Newsie</h2>
				</header>
				<main>
					<section className="controls">
					</section>
					<section className="feed">
					</section>
				</main>
			</div>
		)
	}
});



module.exports = NewsContainer;