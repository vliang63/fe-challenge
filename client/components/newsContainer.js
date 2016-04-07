var React = require('react');

var NewsContainer = React.createClass({
	render: function(){
		return (
			<div>
				<header>
				    <h2 className="logo">Newsie</h2>
				</header>
				<main>
					<NewsList />
				</main>
			</div>
		)
	}
});

var NewsList = React.createClass({
	getInitialState: function(){
		return {
			accountsData: [],
			eventsData: [],
			accountEventsData: [],
			filter: ''
		}
	},
	componentDidMount: function(){
		$.get('../data/events.json', function(eventsData){
			var eventsData = eventsData;
			var indexedEvents = [];
			for(var i = 0; i < eventsData.length; i++) {
				indexedEvents[eventsData[i]["accountId"]] = eventsData[i];
			}

			$.get('../data/accounts.json', function(accountsData){
				var accountsData = accountsData;
				var accountEventsData = accountsData.map(function(accountData){
					accountData['eventData'] = indexedEvents[accountData['accountId']]['event'];
					accountData['eventTime'] = indexedEvents[accountData['accountId']]['time'];
					return accountData;
				});
			
				this.setState({
					accountsData: accountsData,
					eventsData: eventsData,
					accountEventsData: accountEventsData
				});
			}.bind(this));			
		}.bind(this));	
	},

	changeFilter: function(e){
		this.setState({
			filter: e.target.value
		})
	},
	render: function(){
		var listItems = this.state.accountEventsData.map(function(accountEventData, i){				
			var stringifiedData = JSON.stringify(accountEventData);
			if(this.state.filter){
				if(stringifiedData.indexOf(this.state.filter) >= 0){
					return (
						<ListFeedItem key={i} data={accountEventData} />		
					)
				}
			}else{
				return (
					<ListFeedItem key={i} data={accountEventData} />		
				)
			}
		}.bind(this));

		return (
			<div>
				<section className="controls">
					<input value={this.state.filter} onChange={this.changeFilter} className="filter-accounts" type="text" />
				</section>
				<section className="feed">
					{listItems}
				</section>
			</div>
			
		)
	}

});

var ListFeedItem = React.createClass({
	
	render: function(){
		return (
			<li className="feed-item">
				<img src={this.props.data.image} />
				<h4>{this.props.data.firstName} {this.props.data.lastName}</h4>
			</li>
		)
	}

});


module.exports = NewsContainer;