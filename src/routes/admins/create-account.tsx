import { createFileRoute } from '@tanstack/react-router'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useCreateAccountMutation } from '@/services/user/userApiSlice'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from 'sonner'
import { Link } from '@tanstack/react-router';
import { Card } from '@/components/ui/card';

const createAccountSchema = z.object({
  name: z.string().min(3, { message: 'Invalid name' }),
  email: z.string().email({ message: 'Invalid email' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
})

const CreateAccountScreen = () => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof createAccountSchema>>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const [registerApi, { isLoading }] = useCreateAccountMutation()

  async function onSubmit(data: z.infer<typeof createAccountSchema>) {
    const { name, email, password } = data;
    try {
      const res = await registerApi({
        name,
        email,
        password,
      }).unwrap();
      toast.success(res.message);
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
    <main className="flex flex-col min-h-screen w-screen gap-12">
      <nav className="py-2 px-40">
        <div className="flex h-16 justify-between items-center">
          <div className="flex flex-shrink-0 items-center">
            <Link to='/'>
              <h2 className="font-bold text-3xl">BidAI</h2>
            </Link>
          </div>
        </div>
      </nav>
      <Card className='flex flex-col w-full p-8 max-w-sm mx-auto'>
        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Create user account
        </h2>

        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input type='text' autoComplete='name' placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
              <Button disabled={isLoading} className='w-full'>Submit</Button>
            </form>
          </Form>
        </div>
      </Card>
    </main>
  );
};

export const Route = createFileRoute('/admins/create-account')({
  component: CreateAccountScreen
})