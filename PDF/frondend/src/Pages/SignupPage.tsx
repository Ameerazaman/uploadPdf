import React, { useState, FormEvent } from 'react'
import { UserValidationErrors } from '../Interface/UserValidationErrors'
import { signupUser } from '../Api/User'
import { UserInterface } from '../Interface/UserInterface'
import { useNavigate } from 'react-router-dom'


function SignupPage() {
  const [username, setUsername] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [errors, setErrors] = useState<UserValidationErrors>({});
  const navigate = useNavigate()

  // **********validation***********

  const validation = (): UserValidationErrors => {
    const newErrors: UserValidationErrors = {}
    if (username === '') {
      newErrors.username = "Username is required"
    }
    else if (/\s/.test(username)) {
      newErrors.username = "Username should not contain spaces"
    }
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
    if (confirmPassword === '') {
      newErrors.confirmPassword = "confirmPassword is required"
    }
    else if (/\s/.test(confirmPassword)) {
      newErrors.confirmPassword = "confirmPassword should not contain spaces"
    }
    else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match"
    }
    return newErrors
  }

  // ****************8 submit for signup*************

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const validationErrors = validation();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    else {
      const formData: UserInterface = {
        username,
        email,
        password
      }
      console.log("formData",formData)
      const result = await signupUser(formData)
      console.log(result,"result")
      if (result) {
        navigate('/login')
      }
    }

  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-200">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-900">Signup</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}

              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
            />
            {errors.username && <p className="text-red-500">{errors.username}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
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

              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
            />
            {errors.password && <p className="text-red-500">{errors.password}</p>}
          </div>
          <div>
            <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              id="confirm_password"
              name="confirm_password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}

              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
            />
            {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword}</p>}
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Signup
          </button>
        </form>
        <div className="text-center text-sm text-gray-600">
          <p>Already have an account? <a href="/login" className="text-red-600 hover:text-red-700">Login</a></p>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
