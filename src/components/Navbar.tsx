import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { clearAuth } from "@/features/auth/authSlice";
import { useSignoutMutation } from "@/services/user/userApiSlice";
import { toast } from "sonner";
import { Link } from '@tanstack/react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Phone, User, Cog, ArrowLeftSquareIcon } from "lucide-react";


const Navbar = () => {
  const dispatch = useAppDispatch();
  const [signoutApi, { isLoading }] = useSignoutMutation();
  const user = useAppSelector((state) => state.auth.user);

  return (
    <header className="flex flex-col gap-4 h-36 bg-[#023047] px-12 pt-5">
      <div className="flex justify-between items-center">
        <Link to='/'>
          <img src="/logo.svg" alt="BidAI Logo" className='w-[172px] h-[59px]' />
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {/* show the first chracter of the user's name (MH) for Muhammad Hassan */}
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white cursor-pointer">
              {
                user?.account?.name?.split(' ').map((name) => name[0]).join('')
              }
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align='end'>
            <DropdownMenuLabel>{user?.account.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="flex items-center gap-2">
                <Cog className="h-5 w-5" />
                <Link to="/">
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <Link to="/">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                <Link to="/">
                  Contact us
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2">
              <ArrowLeftSquareIcon className="h-5 w-5" />
              <Button
                variant="link"
                className='hover:no-underline p-0 h-auto'
                disabled={isLoading}
                onClick={async () => {
                  try {
                    const res = await signoutApi().unwrap();
                    dispatch(clearAuth());
                    toast.success(res.message);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  } catch (error: any) {
                    toast.error(
                      error?.data?.message || error.error || 'Error: Something went wrong!'
                    );
                    console.log(error);
                  }
                }}
              >
                Logout
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* <nav className="flex items-center gap-4">
        <Link to='/search-by-bids'
          className="text-white"
          activeProps={{
            className: cn(buttonVariants(), 'font-normal bg-[#548C2F]')
          }}
        >
          Search by bids
        </Link>
        <Link to='/search-by-pay-items'
          className="text-white"
          activeProps={{
            className: cn(buttonVariants(), 'font-normal bg-[#548C2F]')
          }}
        >
          Search by pay items
        </Link>
        <Link to='/bid-comparison'
          className="text-white"
          activeProps={{
            className: cn(buttonVariants(), 'font-normal bg-[#548C2F]')
          }}
        >
          Bid comparison
        </Link>
        <Link to='/bid-generation'
          className="text-white"
          activeProps={{
            className: cn(buttonVariants(), 'font-normal bg-[#548C2F]')
          }}
        >
          Bid generation
        </Link>
      </nav> */}
    </header >
  )
}

export default Navbar