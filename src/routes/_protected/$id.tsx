import { createFileRoute } from '@tanstack/react-router'
import Navbar from '@/components/Navbar';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useGetTenderByIdQuery } from '@/services/tender/tenderApiSlice';
import { Tender } from '@/types/primitive.type';
import { LoadingScreen } from '@/components/Loader';

const Screen = () => {
  const { id } = Route.useParams();
  const { data: tenderData, isLoading } = useGetTenderByIdQuery(id);
  const tender = tenderData?.tender;
  return (
    <>
      {
        isLoading ? <LoadingScreen /> :
          (

            <div className="flex flex-col mx-auto min-h-screen bg-[F9F9FB]">
              <Navbar />
              <div className="h-10 bg-white mx-[53px]" />
              <div className='flex bg-[#F2DCA6] grow pt-2 pr-2 mx-[53px]'>
                <div className='flex flex-col w-28 grow px-[12px] gap-4'>
                  <div>
                    <h3
                      className='font-semibold leading-7 text-base'
                    >Select bid paramters</h3>
                    <Separator className='bg-[#023047] mt-2' />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label>Project type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="-All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apple">Apple</SelectItem>
                        <SelectItem value="banana">Banana</SelectItem>
                        <SelectItem value="blueberry">Blueberry</SelectItem>
                        <SelectItem value="grapes">Grapes</SelectItem>
                        <SelectItem value="pineapple">Pineapple</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label>Contractor</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="-All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apple">Apple</SelectItem>
                        <SelectItem value="banana">Banana</SelectItem>
                        <SelectItem value="blueberry">Blueberry</SelectItem>
                        <SelectItem value="grapes">Grapes</SelectItem>
                        <SelectItem value="pineapple">Pineapple</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Location</Label>
                    <RadioGroup defaultValue="county" className='flex gap-4'>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="county" id="county" className='bg-white' />
                        <Label htmlFor="county">County</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="state" id="state" className='bg-white' />
                        <Label htmlFor="state">State</Label>
                      </div>
                    </RadioGroup>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="-All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apple">Apple</SelectItem>
                        <SelectItem value="banana">Banana</SelectItem>
                        <SelectItem value="blueberry">Blueberry</SelectItem>
                        <SelectItem value="grapes">Grapes</SelectItem>
                        <SelectItem value="pineapple">Pineapple</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* price range (in dollars) {from and to two input fields} */}
                  <div className="flex flex-col gap-1">
                    <Label>Price range (in dollars)</Label>
                    <div className="flex items-center gap-2">
                      <Label className='w-20'>From</Label>
                      <Input type="number" placeholder="" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className='w-20'>To</Label>
                      <Input type="number" placeholder="" />
                    </div>
                  </div>

                  <Button
                    variant='outline'
                    type='reset'
                    className='bg-transparent w-max self-end font-medium border-[#023047]'
                  >
                    Reset Filters
                  </Button>

                </div>
                <div className='flex flex-col bg-white grow rounded-t-lg px-5 py-2 gap-4 pb-10'>
                  <div className="flex items-center justify-between">
                    <span className='font-semibold text-2xl'>
                      {tender?.department}
                    </span>
                    <div className="flex items-center px-4 gap-2 border rounded h-[30px] w-[225px] border-[#CBD5E1] mr-12">
                      <Search className='h-4 w-4 text-slate-500' />
                      <Input type="search" placeholder="Search item" className='border-none rounded-none bg-transparent px-0 h-auto' />
                    </div>
                  </div>
                  <Metadata tender={tender} />
                  <div className="flow-root">
                    <div className="relative overflow-y-auto h-[400px] rounded-lg border w-max scroll-smooth">
                      <Table tender={tender} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
      }
    </>
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
              {tender?.budget}
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

  const maxBids = tender?.items.reduce((max, item) => Math.max(max, item.bids.length), 0) || 0;

  return (
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
          {[...Array(maxBids)].map((_, index) => (
            <th key={`bid-${index}`} className="py-3.5 px-4 text-xs font-medium text-start sticky top-0 z-10 bg-[#F9FAFB]">
              {`Bid ${index + 1}`}
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
                className="px-4 py-4 whitespace-nowrap text-xs"
                key={idx}
              >
                {item[key as keyof typeof item]}
              </td>
            ))}
            {[...Array(maxBids)].map((_, bidIdx) => (
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


export const Route = createFileRoute('/_protected/$id')({
  component: Screen,
})