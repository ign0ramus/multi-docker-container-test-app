import React, { Component } from 'react';
import axios from 'axios';

export default class Fib extends Component {
	state = {
		indexes: [],
		values: {},
		index: '',
	};

	componentDidMount() {
		this.fetchValues();
		this.fetchIndexes();
	}

	async fetchValues() {
		const res = await axios.get('/api/values/current');
		this.setState({ values: res.data });
	}

	async fetchIndexes() {
		const res = await axios.get('/api/values/all');
		this.setState({ indexes: res.data });
	}

	handleSubmit = async (e) => {
		e.preventDefault();
		await axios.post('/api/values', { index: this.state.index });
		this.setState({ index: '' });
	};

	render() {
		const { indexes, values, index } = this.state;
		return (
			<div>
				<form onSubmit={this.handleSubmit}>
					<label>Enter your index</label>
					<input
						value={index}
						onChange={({ target: { value } }) =>
							this.setState({ index: value })
						}
					/>
					<button>Submit</button>
				</form>
				<h3>Indexes I have seen</h3>
				{indexes.map(({number}) => number).join(', ')}
				<h3>Calculated values:</h3>
				{Object.entries(values).map(([key, value]) => (
					<p key={key}>{`For index ${key} I calculated ${value}`}</p>
				))}
			</div>
		);
	}
}
