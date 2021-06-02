import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react'
import UserPanel from './UserPanel'
import Channels from './Channels'
import DirectMessages from './DirectMessages'

class SidePanel extends Component {

    render() {
        const { currentUser } = this.props
        return (
            <Menu size="massive" inverted fixed='left' vertical style={{ background: '#14213d', fontSize: '1.2rem' }} >
                <UserPanel style={{ paddingTop: '20px' }} currentUser={currentUser} />
                <Channels currentUser={currentUser} />
                <DirectMessages currentUser={currentUser} />
            </Menu>
        )
    }
}
export default SidePanel