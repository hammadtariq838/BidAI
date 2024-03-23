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

const Screen = () => {
  return (
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
            <span className='font-semibold text-2xl'>MISSISSIPPI DEPARTMENT OF TRANSPORTATION</span>
            <div className="flex items-center px-4 gap-2 border rounded h-[30px] w-[225px] border-[#CBD5E1] mr-12">
              <Search className='h-4 w-4 text-slate-500' />
              <Input type="search" placeholder="Search item" className='border-none rounded-none bg-transparent px-0 h-auto' />
            </div>
          </div>
          <Metadata />
          <div className="flow-root">
            <div className="relative overflow-y-auto h-[400px] rounded-lg border w-max scroll-smooth">
              <Table />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function Metadata() {
  return (
    <div className='flex flex-col w-[674px] border rounded-md divide-y-1 shadow'>
      <div className=' grow flex items-center divide-x-1'>
        <div className='flex items-center w-1/6 h-full px-4 bg-[#F9FAFB]'>
          <h4 className='font-medium text-sm'>
            Description
          </h4>
        </div>
        <div className="flex items-center w-5/6 h-full px-4 py-2">
          <p className='text-sm'>
            Bridge Replacement on SR 178 between Clay County & Alabama State Line, Bridge Nos. 117.1, 115.7, 113.5, 115.0, 119.3, 115.2, 115.4, & 114.8, known as Federal Aid Project No. STP/EXB-2835-00(005) / 100134301 in Itawamba County.
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
            <span className='text-sm'>Bridge</span>
          </div>
          <div className='flex items-center w-1/4 h-full px-4'>
            <span className='text-sm'>Transportation</span>
          </div>
          <div className='flex items-center w-1/4 h-full px-4'>
            <span className='text-sm'>$1,000,000</span>
          </div>
          <div className='flex items-center w-1/4 h-full px-4'>
            <span className='text-sm'>Hennepin</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const items = [
  {
    ref_no: '0010', item: '201-B001', description: 'Clearing and Grubbing', quantity: '1', units: 'LS',
    bidder_1: '1,000,000', bidder_2: '1,000,000', bidder_3: '1,000,000'
  },
  {
    ref_no: '0010', item: '201-B001', description: 'Clearing and Grubbing', quantity: '1', units: 'LS',
    bidder_1: '1,000,000', bidder_2: '1,000,000', bidder_3: '1,000,000'
  },
  {
    ref_no: '0010', item: '201-B001', description: 'Clearing and Grubbing', quantity: '1', units: 'LS',
    bidder_1: '1,000,000', bidder_2: '1,000,000', bidder_3: '1,000,000'
  },
  {
    ref_no: '0010', item: '201-B001', description: 'Clearing and Grubbing', quantity: '1', units: 'LS',
    bidder_1: '1,000,000', bidder_2: '1,000,000', bidder_3: '1,000,000'
  },
  {
    ref_no: '0010', item: '201-B001', description: 'Clearing and Grubbing', quantity: '1', units: 'LS',
    bidder_1: '1,000,000', bidder_2: '1,000,000', bidder_3: '1,000,000'
  },
  {
    ref_no: '0010', item: '201-B001', description: 'Clearing and Grubbing', quantity: '1', units: 'LS',
    bidder_1: '1,000,000', bidder_2: '1,000,000', bidder_3: '1,000,000'
  },
  {
    ref_no: '0010', item: '201-B001', description: 'Clearing and Grubbing', quantity: '1', units: 'LS',
    bidder_1: '1,000,000', bidder_2: '1,000,000', bidder_3: '1,000,000'
  },
]

const headers: Record<string, string> = {
  ref_no: 'Ref#',
  item: 'Item',
  description: 'Description',
  quantity: 'Quantity',
  units: 'Units',
  bidder_1: 'JEM Contracting LLC',
  bidder_2: 'JEM Contracting LLC',
  bidder_3: 'JEM Contracting LLC',
};

function Table() {
  return (
    <table className="w-full rounded-lg divide-y-1">
      <thead className="bg-[#F9FAFB]">
        <tr
        // className='divide-x-1'
        >
          {
            Object.keys(headers).map((key, idx) => (
              <th
                key={idx}
                className="py-3.5 sticky top-0 z-10 bg-[#F9FAFB] font-medium text-start px-4 text-xs"
              >
                {headers[key]}
              </th>
            ))
          }
        </tr>
      </thead>
      <tbody className="divide-y-1">
        {items.map((item, idx) => (
          <tr
            key={idx}
            className='divide-x-1'
          >
            {Object.values(item).map((value, index) => (
              <td
                className="px-4 py-4 whitespace-nowrap text-xs"
                key={index}
              >
                {value}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export const Route = createFileRoute('/_protected/search-by-pay-items')({
  component: Screen
})