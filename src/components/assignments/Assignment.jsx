import React from 'react'
import CoverPageGenerator from './CoverPageGenerator'
import L1 from './L1'
import { useParams } from 'react-router-dom'


const Assignment = () => {

  const { custom } = useParams();

  return (
    <div>
      {custom === "custom" ? <CoverPageGenerator /> :  <L1/>}
       
    </div>
  )
}

export default Assignment