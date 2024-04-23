import Image from 'next/image'
import React from 'react'

const Logo = () => {
  return (
    <Image src={"/logo.svg"} height={130} width={130} alt='Logo' priority />
  )
}

export default Logo