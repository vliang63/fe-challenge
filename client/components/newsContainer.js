var React = require('react');

var NewsContainer = React.createClass({
	render: function(){
		return (
			<div>
				<header className="teal lighten-2">
				    <h2 className="logo">Newsie</h2>
				</header>
				<main className="container">
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
			filter: '',
			sort: ''
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
					accountData['eventType'] = indexedEvents[accountData['accountId']]['event']['eventType'];
					accountData['eventSnippet'] = indexedEvents[accountData['accountId']]['event']['snippet'];
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

	changeSort: function(e){
		this.setState({
			sort: e.target.value
		})
	},
	render: function(){
		var accountEventsData = this.state.accountEventsData;
		if (this.state.filter){
			accountEventsData = accountEventsData.filter(function(item){
				var stringifiedData = JSON.stringify(item).toLowerCase();
				return stringifiedData.indexOf(this.state.filter.toLowerCase()) >= 0;
			}.bind(this));
		}
		if(this.state.sort){
			accountEventsData.sort(function(item1, item2){
				if(item1[this.state.sort] < item2[this.state.sort]) {
					return -1;
				}
				if(item1[this.state.sort] > item2[this.state.sort]) {
					return 1;
				}
				return 0;
			}.bind(this));
		}
		var listItems = accountEventsData.map(function(accountEventData, i){
			return (
				<ListFeedItem key={i} data={accountEventData} />		
			)
		});

		return (
			<div>
				<section className="controls">
					<label for="feed-filter">Filter:</label>
					<input id="feed-filter" className="input-field col s12" value={this.state.filter} onChange={this.changeFilter} className="filter-accounts" type="text" />
					<label for="feed-sort">Sort By:</label>
					<select id='feed-sort' className="browser-default input-field col s12" onChange={this.changeSort}>
						<option value="" defaultValue disabled></option>
						<option value="accountId">Account Id</option>
						<option value="eventSnippet">Event Description</option>
						<option value="eventTime">Event Time</option>
						<option value="eventType">Event Type</option>
						<option value="firstName">First Name</option>
						<option value="lastName">Last Name</option>
					</select>
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
			<li className="feed-item row">
				<div className="item-content">
					<div className="item-image col 4">
						<img src={this.props.data.image} />
					</div>
					<div className="item-account col m4">
						<p className="data-title">Name: </p>
						<p>{this.props.data.firstName} {this.props.data.lastName}</p>
					</div>
					<div className="item-event col m4">
						<p className="data-title">Event Type: </p>
						<p>{this.props.data.eventType}</p>
						<p className="data-title">Event Description: </p>
						<p>{this.props.data.eventSnippet}</p>
					</div>
				</div>
			</li>
		)
	}

});


module.exports = NewsContainer;