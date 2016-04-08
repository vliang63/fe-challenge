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
				var stringifiedData = JSON.stringify(accountEventData);
				return stringifiedData.indexOf(this.state.filter) >= 0;
			});
		}
		if(this.state.sort){
			console.log('sorting')
			console.log(this.state.sort)
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
					<input value={this.state.filter} onChange={this.changeFilter} className="filter-accounts" type="text" />
					<label>Sort By:</label>
					<select onChange={this.changeSort}>
						<option value=""></option>
						<option value="accountId">Account Id</option>
						<option value="eventSnippet">Event Description</option>
						<option value="eventTime">Event Time</option>
						<option value="eventType">Event Type</option>
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
			<li className="feed-item">
				<img src={this.props.data.image} />
				<h4>{this.props.data.firstName} {this.props.data.lastName}</h4>
				<span>{this.props.data.eventType}</span>
				<br></br>
				<span>{this.props.data.eventSnippet}</span>
			</li>
		)
	}

});


module.exports = NewsContainer;