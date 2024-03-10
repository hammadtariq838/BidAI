import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useNavigate } from 'react-router-dom'
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
      navigate('/profile');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        error?.data?.message || error.error || 'Error: Something went wrong!'
      );
      console.log(error);
    }
  }
  return (
    <>
      <div className="flex min-h-screen w-screen flex-col items-center justify-center">
        <div className="not-prose flex items-center gap-8 my-10">
          <img
            className="mx-auto h-10 w-auto"
            src="/favicon.png"
            alt="BidAI"
          />
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type='password' autoComplete='current-password' placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button disabled={isLoading} className='w-full'>Sign in</Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  )
}

export default SigninScreen
