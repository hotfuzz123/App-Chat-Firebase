import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Switch, Route, withRouter } from 'react-router-dom';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import 'semantic-ui-css/semantic.min.css'
import './components/App.css'
import firebase from './firebase'
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux' // connect redux state with specific component 
import { composeWithDevTools, ComposeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './reducers';
import { clearUser, setUser } from './actions'
import Spinner from './Spinner'

const store = createStore(rootReducer, composeWithDevTools())

class Root extends Component {
	componentDidMount() {
		console.log(this.props.isLoading)
		firebase.auth().onAuthStateChanged(user => {
			if (user) {
				this.props.setUser(user)
				this.props.history.push('/')
				console.log(user)
			} else {
				this.props.history.push('/login')
				this.props.clearUser()
			}
		})
	}
	render() {
		return this.props.isLoading
			? <Spinner />
			: (
				<Switch>
					<Route exact path="/" component={App} />
					<Route exact path="/login" component={Login} />
					<Route exact path="/register" component={Register} />
				</Switch>
			)
	}
}

const mapStateFromProps = state => ({
	isLoading: state.user.isLoading
})

const RootWithAuth = withRouter(connect(mapStateFromProps, { setUser, clearUser })(Root)) // take setUser in action.js and put it on props Object with component wrapper with 'connect'

ReactDOM.render(
	<Provider store={store}>
		<Router>
			<RootWithAuth />
		</Router>
	</Provider>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
