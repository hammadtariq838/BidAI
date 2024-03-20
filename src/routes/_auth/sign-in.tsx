import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useSigninMutation } from '@/services/user/userApiSlice'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from 'sonner'
import { useAppDispatch } from '@/app/hooks'
import { setAuth } from '@/features/auth/authSlice'
import { Card } from '@/components/ui/card'
import { Link } from '@tanstack/react-router'
import { EyeOpenIcon, EyeNoneIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

const signinSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
})

const SigninScreen = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const [showPassword, setShowPassword] = useState(false);

  const [loginApi, { isLoading }] = useSigninMutation()

  async function onSubmit(data: z.infer<typeof signinSchema>) {
    const { email, password } = data;
    try {
      const res = await loginApi({
        email,
        password,
      }).unwrap();
      console.log('login', res);
      toast.success(res.message);
      dispatch(setAuth(res));
      navigate({ to: '/' });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        error?.data?.message || error.error || 'Error: Something went wrong!'
      );
      console.log(error);
    }
  }
  return (
    <main className="flex flex-col min-h-screen w-screen">
      <nav className="h-36 bg-[#023047] px-10 pt-5">
        <Link to='/'>
          <img src="/logo.svg" alt="BidAI Logo" className='w-[172px] h-[59px]' />
        </Link>
      </nav>
      <div className='flex items-center justify-center grow h-auto'>
        <Card className='flex flex-col w-full p-8 max-w-sm mx-auto gap-8 bg-[#F2DCA6]'>
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                <div>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email<span className='text-[#C31B1B]'>*</span></FormLabel>
                        <FormControl>
                          <Input type='email' autoComplete='email' placeholder="email@domain.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Password<span className='text-[#C31B1B]'>*</span></FormLabel>
                          <button
                            type="button"
                            className="flex items-center gap-1 cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {!showPassword ? (
                              <EyeOpenIcon className="w-4 h-4" />
                            ) : (
                              <EyeNoneIcon className="w-4 h-4" />
                            )}
                            <span className=" text-sm font-medium">
                              {!showPassword ? 'Show' : 'Hide'}
                            </span>
                          </button>
                        </div>
                        <FormControl>
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            autoComplete='current-password' placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button disabled={isLoading} className='w-full bg-[#40916C]'>Sign in</Button>
              </form>
            </Form>
          </div>
        </Card>
      </div>
    </main>
  )
}


export const Route = createFileRoute('/_auth/sign-in')({
  component: SigninScreen
})