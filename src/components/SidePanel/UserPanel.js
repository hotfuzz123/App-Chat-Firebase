import { Component } from 'react'
import { Dropdown, Grid, Header, Icon, Image } from 'semantic-ui-react'
import firebase from '../../firebase'
import { connect } from 'react-redux'

class UserPanel extends Component {
    state = {
        user: this.props.currentUser
    }


    dropdownOptions = () => [
        {
            key: 'user',
            text: <span>Signed as <strong>{this.state.user.displayName}</strong></span>,
            disabled: true
        }, /* {
            key: 'avatar',
            text: <span>Change Avatar</span>
        }, */ {
            key: 'signout',
            text: <span onClick={this.handleSignout}>Sign Out</span>
        }
    ]

    handleSignout = async () => {
        await firebase.auth().signOut()
        console.log('Signed out')
    }

    render() {
        console.log(this.props.currentUser)
        const { user } = this.state
        return (
            <Grid style={{ background: '#14213d' }}>
                <Grid.Column>
                    <Grid.Row style={{ padding: '1.2em', margin: 0 }}>
                        {/* App Header */}
                        <Header inverted floated='left' as='h2'>
                            <Icon name='stack overflow' />
                            <Header.Content>Chat App</Header.Content>
                        </Header>
                        <Header style={{ padding: '0.25em', paddingTop: '50px', paddingBottom: '30px' }} as='h4' inverted>
                            <Dropdown trigger={
                                <span>
                                    <Image src={user.photoURL} spaced='right' avatar />
                                    {user.displayName}
                                </span>
                            }
                                options={this.dropdownOptions()} />
                        </Header>
                    </Grid.Row>
                    {/* User Dropdown */}

                </Grid.Column>
            </Grid>

        )
    }
}




export default UserPanel