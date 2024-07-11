"use client"
import React from 'react'
import  Link  from "next/link";
import { SiCurl } from "react-icons/si";

type Props = {}

function Logo({}: Props) {
  return (
    <Link href="/" className="flex items-center space-x-2">
    <SiCurl className="flex items-center" /> <span>Shorty</span>
  </Link>
  )
}

export default Logo