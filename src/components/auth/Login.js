import { Component } from "react";
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import firebase from '../../firebase'
import md5 from "md5";

class Login extends Component {
    state = {
        email: '',
        password: '',
        errors: [],
        loading: false,
    }
    displayErrors = errors =>
        errors.map((error, i) => <p key={i}>{error.message}</p>);
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    isFormValid = ({ email, password }) => email && password

    handleSubmit = async (event) => {
        event.preventDefault()
        if (this.isFormValid(this.state)) {
            this.setState({ errors: [], loading: true })

            try {
                const signedInUser = await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
                console.log(signedInUser)

            } catch (err) {
                console.log(err)
                this.setState({
                    errors: this.state.errors.concat(err),
                    loading: false
                })
            }
        }
    }
    handleInputError = (errors, inputName) => {
        return errors.some(error =>
            error.message.toLowerCase().includes(inputName))
            ? 'error'
            : ''
    }

    render() {
        const { email, password, loading } = this.state
        return (
            <div>
                <Grid textAlign='center' verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <Header as='h2' icon style={{ color: '#ee9b00' }} textAlign='center'>
                            <Icon name='wpexplorer' style={{ color: '#ee9b00' }} />
                            Login to Chat App
                        </Header>
                        <Form sie='large' onSubmit={this.handleSubmit}>
                            <Segment stacked>


                                <Form.Input fluid name='email' icon='mail' iconPosition='left'
                                    placeholder='Email Address' onChange={this.handleChange} type='email' value={email}
                                    className={this.handleInputError(this.state.errors, 'email')} />

                                <Form.Input fluid name='password' icon='lock' iconPosition='left'
                                    placeholder='Password' onChange={this.handleChange} type='password' value={password}
                                    className={this.handleInputError(this.state.errors, 'password')} />
                                <Button disabled={loading} className={loading ? 'loading' : ''} style={{ color: '#ee9b00' }} fluid size='large'> {/* // loading icon */}
                                Submit
                                    </Button>

                            </Segment>
                        </Form>
                        {this.state.errors.length > 0 && (
                            <Message error><h3>Error</h3>
                                {this.displayErrors(this.state.errors)}
                            </Message>
                        )}
                        <Message>Don't have a account ? <Link to='/register'> Register</Link></Message>
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}
export default Login