import React, { Component } from 'react'
import './App.css'

class App extends Component {
  state = {
    login: null,
    readingLogin: true,
    reservations: [ { user: 'asd' } ]
  }

  componentDidMount() {
    fetch('/api/reservations')
      .then(response => response.text())
      .then(body => {
        this.handleReservationsBody(body)
      }).catch(() => {
        this.setState({
          login: false,
          readingLogin: false
        })
      })
  }

  handleReservationsBody(html) {
    if (html.indexOf && html.indexOf('reservations-table')) {
      this.setState({
        login: true,
        readingLogin: false,
        // TODO:
        reservations: [{
          start: '2019-02-10T16:00:00.000Z',
          end: '2019-02-10T17:00:00.000Z',
          user: 'johndoe'
        }]
      })
    } else {
      throw new Error('not logged in')
    }
  }

  login(username, password) {
    let formData = new FormData()
    formData.append('username', username)
    formData.append('password', password)

    fetch('/api/login', { body: formData, method: 'POST' })
      .then(response => response.text())
      .then(body => {
        this.handleReservationsBody(body)
      }).catch(() => {
        this.setState({
          login: false,
          readingLogin: false
        })
      })
  }

  render() {
    const {
      login,
      readingLogin,
      reservations
    } = this.state

    if (readingLogin) {
      return <p>Ladataan...</p>
    }

    if (!login) {
      return <p>Ladataan...</p>
    }

    return (
      <div className="App">
        <header className="App-header" />
        <h1>Reservations</h1>
        { reservations.map(r => <p children={ r.user } />) }
      </div>
    )
  }
}

export default App
