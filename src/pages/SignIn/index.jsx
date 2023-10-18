import { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import api from '../../service/api'

import { Store } from '../../service/store'
import { toast } from 'react-toastify'
import { getError } from '../../service/utils'

import imgLogo from '../../assets/imgLogo.png'

import './styles.css'

export default function SignIn() {
  const navigate = useNavigate()
  const { search } = useLocation()
  const redirectInUrl = new URLSearchParams(search).get('redirect')
  const redirect = redirectInUrl || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { state, dispatch: ctxDispatch } = useContext(Store)
  const { userInfo } = state
  const submitHandler = async (e) => {
    e.preventDefault()

    try {
      const { data } = await api.post('/users/signin', {
        email,
        password,
      })
      ctxDispatch({ type: 'USER_SIGNIN', payload: data })
      localStorage.setItem('userInfo', JSON.stringify(data))
      navigate('/')
      toast.success(`Bem vindo`)
    } catch (err) {
      toast.error(getError(err))
    }
  }

  useEffect(() => {
    if (userInfo) {
      navigate(redirect)
    }
  }, [navigate, redirect, userInfo])
  return (
    <>
      <div className="container">
        <div className="content">
          <div className="infoLogo">
            <img src={imgLogo} alt="Logo To-do" />
          </div>
          <form onSubmit={submitHandler}>
            <h2>Conectar</h2>

            <input
              type="email"
              placeholder="Seu Melhor Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Sua Senha Mais Forte"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">Conectar</button>
          </form>
          <span>
            Não tem cadastro? <Link to="/sign-up">Fazer Cadastro</Link>
          </span>
        </div>
      </div>
    </>
  )
}
