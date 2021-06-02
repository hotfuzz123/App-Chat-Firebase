import { Component } from "react";
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import firebase from '../../firebase'
import md5 from "md5";

class Register extends Component {
    state = {
        username: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        errors: [],
        loading: false,
        userRef: firebase.database().ref('users')
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    isFormValid = () => {
        let errors = []
        let error
        if (this.isFormEmpty(this.state)) {
            error = { message: 'Fill in all fields' }
            this.setState({ errors: errors.concat(error) })
            return false
        } else if (!this.isPassWordValid(this.state)) {
            error = { message: 'Password is valid' }
            this.setState({ errors: errors.concat(error) })
            return false
        } else return true
    }

    isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
        return !username.length || !email.length || !password.length || !passwordConfirmation.length
    }

    isPassWordValid = ({ password, passwordConfirmation }) => {
        console.log('CHECKIT')
        if (password.length < 6 || passwordConfirmation.length < 6)
            return false
        else if (password !== passwordConfirmation)
            return false
        else
            return true
    }

    displayErrors = (errors) => {
        return errors.map((error, index) =>
            <p key={index}>{error.message}</p>
        )
    }

    handleSubmit = async (event) => {
        event.preventDefault()
        if (this.isFormValid()) {
            this.setState({ errors: [], loading: true })
            // firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then(createUser => console.log(createUser)).catch(error => console.error(error))
            try {
                const createUser = await firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
                console.log(createUser)
                await createUser.user.updateProfile({
                    displayName: this.state.username,
                    photoURL: `http://gravatar.com/avatar/${md5(createUser.user.email)}?d=identicon`
                })
                this.saveUser(createUser)
                console.log('user saved')
                this.setState({ loading: false })
            } catch (error) {
                console.log(error)
                this.setState({ errors: this.state.errors.concat(error), loading: false })
            }
        }
    }
    handleInputError = (errors, inputName) => {
        return errors.some(error =>
            error.message.toLowerCase().includes(inputName))
            ? 'error'
            : ''
    }
    saveUser = (createUser) => {
        return this.state.userRef.child(createUser.user.uid).set({
            name: createUser.user.displayName,
            avatar: createUser.user.photoURL
        })
    }
    render() {
        const { username, email, password, passwordConfirmation, loading } = this.state
        return (
            <div>
                <Grid textAlign='center' verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <Header as='h2' icon style={{ color: '#1b4332' }} textAlign='center'>
                            <Icon name='undo alternate' style={{ color: '#1b4332' }} />
                            Register for Chat App
                        </Header>
                        <Form sie='large' onSubmit={this.handleSubmit}>
                            <Segment stacked>
                                <Form.Input fluid name='username' icon='user' iconPosition='left'
                                    placeholder='Username' onChange={this.handleChange} type='text'
                                    value={username}
                                />

                                <Form.Input fluid name='email' icon='mail' iconPosition='left'
                                    placeholder='Email Address' onChange={this.handleChange} type='email' value={email}
                                    className={this.handleInputError(this.state.errors, 'email')} />

                                <Form.Input fluid name='password' icon='lock' iconPosition='left'
                                    placeholder='Password' onChange={this.handleChange} type='password' value={password}
                                    className={this.handleInputError(this.state.errors, 'password')} />
                                <Form.Input fluid name='passwordConfirmation' icon='repeat' iconPosition='left'
                                    placeholder='Password Confirmation' onChange={this.handleChange} type='password' value={passwordConfirmation}
                                    className={this.handleInputError(this.state.errors, 'password')}
                                />
                                <Button disabled={loading} className={loading ? 'loading' : ''} style={{ color: '#1b4332' }} fluid size='large'> {/* // loading icon */}
                                Submit
                                    </Button>

                            </Segment>
                        </Form>
                        {this.state.errors.length > 0 && (
                            <Message error><h3>Error</h3>
                                {this.displayErrors(this.state.errors)}
                            </Message>
                        )}
                        <Message>Already a user ? <Link to='/login'> Login</Link></Message>
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}
export default Register