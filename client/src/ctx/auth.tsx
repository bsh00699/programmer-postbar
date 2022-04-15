import { createContext, useContext, useReducer } from "react";
import { User } from "../common/types";


interface State {
  authenticated: boolean
  user: User | undefined
}

const StateContext = createContext<State>({
  authenticated: false,
  user: null
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
    default:
      throw new Error(`Unknow action type: ${type}`)
  }
}


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, {
    authenticated: false,
    user: null
  })

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  )
}

export const useAuthState = () => useContext(StateContext)
export const useAuthDispatch = () => useContext(DispatchContext)