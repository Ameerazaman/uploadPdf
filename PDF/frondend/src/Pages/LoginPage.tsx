import React, { FormEvent, useState } from 'react'
import { UserValidationErrors } from '../Interface/UserValidationErrors'
import { UserInterface } from '../Interface/UserInterface'
import { loginUser } from '../Api/User'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../App/UserSlice'
import toast from 'react-hot-toast'


function LoginPage() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<UserValidationErrors>({})
  const dispatch = useDispatch() 
  const navigate = useNavigate()
  const validation = (): UserValidationErrors => {
    const newErrors: UserValidationErrors = {}

    if (email === '') {
      newErrors.email = "Email is required"
    }
    else if (/\s/.test(email)) {
      newErrors.email = "Email should not contain spaces"
    }
    if (password === '') {
      newErrors.password = "Password is required"
    }
    else if (/\s/.test(password)) {
      newErrors.password = "password should not contain spaces"
    }
    else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    return newErrors
  }


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const validationErrors = validation();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    else {
      const formData: UserInterface = {
        email,
        password
      }
      const result = await loginUser(formData)
      console.log(result?.data?.user?.data)

      if (result && result?.data?.user?.data) {
        dispatch(signInSuccess(result.data.user.data))
        toast.success("You are Logined Successfully")  // Dispatch action properly
        navigate('/home')
      }
    }

  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-200">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-900">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}

              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
            />
            {errors.password && <p className="text-red-500">{errors.password}</p>}
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Login
          </button>
        </form>
        <div className="text-center text-sm text-gray-600">
          <p>Create a new account? <a href="/signup" className="text-red-600 hover:text-red-700">signup</a></p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
