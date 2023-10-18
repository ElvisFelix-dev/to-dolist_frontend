import { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import api from '../../service/api'

import { Store } from '../../service/store'

import { getError } from '../../service/utils'

import imgLogo from '../../assets/imgLogo.png'

import './styles.css'

export default function SignUp() {
  const navigate = useNavigate()
  const { search } = useLocation()
  const redirectInUrl = new URLSearchParams(search).get('redirect')
  const redirect = redirectInUrl || '/'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { state, dispatch: ctxDispatch } = useContext(Store)
  const { userInfo } = state
  const submitHandler = async (e) => {
    e.preventDefault()

    try {
      const { data } = await api.post('/users/signup', {
        name,
        email,
        password,
      })
      ctxDispatch({ type: 'USER_SIGNIN', payload: data })
      localStorage.setItem('userInfo', JSON.stringify(data))
      navigate('/sign-in')
      toast.success('Usuário criado com sucesso')
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
            <h2>Fazer Cadastro</h2>

            <input
              type="text"
              placeholder="Nome Completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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

            <button type="submit">Cadastrar</button>
          </form>
          <span>
            Já tem cadastro? <Link to="/">Entrar</Link>
          </span>
        </div>
      </div>
    </>
  )
}
