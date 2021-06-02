import React, { Component } from 'react';
import { Segment, Comment } from 'semantic-ui-react'
import MessagesHeader from './MessagesHeader'
import MessageForm from './MessageForm'
import firebase from '../../firebase'
import Message from './Message'
import Skeleton from './Skeleton'

class Messages extends Component {
    state = {
        privateChannel: this.props.isPrivateChannel,
        messagesRef: firebase.database().ref("messages"),
        messages: [],
        messagesLoading: true,
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        numUniqueUsers: '',
        searchTerm: '',
        searchLoading: false,
        searchResults: []
    }
    componentDidMount() {
        const { channel, user } = this.state;

        if (channel && user) {
            this.addListeners(channel.id);
        }
    }
    addListeners = channelId => {
        this.addMessageListener(channelId);
    }
    addMessageListener = channelId => {
        let loadedMessages = [];
        this.state.messagesRef.child(channelId).on("child_added", snap => {
            loadedMessages.push(snap.val());
            this.setState({
                messages: loadedMessages,
                messagesLoading: false
            })
            this.countUniqueUsers(loadedMessages)
        })
    }
    countUniqueUsers = (messages) => {
        const uniqueUsers = messages.reduce((acc, message) => {
            if (!acc.includes(message.user.name)) {
                acc.push(message.user.name)
            } return acc
        }, [])
        const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0
        const numUniqueUsers = `${uniqueUsers.length} user${plural ? 's' : ''} joined`
        this.setState({
            numUniqueUsers
        })
    }
    displayMessages = messages => {
        return messages.length > 0 && messages.map(message => (
            <Message
                key={message.timestamp}
                message={message}
                user={this.state.user}
            />
        ))
    }
    displayChannelName = (channel) => {
        return channel ? `${this.setState.privateChannel ? '@' : '#'}${channel.name}` : ''
    }
    handleSearchChange = (event) => {
        this.setState({
            searchTerm: event.target.value,
            searchLoading: true
        }, () => this.handleSearchMessages())
    }
    handleSearchMessages = () => {
        const channelMessages = [...this.state.messages]
        const regex = new RegExp(this.state.searchTerm, 'gi') // caseSentitive
        const searchResults = channelMessages.reduce((acc, message) => {
            if (message.content && message.content.match(regex) || message.user.name.match(regex)) {
                acc.push(message)
            }
            return acc
        }, [])
        this.setState({ searchResults })
        setTimeout(() => this.setState({ searchLoading: false }), 1000)
    }
    displayMessageSkeleton = (loading) =>
        loading ? (
            <React.Fragment>
                {[...Array(10)].map((_, i) => (
                    <Skeleton key={i} />
                ))}
            </React.Fragment>
        ) : null

    render() {
        const { messagesRef, channel, user, messages, numUniqueUsers, searchResults, searchTerm, searchLoading, privateChannel, messagesLoading } = this.state
        return (
            <React.Fragment >
                <MessagesHeader channelName={this.displayChannelName(channel)} numUniqueUsers={numUniqueUsers}
                    handleSearchChange={this.handleSearchChange} searchLoading={searchLoading}
                    isPrivateChannel={privateChannel} />
                < Segment style={{ marginLeft: '130px', width: '800px' }}>
                    <Comment.Group className='messages'>
                        {this.displayMessageSkeleton(messagesLoading)}
                        {searchTerm ? this.displayMessages(searchResults) : this.displayMessages(messages)}
                    </Comment.Group>
                </Segment>
                <MessageForm messagesRef={messagesRef} currentChannel={channel} currentUser={user} isPrivateChannel={privateChannel} />
            </React.Fragment>
        )
    }
}
export default Messages