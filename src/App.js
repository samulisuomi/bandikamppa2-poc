import React, { Component } from 'react'
import { convert } from 'tabletojson'
import groupBy from 'lodash/groupBy'
import sortBy from 'lodash/sortBy'
import './App.css'

class App extends Component {
  state = {
    login: null,
    readingLogin: true,
    reservationsByDay: null,
    readingReservations: true
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
    const rootHtml = '<table id="reservations-table"'

    if (html.indexOf && html.indexOf(rootHtml)) {
      this.setState({
        login: true,
        readingLogin: false,
        reservationsByDay: this.parseReservations(html.substring(html.indexOf(rootHtml), html.length))
      })
    } else {
      this.setState({
        login: false,
        readingLogin: false
      })
    }
  }

  parseReservations(html) {
    const convertedTables = convert(html)
    if (!convertedTables.length) return null

    const rawReservations = convertedTables[0]
    const formattedReservations = rawReservations.map(r => ({
      day: r['Päivä'],
      timeslot: r['Aika'],
      user: r['Varaaja']
    }))

    const sortedReservations = sortBy(formattedReservations, ['day', 'timeslot'])
    const reservationsByDay = groupBy(sortedReservations, 'day')

    return reservationsByDay 
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
    window.a = this

    const {
      login,
      readingLogin,
      reservationsByDay
    } = this.state

    if (readingLogin) {
      return <p>Ladataan...</p>
    }

    if (!login) {
      return <p>Ladataan...</p>
    }

    if (!reservationsByDay) {
      return <p>Varausten lukeminen epäonnistui.</p>
    }

    const days = Object.keys(reservationsByDay)

    return (
      <div className="App">
        <header className="App-header" />
        <h1>Varaukset</h1>
        { days.map(d => reservationsByDay[d].map(r => (
          <p>
            { r.day } | { r.timeslot } | { r.user }
          </p>
        ))) }
      </div>
    )
  }
}

export default App
