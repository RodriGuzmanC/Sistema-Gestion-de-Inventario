import React from 'react'
import { createProduct } from '@/utils/supabase/server'
import { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { FormEvent } from 'react'

async function HandleSubmitServer(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const formEntries = Object.fromEntries(formData.entries())
    console.log('Form submitted:', formEntries)
    /** Ingersar data */
    const cookieStore = cookies()
    const client : SupabaseClient = createClient(cookieStore)
    const rows = await createProduct(client, formEntries)
}

export { HandleSubmitServer }
