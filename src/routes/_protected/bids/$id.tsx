import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useGetTenderByIdQuery } from '@/services/tender/tenderApiSlice';
import { Tender } from '@/types/primitive.type';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@/components/ui/select';
import { BidGenerationOrder } from '@/constants';
import { formatBudget } from '@/lib/utils';


const Screen = () => {
  const { id } = Route.useParams();
  const { pay_item } = Route.useSearch();
  const { data: tenderData } = useGetTenderByIdQuery({ id, pay_item });
  const tender = tenderData?.tender;
  const [order, setOrder] = useState<'' | BidGenerationOrder>('');

  const navigate = useNavigate({ from: Route.fullPath });

  useEffect(() => {
    toast.info(`Search for ${pay_item}`);
  }, [pay_item]);

  return (
    <div className='flex flex-col bg-white grow rounded-t-lg px-5 py-2 gap-4 pb-10'>
      <div className="flex items-center justify-between">
        <span className='font-semibold text-2xl'>
          {tender?.department}
        </span>
        <form className='flex gap-2'
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const pay_item = formData.get('search') as string;
            navigate({ search: { pay_item } });
          }}
        >
          <div className="flex items-center px-4 gap-2 border rounded w-[225px] border-[#CBD5E1]">
            <Search className='h-4 w-4 text-slate-500' />
            <Input id="search" name="search" type="search" placeholder="Search by pay item ..." className='border-none rounded-none bg-transparent px-0 h-auto outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
              defaultValue={pay_item}
            />
          </div>
          {/* button submit */}
          <Button variant={'outline'}>
            Search
          </Button>
        </form>
        <Dialog>
          <DialogTrigger asChild>
            <Button className='bg-[#023047]'>
              Generate Bid
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] flex flex-col gap-8 py-8">
            <DialogHeader>
              <DialogTitle>Bid Generation</DialogTitle>
              <DialogDescription>
                Select the sorting order for the bid generation
              </DialogDescription>
            </DialogHeader>
            <Select
              value={order}
              onValueChange={(value: BidGenerationOrder) => {
                setOrder(value);
                toast.success(`Sorting order changed to ${value}`);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose the sorting order" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="highest">Highest</SelectItem>
                  <SelectItem value="lowest">Lowest</SelectItem>
                  <SelectItem value="average">Average</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <DialogFooter className='w-max'>
              {/* on generate navigate to the page with the order */}
              <Button type="submit"
                onClick={() => {
                  if (!order) {
                    toast.error('Please select the sorting order!');
                    return;
                  }
                  navigate({
                    to: '/bids/bid-generation',
                    search: { order, id: id }
                  });
                }}
              >Generate</Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Metadata tender={tender} />
      <div className="flow-root">
        <div className="relative overflow-y-auto max-h-[400px] rounded-lg border w-max scroll-smooth">
          <Table tender={tender} />
        </div>
      </div>
    </div>
  );
};

function Metadata({ tender }: {
  tender: Tender | undefined;
}) {
  return (
    <div className='flex flex-col w-[674px] border rounded-md divide-y-1 shadow'>
      <div className=' grow flex items-center divide-x-1'>
        <div className='flex items-center w-1/6 h-full px-4 bg-[#F9FAFB]'>
          <h4 className='font-medium text-sm'>
            Description
          </h4>
        </div>
        <div className="flex items-center w-5/6 h-full px-4 py-2">
          <p className='text-sm line-clamp-3'>
            {tender?.description}
          </p>
        </div>
      </div>
      <div className="flex flex-col divide-y-1">
        <div className='h-[38px] flex items-center bg-[#F9FAFB] font-medium'>
          <span className="w-1/4 px-4 text-sm">Project Type</span>
          <span className="w-1/4 px-4 text-sm">Department</span>
          <span className="w-1/4 px-4 text-sm">Budget</span>
          <span className="w-1/4 px-4 text-sm">County</span>
        </div>
        <div className='h-[72px] grow flex items-center divide-x-1'>
          <div className='flex items-center w-1/4 h-full px-4'>
            <span className='text-sm'>
              {tender?.project_type.join(', ')}
            </span>
          </div>
          <div className='flex items-center w-1/4 h-full px-4'>
            <span className='text-sm'>
              {tender?.department}
            </span>
          </div>
          <div className='flex items-center w-1/4 h-full px-4'>
            <span className='text-sm'>
              {formatBudget(tender?.budget || 0)}
            </span>
          </div>
          <div className='flex items-center w-1/4 h-full px-4'>
            <span className='text-sm'>
              {tender?.county.join(', ')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Table(
  { tender }: {
    tender: Tender | undefined;
  }
) {
  const columnLabels: { [key: string]: string } = {
    ref_no: "Ref No",
    item: "Item",
    item_description: "Item Description",
    item_qnty: "Quantity",
    units: "Units",
  };

  const bidders = tender?.bidders.map(bidder => bidder.name) || [];

  return (
    <>
      {
        tender?.items.length === 0 ? (
          // no items match the search
          <div className='flex items-center justify-center h-40 w-[675px]'>
            <h3 className='text-2xl font-medium'>
              No items matched the search criteria!
            </h3>
          </div>
        ) : (

          <table className="w-full rounded-lg divide-y-1">
            <thead className="bg-[#F9FAFB]">
              <tr>
                {Object.entries(columnLabels).map(([, label], idx) => (
                  <th
                    key={idx}
                    className="py-3.5 sticky top-0 z-10 bg-[#F9FAFB] font-medium text-start px-4 text-xs"
                  >
                    {label}
                  </th>
                ))}
                {bidders.map((_, index) => (
                  <th key={`bid-${index}`} className="py-3.5 px-4 text-xs font-medium text-start sticky top-0 z-10 bg-[#F9FAFB] max-w-[120px]">
                    {bidders[index]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y-1">
              {tender?.items.map((item, itemIdx) => (
                <tr
                  key={itemIdx}
                  className='divide-x-1'
                >
                  {Object.keys(columnLabels).map((key, idx) => (
                    <td
                      className="px-4 py-4 whitespace-wrap text-xs max-w-[200px]"
                      key={idx}
                    >
                      {item[key as keyof typeof item]}
                    </td>
                  ))}
                  {bidders.map((_, bidIdx) => (
                    <td key={`bid-value-${bidIdx}`} className="px-4 py-4 whitespace-nowrap text-xs">
                      {item.bids[bidIdx] ? item.bids[bidIdx] : ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )
      }
    </>
  )
}

const SearchSchema = z.object({
  pay_item: z.string().optional()
});

export const Route = createFileRoute('/_protected/bids/$id')({
  component: Screen,
  validateSearch: SearchSchema
})