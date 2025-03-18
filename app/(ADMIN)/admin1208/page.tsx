"use server"

import React from 'react'
import { getUserInfo } from '@/actions/auth'
import { AuthAdmin } from '@/components/AuthAdmin';

export default async function AdminPage() {
  const user = await getUserInfo();
  console.log(user);

  if (user?.role !== "ADMIN") {
    return <div className="flex justify-center items-center h-screen"><AuthAdmin /></div>;
  }

  return (
    <div>
      <h1>Admin Page</h1>
    </div>
  )
}
