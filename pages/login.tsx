import { useState } from 'react'
import { useRouter } from 'next/router'

function LoginPage() {
  const { push } = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
          credentials: 'include',
        })
        if (res.ok) {
          push('/')
        } else {
          alert('Error!')
        }
      }}
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input type="submit" />
    </form>
  )
}

export default LoginPage
