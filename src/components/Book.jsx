import React, { useState, useEffect, useRef } from 'react'
import './Book.css'

export default function OrderBook() {
  const [bids, setBids] = useState([])
  const [asks, setAsks] = useState([]) 
  const wsRef = useRef(null)

  useEffect(() => {
    // 1. Connect
    const ws = new WebSocket('wss://api-pub.bitfinex.com/ws/2')
    wsRef.current = ws 

    ws.onopen = () => {
      // 2. Subscribe
      ws.send(JSON.stringify({
        event: 'subscribe',
        channel: 'book',
        symbol: 'tBTCUSD',
        prec: 'P0',
        freq: 'F0',
        len: 25
      }))
    }

    ws.onmessage = (msg) => {
        const data = JSON.parse(msg.data)
        
        if (!Array.isArray(data) || data[1] === 'hb') return
      
        const dataArr = data[1]
        // Detect snapshot vs. single update
        const entries = Array.isArray(dataArr[0])
          ? dataArr  
          : [dataArr]         
      
        entries.forEach(([price, count, amount]) => {
          // Process bid entries
          setBids(prev => {
            const filtered = prev.filter(p => p.price !== price)
            if (count > 0 && amount > 0) {
              filtered.push({ price, count, amount })
            }
            return filtered
              .sort((a, b) => b.price - a.price)
              .slice(0, 25)
          })
          // Process ask entries
          setAsks(prev => {
            const filtered = prev.filter(p => p.price !== price)
            if (count > 0 && amount < 0) {
              filtered.push({ price, count, amount: Math.abs(amount) })
            }
            return filtered
              .sort((a, b) => a.price - b.price)
              .slice(0, 25)
          })
        })
      }      

    return () => {
      ws.close()
    }
  }, [])

  // 5. Determine max size for bar scaling
  const maxBidSize = Math.max(...bids.map(b => b.amount), 1)
  const maxAskSize = Math.max(...asks.map(a => a.amount), 1)

  return (
    <div className="order-book">
      {(bids.length == 0|| asks.length == 0)&& <p className="loading">Loading...</p>}
      {/* Bids (left table) */}
      <table className="bids">
        <thead>
          <tr>
            <th>Price</th>
            <th>Amount</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {bids.map(b => (
            <tr key={b.price}>
              <td className="price">{b.price.toFixed(2)}</td>
              <td className="amount">{b.amount.toFixed(4)}</td>
              <td
                className="depth"
                style={{ '--depth': `${(b.amount / maxBidSize) * 100}%` }}
              >{b.count}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Asks (right table) */}
      <table className="asks">
        <thead>
          <tr>
            <th>Price</th>
            <th>Amount</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {asks.map(a => (
            <tr key={a.price}>
              <td className="price">{a.price.toFixed(2)}</td>
              <td className="amount">{a.amount.toFixed(4)}</td>
              <td
                className="depth"
                style={{ '--depth': `${(a.amount / maxAskSize) * 100}%` }}
              >{a.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  )
}
