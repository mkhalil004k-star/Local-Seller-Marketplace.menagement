import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
function AdminProtected({children}) {

let navigate = useNavigate()

  useEffect(() => {
    async function checkMe() {
      let response = await axios.get(import.meta.env.VITE_beckend_base_URL+"/auth/adminCheckr",{ withCredentials: true });
      if (response.data.success) {
        console.log("The data is working.")
      } else {
        navigate("/login")
      }
    }
    checkMe()
  }, [])


    return (
        <div>

             {children}

        </div>
    )
}

export default AdminProtected