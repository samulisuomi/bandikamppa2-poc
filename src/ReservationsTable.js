import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import Table from 'react-bootstrap/Table'

import './ReservationsTable.css'

export default class ReservationsTable extends PureComponent {
  static propTypes = {
    reservations: PropTypes.array.isRequired
  }

  render() {
    const {
      reservations
    } = this.props

    const userIdToLightenMap = reservations.reduce((accumulator, reservation) => {

      const { previousUser, previousLighten, userIdToLightenMap } = accumulator
      const { id, user } = reservation

      const lighten = accumulator.previousUser && (previousUser !== user) ?
        !previousLighten : previousLighten

      return {
        previousUser: user,
        previousLighten: lighten,
        userIdToLightenMap: {
          ...userIdToLightenMap,
          [id]: lighten
        }
      }
    }, { previousUser: null, previousLighten: false, userIdToLightenMap: {} })['userIdToLightenMap']

    return (
      <div className="ReservationsTable">
        <h1>Varaukset</h1>
        <Table
          bordered
          hover
          variant="dark"
        >
          <thead>
            <tr>
              <th>Päivä</th>
              <th>Aika</th>
              <th>Varaaja</th>
            </tr>
          </thead>
          <tbody>
            { reservations.map(r => {
                return (
                  <tr key={ r.id } className={ userIdToLightenMap[r.id] ? 'lighten' : null }>
                    <td>{ r.day }</td>
                    <td>{ r.timeslot }</td>
                    <td>{ r.user }</td>
                  </tr>
                )
              })
            }
          </tbody>
        </Table>
      </div>
    )
  }
}
