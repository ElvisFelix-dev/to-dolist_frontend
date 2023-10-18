import { useContext, useEffect, useReducer, useState } from 'react'
import io from 'socket.io-client'

import { toast } from 'react-toastify'

import { IoIosAddCircleOutline } from 'react-icons/io'

import TodoItem from '../../components/TodoItem'

import api from '../../service/api'
import { Store } from '../../service/store'
import { getError } from '../../service/utils'

import imgLogo from '../../assets/imgLogo.png'
import './styles.css'

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }

    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true }
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false }
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false }

    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' }
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: '',
      }
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload }
    default:
      return state
  }
}

export default function Dashboard() {
  const { state } = useContext(Store)
  const { userInfo } = state
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    })

  const [name, setName] = useState('')
  const [todos, setTodos] = useState([])

  /* useEffect(() => {
    const socket = io('http://localhost:3333')

    socket.on('newTodo', (data) => {
      console.log(data)
    })
  }, []) */

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      dispatch({ type: 'UPDATE_REQUEST' })
      await api.post(
        `/todos`,
        {
          name,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        },
      )
      dispatch({
        type: 'UPDATE_SUCCESS',
      })
      toast.success('To-do criado com sucesso')
      setName('')
    } catch (err) {
      toast.error('Erro ao criar seu To-do')
      dispatch({ type: 'UPDATE_FAIL' })
    }
  }

  useEffect(() => {
    // Chama a API para buscar os "to-dos" quando o componente é montado
    const fetchTodos = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' })
        const response = await api.get('/todos', {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        })
        setTodos(response.data)
        dispatch({ type: 'FETCH_SUCCESS' })
      } catch (error) {
        console.error('Erro ao buscar os To-Dos:', error)
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        })
      }
    }

    fetchTodos()
  }, [])

  const deleteHandler = async (todos) => {
    if (window.confirm('Vai apagar mesmo?')) {
      try {
        console.log('To-do ID to delete:', todos._id) // Adicione esta linha
        await api.delete(`/todos/${todos._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        })
        toast.success('To-do apagado com sucesso')
        dispatch({ type: 'DELETE_SUCCESS' })
      } catch (err) {
        toast.error(getError(err))
        console.log(err)
        dispatch({
          type: 'DELETE_FAIL',
        })
      }
    }
  }

  return (
    <>
      <div className="containe">
        <div className="conten">
          <img src={imgLogo} alt="LogoTodo" />

          <form onSubmit={submitHandler}>
            <main className="header">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Adicione uma nova tarefa"
              />
              <button className="bnt">
                <IoIosAddCircleOutline size={30} />
              </button>
            </main>
          </form>

          <div className="list">
            <ul>
              {todos.map((todo) => (
                <TodoItem key={todo._id} todo={todo} onDelete={deleteHandler} />
              ))}
            </ul>{' '}
          </div>
        </div>
      </div>
    </>
  )
}
