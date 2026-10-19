import axios from 'axios';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function AuthRedirect() {
  let navigate = useNavigate()

  useEffect(() => {
    async function checkMe() {
      let response = await axios.get(`${import.meta.env.VITE_beckend_base_URL}/auth/checkAuth`, { withCredentials: true });

      if (!response.data.success) {
        navigate("/login")
        return
      }

      // yahan role ke hisab se alag alag jagah bhej rahe hain
      if (response.data.role === "admin") {
        navigate("/admin-dashboard")
      } else if (response.data.role === "seller") {
        navigate("/seller-dashboard")
      } else if (response.data.role === "buyer") {
        navigate("/buyer-home")
      } else {
        navigate("/login")
      }
    }
    checkMe()
  }, [])

  return <div>Loading...</div>
}

export default AuthRedirect