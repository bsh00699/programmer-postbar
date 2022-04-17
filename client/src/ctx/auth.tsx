import Axios from 'axios'
import { createContext, useContext, useEffect, useReducer } from "react";
import { User } from "../common/types";


interface State {
  authenticated: boolean
  user: User | undefined
  loading: boolean
}

const StateContext = createContext<State>({
  authenticated: false,
  user: null,
  loading: true
})

interface Action {
  type: string
  payload: any
}

const DispatchContext = createContext(null)

const reducer = (state: State, { type, payload }: Action) => {
  switch (type) {
    case 'LOGIN':
      return {
        ...state,
        authenticated: true,
        user: payload
      }
    case 'LOGOUT':
      return {
        ...state,
        authenticated: false,
        user: null
      }
    case 'STOP_LOADING':
      return {
        ...state,
        loading: false
      }
    default:
      throw new Error(`Unknow action type: ${type}`)
  }
}


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, defauleDispatch] = useReducer(reducer, {
    authenticated: false,
    user: null,
    loading: true
  })

  const dispatch = (type: string, payload?: any) => {
    return defauleDispatch({ type, payload })
  }

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await Axios.get('/auth/me')
        dispatch('LOGIN', res.data)
      } catch (err) {
        console.log(err);
      } finally {
        dispatch('STOP_LOADING')
      }
    }
    loadUser()
  }, [])

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  )
}

export const useAuthState = () => useContext(StateContext)
export const useAuthDispatch = () => useContext(DispatchContext)