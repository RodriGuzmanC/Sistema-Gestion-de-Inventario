'use server'

import { redirect } from "next/dist/server/api-utils"
import { NextResponse } from "next/server"

const { createClientComponentServer } = require('@/utils/supabase/server.ts')

const signInWith = async (provider: string) => {
    const supabase = await createClientComponentServer()
    
    const auth_callback = `${process.env.NEXT_PUBLIC_ORIGIN}/auth/callback`

    const { data, error } = await supabase.auth.signInWithOAuth({ 
        provider, 
        options: { 
            redirectTo: auth_callback 
        },
    })
    console.log(data)
    if (error) {
        console.log(error)
    }
    if (data?.url) {
        return NextResponse.redirect(data.url); // Redirige al usuario a la URL de Supabase
    }

    return NextResponse.redirect('/');
}

export async function signInWithGoogle() {
    return signInWith('google')
}
