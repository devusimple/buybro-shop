"use client";

import React, { useState } from 'react'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import db from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { toast } from 'sonner';
import { redirect } from 'next/navigation';
import { Loader2 } from 'lucide-react';


export default function Auth() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState<'email' | 'otp'>("email")
    const [otp, setOtp] = React.useState("")

    const handleContinue = async () => {
        setLoading(true);
        try {
            db.auth.sendMagicCode({ email });
            setStep('otp');
        } catch (error: any) {
            console.log(error)
            toast.error('Uh oh :' + error.body?.message);
        } finally {
            setLoading(false);
        }
    }

    const handleVerify = async () => {
        setLoading(true)
        try {
            db.auth.signInWithMagicCode({ email, code: otp });
            redirect('/dashboard');
        } catch (e: any) {
            toast.error('Uh oh :' + e.body?.message);
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className='w-full h-screen justify-center items-center flex-col'>
            <Card>
                <CardHeader>
                    <CardTitle>Authenticate your role</CardTitle>
                </CardHeader>
                <CardContent>
                    {
                        step === "email" ?
                            (
                                <>
                                    <Field>
                                        <FieldLabel htmlFor="input-field-username">Username</FieldLabel>
                                        <Input
                                            id="input-field-username"
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            required
                                        />
                                        <FieldDescription>
                                            Choose a unique username for your account.
                                        </FieldDescription>
                                    </Field>
                                    <Button onClick={handleContinue}>
                                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Continue"}
                                    </Button>
                                </>
                            )
                            :
                            (
                                <>
                                    <InputOTP disabled={loading} maxLength={6} value={otp} onComplete={handleVerify} onChange={setOtp}>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} aria-invalid />
                                            <InputOTPSlot index={1} aria-invalid />
                                        </InputOTPGroup>
                                        <InputOTPSeparator />
                                        <InputOTPGroup>
                                            <InputOTPSlot index={2} aria-invalid />
                                            <InputOTPSlot index={3} aria-invalid />
                                        </InputOTPGroup>
                                        <InputOTPSeparator />
                                        <InputOTPGroup>
                                            <InputOTPSlot index={4} aria-invalid />
                                            <InputOTPSlot index={5} aria-invalid />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </>
                            )
                    }
                </CardContent>
            </Card>
        </div>
    )
}
