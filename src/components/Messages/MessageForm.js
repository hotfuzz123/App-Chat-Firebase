import { Component } from "react";
import { v4 } from 'uuid'
import { Segment, Button, Input } from 'semantic-ui-react'
import firebase from '../../firebase'
import FileModal from './FileModal'
import { Picker, emojiIndex } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'

class MessageForm extends Component {
    state = {
        message: '',
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        loading: false,
        errors: [],
        modal: false,
        uploadState: '',
        uploadTask: null,
        storageRef: firebase.storage().ref(),
        percentUploaded: 0,
        emojiPicker: false
    }

    openModal = () => this.setState({
        modal: true
    })
    closeModal = () => this.setState({
        modal: false
    })
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    handleAddEmoji = (emoji) => {
        const oldMessage = this.state.message
        const newMessage = this.colonToUnicode(`${oldMessage}${emoji.colons}`)
        this.setState({
            message: newMessage,
            emojiPicker: false
        })
    }
    colonToUnicode = message => {
        return message.replace(/:[A-Za-z0-9_+-]+:/g, x => {
            x = x.replace(/:/g, "");
            let emoji = emojiIndex.emojis[x];
            if (typeof emoji !== "undefined") {
                let unicode = emoji.native;
                if (typeof unicode !== "undefined") {
                    return unicode;
                }
            }
            x = ":" + x + ":"
            return x;
        })
    }
    sendMessage = async () => {

        const { messagesRef } = this.props
        const { message, channel } = this.state
        if (message) {
            this.setState({
                loading: true
            })
            try {
                await messagesRef.child(channel.id).push().set(this.createMessage())
                this.setState({
                    loading: false,
                    message: ''
                })
            }
            catch (error) {
                console.error(error)
                this.setState({
                    loading: false,
                    errors: this.state.errors.concat(error)
                })
            }
        } else {
            this.setState({
                errors: this.state.errors.concat({ message: 'Add a message' })
            })
        }
    }
    handleTogglePicker = () => {
        this.setState({
            emojiPicker: !this.state.emojiPicker
        })
    }
    createMessage = (fileURL = null) => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: this.state.user.uid,
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL
            }
        }
        if (fileURL !== null) {
            message['image'] = fileURL
        } else {
            message['content'] = this.state.message
        }
        return message
    }
    uploadFile = (file, metadata) => {
        const pathToUpload = this.state.channel.id
        const ref = this.props.messagesRef
        const filePath = `chat/public/${v4()}.jpg`
        this.setState({
            uploadState: 'uploading',
            uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
        }, () => {
            this.state.uploadTask.on('state_changed', snap => {
                const percentUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
                this.setState({ percentUploaded })
            }, (err) => {
                console.error(err)
                this.setState({
                    errors: this.state.errors.concat(err),
                    uploadState: 'error',
                    uploadTask: null

                })
            }, async () => {
                try {
                    const downloadUrl = await this.state.uploadTask.snapshot.ref.getDownloadURL()
                    this.sendFileMessage(downloadUrl, ref, pathToUpload)
                } catch (err) {
                    console.error(err)
                    this.setState({
                        errors: this.state.errors.concat(err),
                        uploadState: 'error',
                        uploadTask: null
                    })
                }
            }
            )
        }
        )
    }
    sendFileMessage = async (fileUrl, ref, pathToUpload) => {
        try {
            await ref.child(pathToUpload).push().set(this.createMessage(fileUrl))
            this.setState({
                uploadState: 'done'
            })
        } catch (err) {
            console.error(err)
            this.setState({
                errors: this.state.errors.concat(err)
            })
        }
    }

    render() {
        const { errors, message, loading, modal, uploadState, emojiPicker } = this.state
        return (
            <Segment className='message__form'>
                {emojiPicker && (
                    <Picker set='apple' onSelect={this.handleAddEmoji} className='emojipicker' title='Pick your emoji' emoji='point_up' />
                )}
                <Input
                    fluid name='message' style={{ marginBottom: '0.7em' }}
                    label={<Button icon={'add'} onClick={this.handleTogglePicker} />}
                    value={message}
                    onChange={this.handleChange}
                    labelPosition='left'
                    placeholder='Write your message'
                    className={errors.some(error => error.message.includes('message')) ? 'error' : ''}
                />
                <Button.Group icon widths='2'>
                    <Button onClick={this.sendMessage} disabled={loading}
                        style={{ backgroundColor: '#ee9b00' }} content='Add Reply' labelPosition='left' icon='edit' />

                    <Button onClick={this.openModal}
                        style={{ backgroundColor: '#005f73' }} content='Upload Media'
                        labelPosition='right' icon='cloud upload'
                        disabled={uploadState === 'uploading'} />
                    <FileModal modal={modal} closeModal={this.closeModal}
                        uploadFile={this.uploadFile} />
                </Button.Group>
            </Segment>
        )
    }
}
export default MessageForm