import { useContext, useEffect, useReducer, useState } from 'react'

import { FaCheck, FaTrash } from 'react-icons/fa'

import { toast } from 'react-toastify'

import api from '../service/api'
import { Store } from '../service/store'
import { getError } from '../service/utils'

import '../styles/global.css'

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

const TodoItem = ({ todo, onDelete }) => {
  const [completed, setCompleted] = useState(false)

  const { state } = useContext(Store)
  const { userInfo } = state
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    })

  const handleCheckClick = () => {
    setCompleted(!completed)
  }

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
    <li>
      <span className="check-icon" onClick={handleCheckClick}>
        <FaCheck color="#00FF7F" />
      </span>
      <span className={completed ? 'completed' : ''}>{todo.name}</span>
      <span onClick={() => deleteHandler(todo)}>
        <FaTrash color="#FF6347" className="trash-icon" />
      </span>
    </li>
  )
}

export default TodoItem
