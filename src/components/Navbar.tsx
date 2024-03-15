import { useAppDispatch } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { clearAuth } from "@/features/auth/authSlice";
import { useSignoutMutation } from "@/services/user/userApiSlice";
import { toast } from "sonner";
import { Link } from '@tanstack/react-router';

const Navbar = () => {
  const dispatch = useAppDispatch();
  const [signoutApi, { isLoading }] = useSignoutMutation();
  return (
    <nav className="py-2">
      <div className="flex h-16 justify-between items-center">
        <div className="flex">
          <div className="flex flex-shrink-0 items-center">
            <Link to='/'>
              <h2 className="font-bold text-3xl">BidAI</h2>
            </Link>
          </div>
        </div>
        <Button variant={"outline"}
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
          }
          }
        >Signout</Button>
      </div>
    </nav>
  )
}

export default Navbar